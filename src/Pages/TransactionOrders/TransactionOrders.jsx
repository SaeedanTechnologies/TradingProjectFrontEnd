import {  Spin, theme } from 'antd';
import React, { useEffect, useState } from 'react'
import CustomTable from '../../components/CustomTable';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';

import { Link, json, useNavigate } from 'react-router-dom';
import { Search_Transaction_Ordcer, Trading_Transaction_Order } from '../../utils/_SymbolSettingAPICalls';
import { useSelector,useDispatch } from 'react-redux';
import { setTransactionsOrdersSelectedIDs,setTransactionOrdersData,deleteTransactionOrderById } from '../../store/transactionOrdersSlice';
import ARROW_UP_DOWN from '../../assets/images/arrow-up-down.png'

const TransactionOrders = () => {

  const userRole = useSelector((state)=>state?.user?.user?.user?.roles[0]?.name);
  const userBrand = useSelector((state)=> state?.user?.user?.brand)
  const token = useSelector(({ user }) => user?.user?.token)
  const {
    token: { colorBG, colorPrimary, TableHeaderColor },
  } = theme.useToken();
  const [IsShowFilter, setIsShowFilter] = useState(false)
  const [TypeList, setTypeList] = useState([])
  const [SelectedType, setSelectedType] = useState(null)
  const [SelectedMethod, setSelectedMethod] = useState([])
  const [isUpdated, setIsUpdated] = useState(true)
  const [sortDirection, setSortDirection] = useState("")
  const [perPage, setPerPage] = useState(10)




  const columns = [
    // {
    //   title: 'LoginID',
    //   dataIndex: 'LoginID',
    //   key: '1',
    // },
    {
      title:<span className="dragHandler">OrderID</span>,
      dataIndex: 'id',
      key: '1',
      sorter: (a, b) => a?.id?.length - b?.id?.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title:<span className="dragHandler">Name</span>,
      dataIndex: 'name',
      key: '3',
      sorter: (a, b) => a?.name?.length - b?.name?.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },

    },
    {
      title:<span className="dragHandler">Group</span>,
      dataIndex: 'group',
      key: '4',
      sorter: (a, b) => a?.group?.length - b?.group?.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },

      
    },
    {
      title:<span className="dragHandler">Country</span>,
      dataIndex: 'country',
      key: '5',
      sorter: (a, b) => a?.country?.length - b?.country?.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title:<span className="dragHandler">Phone Number</span>,
      dataIndex: 'phone',
      key: '6',
      sorter: (a, b) => a?.phone?.length - b?.phone?.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title:<span className="dragHandler">Email</span>,
      dataIndex: 'email',
      key: '7',
      sorter: (a, b) => a?.email?.length - b?.email?.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title:<span className="dragHandler">Time</span>,
      dataIndex: 'created_at',
      key: '8',
      sorter: (a, b) => a?.created_at?.length - b?.created_at?.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title:<span className="dragHandler">Type</span>,
      dataIndex: 'type',
      key: '9',
      sorter: (a, b) => a?.type?.length - b?.type?.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },

    },
    {
     
      title:<span className="dragHandler">Method</span>,
      dataIndex: 'method',
      key: '10',
      sorter: (a, b) => a?.method?.length - b?.method?.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title:<span className="dragHandler">Comment</span>,
      dataIndex: 'comment',
      key: '11',
      sorter: (a, b) => a?.comment?.length - b?.comment?.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title:<span className="dragHandler">Amount</span>,
      dataIndex: 'amount',
      key: '12',
      sorter: (a, b) => a?.amount?.length - b?.amount?.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title:<span className="dragHandler">Currency</span>,
      dataIndex: 'currency',
      key: '13',
      sorter: (a, b) => a?.currency?.length - b?.currency?.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    // {
    //   title: 'Actions',
    //   dataIndex: 'type',
    //   key: '9',
    //   render: (_, record) => (
    //     <Space size="middle" className='cursor-pointer'>
    //       <Link to={"/transaction-orders/:0"}><EditOutlined style={{ fontSize: "24px", color: colorPrimary }} /></Link>
    //       <DeleteOutlined style={{ fontSize: "24px", color: colorPrimary }} />
    //     </Space>
    //   ),
    // },
  ];
    
  const defaultCheckedList = columns.map((item) => item.key);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [newColumns , setNewColumns] = useState(columns)
  

  const [isLoading, setIsLoading] = useState(false)
  const [transactionData, setTransactionData] = useState([])
  const [CurrentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)


  const fetchTransactionOrder = async (brandId,page) => {
    setIsLoading(true)
  //  debugger
    const res = await Trading_Transaction_Order(token,brandId,page,parseInt(perPage))
    const { data: { message, payload, success } } = res
    setIsLoading(false)
    if (success) {
      setCurrentPage(payload.current_page)
      setTransactionData(payload.data)
      setLastPage(payload.last_page)
      setTotalRecords(payload.total)
    
    }
  }
  useEffect(() => {
     if(userRole === 'brand' ){
      fetchTransactionOrder(userBrand.public_key,CurrentPage)
    }
    else{
      fetchTransactionOrder(null,CurrentPage)
    }
  }, [])

 useEffect(() => {
        const newCols = columns.filter(x => checkedList.includes(x.key));
        setNewColumns(newCols)
  }, [checkedList]);

   useEffect(() => {
    setIsUpdated(true)
     if(userRole === 'brand' ){
      fetchTransactionOrder(userBrand.public_key,CurrentPage)
    }
    else{
      fetchTransactionOrder(null,CurrentPage)
    }
  }, [perPage])

  const onPageChange = (page) =>{
      if(userRole === 'brand' ){
      fetchTransactionOrder(userBrand.public_key,page)
    }
    else{
      fetchTransactionOrder(null,page)
    }
  }

  const LoadingHandler = React.useCallback((isLoading)=>{
    setIsLoading(isLoading)
  },[])

  const headerStyle = {
    background: TableHeaderColor,
    color: 'black',
  };
  return (
    <Spin spinning={isLoading} size="large">
      <div className='p-8 w-full' style={{ backgroundColor: colorBG }}>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>Transactions Orders</h1>
           {/* <CustomButton
            Text={'Add New Transaction Order'}
            style={{ height: '48px', borderRadius: '8px' }}
             onClickHandler={() =>{
                dispatch(setTransactionsOrdersSelectedIDs([0]))
                navigate('/transaction-orders-entry')
              }}
          /> */}
          
        </div>
        
         
        <div className="mb-6">
          <CustomTable
              direction="/transaction-orders-entry"
              formName = "Transactions Orders" 
              columns={newColumns}
              data={transactionData} 
              headerStyle={headerStyle}
              total={totalRecords}
              onPageChange = {onPageChange}
              current_page={CurrentPage}
              token = {token}
              isUpated={isUpdated}
              setSelecetdIDs={setTransactionsOrdersSelectedIDs}
              setTableData = {setTransactionOrdersData}
              table_name= "transaction_orders"
              setSortDirection = {setSortDirection}
              perPage={perPage}
              setPerPage={setPerPage}
              SearchQuery = {Search_Transaction_Ordcer}
              LoadingHandler={LoadingHandler}
              // brandId={userRole === 'brand' ? userBrand.public_key : null}
              />
        </div>
         

        

      </div>
    </Spin>
  )
}

export default TransactionOrders