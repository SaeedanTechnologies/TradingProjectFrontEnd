import React, { useState, useEffect } from 'react'
import { Space, theme, Spin } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import CustomTable from '../../components/CustomTable';
import moment from 'moment';

import {  Get_Trade_Order } from '../../utils/_TradingAPICalls';
import {  setCloseOrdersSelectedIds,setCloseOrdersData} from '../../store/TradeOrders';



const CloseOrder = () => {
  const userRole = useSelector((state)=>state?.user?.user?.user?.roles[0]?.name);
  const userBrand = useSelector((state)=> state?.user?.user?.brand)
  const token = useSelector(({ user }) => user?.user?.token)
  const { token: { colorBG, colorPrimary, TableHeaderColor } } = theme.useToken();
  const [isLoading, setIsLoading] = useState(false)
  const [closeOrders, setCloseOrders] = useState([])

  const [CurrentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)

   const [isUpdated, setIsUpdated] = useState(true)
  const [perPage, setPerPage] = useState(10)
  const [sortDirection, setSortDirection] = useState("")
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');


  const headerStyle = {
    background: TableHeaderColor, // Set the background color of the header
    color: 'black', // Set the text color of the header
  };
  const fetchCloseOrders = async (brandId,page) => {

    setIsLoading(true)
    const params = { OrderTypes: ['close'], token,brandId,page }
    const mData = await Get_Trade_Order(params)
    const { data: { message, payload, success } } = mData
    const allCloseOrders = payload?.data?.map((order) => ({
      id: order.id,
      loginId: order.trading_account_id,
      orderId: order.id,
      symbol: order.symbol,
      open_time:  moment(order.open_time).format('MM/DD/YYYY HH:mm'),
      close_time: moment(order.close_time).format('MM/DD/YYYY HH:mm') ,
      type: order.type,
      volume: order.volume,
      open_price: order.open_price,
      close_price: order.close_price,
      stopLoss: order.stopLoss,
      takeProfit: order.takeProfit,
      reason: order.reason ? order.reason : '...',
      swap: order.swap ? order.swap : '...',
      profit: order.profit ? order.profit : '...',
      comment: order.comment

    }))
    setIsLoading(false)
    if (success) {
      setCurrentPage(payload.current_page)
      setLastPage(payload.last_page)
      setTotalRecords(payload.total)
      setCloseOrders(allCloseOrders)
    }

  }

  const onPageChange = (page) =>{
      if(userRole === 'brand' ){
      fetchCloseOrders(userBrand.public_key,page)
    }
    else{
      fetchCloseOrders(null,page)
    }
  }

  useEffect(() => {

    if(userRole === 'brand' ){
      fetchCloseOrders(userBrand.public_key,CurrentPage)
    }
    else{
      fetchCloseOrders(null,CurrentPage)
    }
  }, [])





  const columns = [


    {
      title:<span className="dragHandler">LoginID</span>,
      dataIndex: 'loginId',
      key: '1',
      sorter: (a, b) => a.loginId.length - b.loginId.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">OrderID</span>,
      dataIndex: 'orderId',
      key: '2',
      sorter: (a, b) => a.orderId.length - b.orderId.length,
      sortDirections: ['ascend'],
    },

    {
      title:<span className="dragHandler">Symbol</span>,
      dataIndex: 'symbol',
      key: '3',
      sorter: (a, b) => a.symbol.length - b.symbol.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">Open Time</span>,
      dataIndex: 'open_time',
      key: '4',
      sorter: (a, b) => a.open_time.length - b.open_time.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">Close Time</span>,
      dataIndex: 'close_time',
      key: '5',
      sorter: (a, b) => a.close_time.length - b.close_time.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">Type</span>,
      dataIndex: 'type',
      key: '6',
      sorter: (a, b) => a.type.length - b.type.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">Volume</span>,
      dataIndex: 'volume',
      key: '7',
      sorter: (a, b) => a.volume.length - b.volume.length,
      sortDirections: ['ascend'],
    },
    
    {
      title:<span className="dragHandler">Stop Lose</span>,
      dataIndex: 'stopLoss',
      key: '8',
      sorter: (a, b) => a.stopLoss.length - b.stopLoss.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">Take Profit</span>,
      dataIndex: 'takeProfit',
      key: '9',
      sorter: (a, b) => a.takeProfit.length - b.takeProfit.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">Open Price</span>,
      dataIndex: 'open_price',
      key: '10',
      sorter: (a, b) => a.open_price.length - b.open_price.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">Closed Price</span>,
      dataIndex: 'close_price',
      key: '11',
      sorter: (a, b) => a.close_price.length - b.close_price.length,
      sortDirections: ['ascend'],
    },

    {
      title:<span className="dragHandler">Reason</span>,
      dataIndex: 'reason',
      key: '12',
      sorter: (a, b) => a.reason.length - b.reason.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">Swap</span>,
      dataIndex: 'reason',
      key: '13',
      sorter: (a, b) => a.swap.length - b.swap.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">Profit</span>,
      dataIndex: 'profit',
      key: '14',
      sorter: (a, b) => a.profit.length - b.profit.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">Comment</span>,
      dataIndex: 'comment',
      key: '15',
      sorter: (a, b) => a.comment.length - b.comment.length,
      sortDirections: ['ascend'],
    },
    // {
    //   title: 'Actions',
    //   dataIndex: 'actions',
    //   key: 'actions',
    //   render: (_, record) => (
    //     <Space size="middle" className='cursor-pointer'>
    //         <DeleteOutlined style={{ fontSize: "24px", color: colorPrimary }} onClick={() => CustomDeleteDeleteHandler(record.id, token, Delete_Trade_Order, setIsLoading, fetchCloseOrders)} />
    //     </Space>

    //   ),
    // },
  ];

   const defaultCheckedList = columns.map((item) => item.key);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [newColumns , setNewColumns] = useState(columns)

   useEffect(() => {
  const newCols = columns.filter(x => checkedList.includes(x.key));
  setNewColumns(newCols)
  }, [checkedList]);


     useEffect(() => {
    setIsUpdated(true)

        
     if(userRole === 'brand' ){
      fetchCloseOrders(userBrand.public_key,CurrentPage)
    }
    else{
      fetchCloseOrders(null,CurrentPage)
    }

  }, [perPage])

    const LoadingHandler = React.useCallback((isLoading)=>{
    setIsLoading(isLoading)
  },[])





  return (
    <Spin spinning={isLoading} size="large">
      <div className='p-8 w-full' style={{ backgroundColor: colorBG }}>
        <h1 className='text-2xl font-bold'>Close Orders</h1>
         <CustomTable
          direction="/close-orders-entry"
          formName = "Close Orders" 
          columns={newColumns}
          data={closeOrders} 
          headerStyle={headerStyle}
          total={totalRecords}
          onPageChange = {onPageChange}
          current_page={CurrentPage}
          token = {token}
   
            
          
          isUpated={isUpdated}
          setSelecetdIDs={setCloseOrdersSelectedIds}
          setTableData = {setCloseOrdersData}
          table_name= "trade_orders"
          setSortDirection = {setSortDirection}
          perPage={perPage}
          setPerPage={setPerPage}
          SearchQuery = {Get_Trade_Order}
          LoadingHandler={LoadingHandler}

        />
      </div>
    </Spin>
  )
}

export default CloseOrder