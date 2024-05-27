import React, { useEffect, useState } from 'react'
import { Space, Spin, theme } from 'antd';
import { DeleteOutlined, EditOutlined, CaretUpOutlined,CaretDownOutlined , PlusCircleOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

import CustomTable from '../../components/CustomTable'
import CustomButton from '../../components/CustomButton'
import CustomModal from '../../components/CustomModal'
import BrandModal from './BrandModal';
import ARROW_UP_DOWN from '../../assets/images/arrow-up-down.png'
import { ToastContainer } from 'react-toastify';
import { AddnewStyle, footerStyle, submitStyle } from './style';
import { Brands_List, DeleteBrand } from '../../utils/_APICalls';
import { useDispatch, useSelector } from 'react-redux';

import { Stack, Typography } from '@mui/material';

import { ColumnSorter, CustomDeleteDeleteHandler } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';
import { setBrandData, setBrandSelectedIDs, setBrandUser  } from '../../store/BrandsSlice';

const BrandList = () => {
  const token = useSelector(({ user }) => user?.user?.token)
  const dispatch = useDispatch();
  
  const { token: { colorBG, TableHeaderColor, colorPrimary } } = theme.useToken();


  const columns = [
    // {
    //   title:<span className="dragHandler">Id</span>,
    //   dataIndex: 'id',
    //   key: '1',
    //   hidden: true,

      
    // },
    {
      title:<span className="dragHandler">Name</span>,
      dataIndex: 'name',
      key: '1',
      sorter:(a, b) =>  ColumnSorter(a.name,b.name),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
     
      title:<span className="dragHandler">Domain</span>,
      dataIndex: 'domain',
      key: '2',
      sorter:(a, b) =>  ColumnSorter(a.domain,b.domain),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    
   
    {
      title:<span className="dragHandler">Password</span>,
      dataIndex: 'user_password',
      key: '3',
      sorter: (a, b) => a.user_password - b.user_password,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    
    {
      
      title:<span className="dragHandler">Authorization Key</span>,
      dataIndex: 'public_key',
      key: '4',
      render: (_, record) => (

        <Stack direction="row" justifyContent={'space-between'} alignItems={'center'}>
          <Typography sx={{ fontWeight:  400, fontSize: "14px" }}>{visibleBrandId === record.id ? record.public_key : '................'}</Typography>
          {/* <Typography sx={{ fontWeight: showKey ? 400 : 700, fontSize: showKey ? "14px" : "22px" }}>{visibleBrandId === record.id ? record.public_key : '................'}</Typography> */}

          <Space size="middle" className='cursor-pointer'>
            {visibleBrandId === record.id ?
              <EyeInvisibleOutlined style={{ fontSize: "24px", color: colorPrimary }} onClick={() => toggleKey(record)} /> :
              <EyeOutlined style={{ fontSize: "24px", color: colorPrimary }} onClick={() => toggleKey(record.id)} />
            }
          </Space>
        </Stack>
      ),
      sorter: (a, b) => a.public_key - b.public_key,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
 
      title:<span className="dragHandler">Margin Calls</span>,
      dataIndex: 'margin_call',
      key: '5',
      sorter: (a, b) => a.margin_call - b.margin_call,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },

    },
    {
 
      title:<span className="dragHandler">Leverage</span>,
      dataIndex: 'leverage',
      key: '6',
      sorter:(a, b) => {
        // Split the ratio values and parse them as numbers
        const ratioA = a.leverage.split(':').map(Number);
        const ratioB = b.leverage.split(':').map(Number);
        
        // Compare the ratio values
        if (ratioA[0] === ratioB[0]) {
          return ratioA[1] - ratioB[1];
        }
        return ratioA[0] - ratioB[0];
      },
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },

    },
     {
      title:<span className="dragHandler">Action</span>,
      dataIndex: 'permission', 
      key: '7',
      render: (_, record) => <span className='cursor-pointer' style={{ color: colorPrimary, fontWeight: '600' }} onClick={() => openPermissions(record)}>Permissions</span>
     },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [BrandsList, setBrandsList] = useState([]) 
  const defaultCheckedList = columns.map((item) => item.key);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [newColumns , setNewColumns] = useState(columns)
  const [BrandID, setBrandID] = useState(null);
  const [visibleBrandId, setVisibleBrandId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [isUpdated, setIsUpdated] = useState(true)
  const [sortDirection, setSortDirection] = useState("")
  const [perPage, setPerPage] = useState(10)



   
  const [CurrentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const navigate = useNavigate()

  const fetchBrands = async (page) => {
    setIsLoading(true)
    const mData = await Brands_List(token,page)
    const { data: { message, payload, success } } = mData
    
      setIsLoading(false)
      setCurrentPage(payload.current_page)
      setLastPage(payload.last_page)
      setTotalRecords(payload.total)
      setIsUpdated(false)
    if (success) {

      const brandData = payload.data.map((brand)=>({
        id:brand?.id,
        user_id:brand?.user_id,
        domain:brand?.domain,
        name:brand?.name,
        original_password: brand?.user?.original_password,
        public_key: brand?.public_key,
        margin_call:brand?.margin_call,
        leverage: brand?.leverage,
        permissions: brand?.user?.permissions
      }))
      

      setBrandsList(brandData)
      // debugger
      setCurrentPage(payload.current_page)
      setLastPage(payload.last_page)
      setTotalRecords(payload.total)


    }
  }

  const openPermissions = (user)=>{
    navigate('/brand-permissions')
    const payload = { user_id:user.user_id,permissions:user.permissions} 
    dispatch(setBrandUser(payload))
  }

  useEffect(() => {
    setIsUpdated(true)
    fetchBrands(CurrentPage)
  }, [perPage])

  useEffect(() => {
    const newCols = columns.filter(x => checkedList.includes(x.key));
    setNewColumns(newCols)
    }, [checkedList]);


  const showModal = (id = null) => {
    setBrandID(id)
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const toggleKey = (id) => {

    setVisibleBrandId(id)
    setShowKey(!showKey)

  }

     const onPageChange = (page) =>{
   
        fetchBrands(page)
    }

  const headerStyle = {
    background: TableHeaderColor,
    color: 'black', 
  };

  const LoadingHandler = React.useCallback((isLoading)=>{
    setIsLoading(isLoading)
  },[])
  return (
    <Spin spinning={isLoading} size="large">
      <div className='p-8' style={{ backgroundColor: colorBG }}>
        <div className='flex flex-col sm:flex-row items-center gap-2 justify-between'>
          <h1 className='text-2xl font-semibold'>Brand List</h1>
          <div>
            <CustomButton
              Text='Add New Brand'
              style={AddnewStyle}
              icon={<PlusCircleOutlined />}
              onClickHandler={() => 
                {
                dispatch(setBrandSelectedIDs([0]))
                navigate('/brand-entry')
                }// showModal(0)
              }
            />
          </div>
        </div>
      
        <CustomTable
            direction="/brand-entry"
            formName = "Brand List" 
            columns={columns}
            data={BrandsList} 
            headerStyle={headerStyle}
            total={totalRecords}
            onPageChange = {onPageChange}
            current_page={CurrentPage}
            token = {token}
            setTotalRecords={setTotalRecords}
            isUpated={isUpdated}
            setSelecetdIDs={setBrandSelectedIDs}
            setTableData = {setBrandData}
            table_name= "brands"
            setSortDirection = {setSortDirection}
            perPage={perPage}
            setPerPage={setPerPage}
            SearchQuery = {Brands_List}
            LoadingHandler={LoadingHandler}
            setCurrentPage={setCurrentPage}
            setLastPage={setLastPage}
          />
        {/* <CustomModal
          isModalOpen={isModalOpen}
          handleOk={handleOk}
          handleCancel={handleCancel}
          title={''}
          width={800}
          footer={null}

        >
          <BrandModal
            setIsModalOpen={setIsModalOpen}
            fetchBrands={fetchBrands}
            BrandID={BrandID}
          />
        </CustomModal> */}
      </div>
      <ToastContainer />
    </Spin>
  )
}
export default BrandList