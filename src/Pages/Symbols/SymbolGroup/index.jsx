import React, { useEffect, useState } from 'react'
import {  Spin, theme,Input } from 'antd';
import {PlusCircleOutlined, EditOutlined, DeleteOutlined,CaretUpOutlined, CaretDownOutlined} from '@ant-design/icons';
import ARROW_UP_DOWN from '../../../assets/images/arrow-up-down.png'
import CustomTable from '../../../components/CustomTable';
import CustomButton from '../../../components/CustomButton';
import { AddnewStyle } from '../../Brand/style';
import CustomTextField from '../../../components/CustomTextField';
import { Symbol_Group_List, DeleteSymbolsGroup } from '../../../utils/_SymbolGroupAPI';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { setSymbolGroupsSelectedIDs,setSymbolGroupsData } from '../../../store/symbolGroupsSlice';

const Index = () => {
  const dispatch = useDispatch()
  const {
    token: { colorBG, TableHeaderColor, Gray2, colorPrimary  },
  } = theme.useToken();
  const token = useSelector(({user})=> user?.user?.token )
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [SymbolList, setSymbolList] = useState([])
  const [CurrentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [isUpdated, setIsUpdated] = useState(true)
  const [sortDirection, setSortDirection] = useState("")
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');

  const headerStyle = {
    background: TableHeaderColor, // Set the background color of the header
    color: 'black', // Set the text color of the header
  };
  const columns = [
    {
      title:<span className="dragHandler">Name</span>,
      dataIndex: 'name',
      key: '1',
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; 
      },
   
    },
    {
      title:<span className="dragHandler">Leverage</span>,
      dataIndex: 'leverage',
      key: '2',
      sorter: (a, b) => a.leverage.length - b.leverage.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />;  // Return null if no sorting direction is set
      },
    },
    {
      title:<span className="dragHandler">Swap</span>,
      dataIndex: 'swap',
      key: '3',
      sorter: (a, b) => a.swap.length - b.swap.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title:<span className="dragHandler">Lot Size</span>,
      dataIndex: 'lot_size',
      key: '4',
      sorter: (a, b) => a.lot_size.length - b.lot_size.length,
       sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title:<span className="dragHandler">Lot Steps</span>,
      dataIndex: 'lot_step',
      key: '5',
      sorter: (a, b) => a.lot_step.length - b.lot_step.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title:<span className="dragHandler">Minimum Value</span>,
      dataIndex: 'vol_min',
      key: '6',
      sorter: (a, b) => a.vol_min.length - b.vol_min.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
     
      title:<span className="dragHandler">Maximum Value</span>,
      dataIndex: 'vol_max',
      key: '7',
      sorter: (a, b) => a.vol_max.length - b.vol_max.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title:<span className="dragHandler">Symbol Group TI</span>,
      dataIndex: 'trading_interval',
      key: '8',
      sorter: (a, b) => a.trading_interval.length - b.trading_interval.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title:<span className="dragHandler">Symbols</span>,
      render: (text)=> <Link to={'#'} className='text-sm font-semibold cursor-pointer' style={{color: colorPrimary }}>View Details</Link>,
      key: '9',
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
      
    },
    // {
    //   title: 'Action',
    //   key: 'action',
    //   render: (_, record) => (
    //     <Space size="middle" className='cursor-pointer'>
    //      <Link to={`/symbol-groups/${record.id}`}><EditOutlined style={{fontSize:"24px", color: colorPrimary }}  /></Link> 
    //        <DeleteOutlined style={{fontSize:"24px", color: colorPrimary }} onClick={()=> DeleteHandler(record.id)} />
    //     </Space>
    //   ),
    // },
  ];

  

const FetchData = async (page) =>{
    setIsLoading(true)
    const res = await Symbol_Group_List(token,page,parseInt(perPage))
  const {data:{message, payload, success}} = res
    setIsLoading(false)
    if(success){
   
      setCurrentPage(payload.current_page)
      setLastPage(payload.last_page)
      setTotalRecords(payload.total)
      setSymbolList(payload.data)
      setIsUpdated(false)
    }
}
const DeleteHandler = async (id)=>{
  setIsLoading(true)
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#1CAC70",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then(async(result) => {
    if (result.isConfirmed) {
      const res = await DeleteSymbolsGroup(id, token)
      const {data:{success, message, payload}} = res
      setIsLoading(false)
      if(success){
        Swal.fire({
          title: "Deleted!",
          text: message,
          icon: "success"
        });
        FetchData(page)
      }else{
        Swal.fire({
          title: "Opps!",
          text: {message},
          icon: "error"
        });
      }
     
    }
  });
 
  setIsLoading(false)
 
}

 const onPageChange = (page) =>{
    FetchData(page)
  }

useEffect(() => {
  setIsUpdated(true)
  FetchData(CurrentPage)
}, [perPage])

  return (
    <Spin spinning={isLoading} size="large">
    <div className='p-8' style={{ backgroundColor: colorBG }}>
    <div className='flex flex-col sm:flex-row items-center gap-2 justify-between'>
      <h1 className='text-2xl font-semibold'>Symbol Group</h1>
      <div className='flex items-center gap-4'>
       <CustomTextField label={'Search'} varient={'outlined'} sx={{height:'48px'}} />
        <CustomButton
          Text='Add New Symbol Group'
          style={AddnewStyle}
          icon={<PlusCircleOutlined />}
          onClickHandler={()=> { 
            dispatch(setSymbolGroupsSelectedIDs([0]))
            navigate('/symbol-groups-entry')
          }}
        />
       
      </div>
    </div>

    <div className='mb-5'>
      <CustomTable
          direction="/symbol-groups-entry"
          formName = "Symbol Groups" 
          columns={columns}
          data={SymbolList} 
          headerStyle={headerStyle}
          total={totalRecords}
          onPageChange = {onPageChange}
          current_page={CurrentPage}
          token = {token}
          isUpated={isUpdated}
          setSelecetdIDs={setSymbolGroupsSelectedIDs}
          setTableData = {setSymbolGroupsData}
          table_name= "symbel_groups"
          setSortDirection = {setSortDirection}
          perPage={perPage}
          setPerPage={setPerPage}

        />
      </div>
       
  </div>
  </Spin>
  )
}

export default Index