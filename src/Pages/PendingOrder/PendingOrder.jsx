import React, { useState, useEffect } from 'react'
import { Space, theme, Spin } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import CustomTable from '../../components/CustomTable';
import moment from 'moment';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import {  Get_Trade_Order } from '../../utils/_TradingAPICalls';
import {  setCloseOrdersSelectedIds,setCloseOrdersData} from '../../store/TradeOrders';
import ARROW_UP_DOWN from '../../assets/images/arrow-up-down.png';

const PendingOrder = () => {
  const userRole = useSelector((state)=>state?.user?.user?.user?.roles[0]?.name);
  const userBrand = useSelector((state)=> state?.user?.user?.brand)
  const token = useSelector(({ user }) => user?.user?.token)
  const { token: { colorBG, colorPrimary, TableHeaderColor } } = theme.useToken();
  const [isLoading, setIsLoading] = useState(false)
  const [pendingOrders, setPendingOrders] = useState([])
  

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
  const fetchPendingOrders = async (brandId,page) => {

    setIsLoading(true)
    const params = { OrderTypes: ['pending'], token,brandId,page }
    const mData = await Get_Trade_Order(params)
    const { data: { message, payload, success } } = mData
    const allPendingOrders = payload?.data?.map((order) => ({
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
      setPendingOrders(allPendingOrders)
    }

  }

  const onPageChange = (page) =>{
      if(userRole === 'brand' ){
      fetchPendingOrders(userBrand.public_key,page)
    }
    else{
      fetchPendingOrders(null,page)
    }
  }

  useEffect(() => {

    if(userRole === 'brand' ){
      fetchPendingOrders(userBrand.public_key,CurrentPage)
    }
    else{
      fetchPendingOrders(null,CurrentPage)
    }
  }, [])
  const columns = [
    {
      title:<span className="dragHandler">Symbol</span>,
      dataIndex: 'symbol',
      key: '5',
      sorter: (a, b) => a.symbol.length - b.symbol.length,
      sortDirections: ['ascend'],

    },
    {
      title:<span className="dragHandler">Time</span>,
      dataIndex: 'open_time',
      key: '1',
      sorter: (a, b) => a.open_time.length - b.open_time.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">Type</span>,
      dataIndex: 'type',
      key: '3',
      sorter: (a, b) => a.type.length - b.type.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">Volume</span>,
      dataIndex: 'volume',
      key: '4',
      sorter: (a, b) => a.volume.length - b.volume.length,
      sortDirections: ['ascend'],

    },
    {
      title:<span className="dragHandler">SL</span>,
      dataIndex: 'stopLoss',
      key: '7',
      sorter: (a, b) => a.stopLoss.length - b.stopLoss.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">TP</span>,
      dataIndex: 'takeProfit',
      key: '8',
      sorter: (a, b) => a.takeProfit.length - b.takeProfit.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">Open Price</span>,
      dataIndex: 'open_price',
      key: '6',
      sorter: (a, b) => a.open_price.length - b.open_price.length,
      sortDirections: ['ascend'],
    }
  ];

//   const columns = [


//     {
//       title:<span className="dragHandler">LoginID</span>,
//       dataIndex: 'loginId',
//       key: '1',
//       sorter: (a, b) => a.loginId.length - b.loginId.length,
//       sortDirections: ['ascend', 'descend'],
//       sortIcon: (sortDir) => {
//         if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
//         if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
//         return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
//       },
//     },
//     {
//       title:<span className="dragHandler">OrderID</span>,
//       dataIndex: 'orderId',
//       key: '2',
//       sorter: (a, b) => a.orderId.length - b.orderId.length,
//       sortDirections: ['ascend', 'descend'],
//       sortIcon: (sortDir) => {
//         if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
//         if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
//         return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
//       },
//     },

//     {
//       title:<span className="dragHandler">Symbol</span>,
//       dataIndex: 'symbol',
//       key: '3',
//       sorter: (a, b) => a.symbol.length - b.symbol.length,
//       sortDirections: ['ascend', 'descend'],
//       sortIcon: (sortDir) => {
//         if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
//         if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
//         return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
//       },
//     },
//     {
//       title:<span className="dragHandler">Open Time</span>,
//       dataIndex: 'open_time',
//       key: '4',
//       sorter: (a, b) => a.open_time.length - b.open_time.length,
//       sortDirections: ['ascend', 'descend'],
//       sortIcon: (sortDir) => {
//         if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
//         if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
//         return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
//       },
//     },
//     {
//       title:<span className="dragHandler">Close Time</span>,
//       dataIndex: 'close_time',
//       key: '5',
//       sorter: (a, b) => a.close_time.length - b.close_time.length,
//       sortDirections: ['ascend', 'descend'],
//       sortIcon: (sortDir) => {
//         if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
//         if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
//         return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
//       },
//     },
//     {
//       title:<span className="dragHandler">Type</span>,
//       dataIndex: 'type',
//       key: '6',
//       sorter: (a, b) => a.type.length - b.type.length,
//       sortDirections: ['ascend', 'descend'],
//       sortIcon: (sortDir) => {
//         if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
//         if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
//         return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
//       },
//     },
//     {
//       title:<span className="dragHandler">Volume</span>,
//       dataIndex: 'volume',
//       key: '7',
//       sorter: (a, b) => a.volume.length - b.volume.length,
//       sortDirections: ['ascend', 'descend'],
//       sortIcon: (sortDir) => {
//         if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
//         if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
//         return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
//       },
//     },
    
//     {
//       title:<span className="dragHandler">Stop Lose</span>,
//       dataIndex: 'stopLoss',
//       key: '8',
//       sorter: (a, b) => a.stopLoss.length - b.stopLoss.length,
//       sortDirections: ['ascend', 'descend'],
//       sortIcon: (sortDir) => {
//         if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
//         if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
//         return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
//       },
//     },
//     {
//       title:<span className="dragHandler">Take Profit</span>,
//       dataIndex: 'takeProfit',
//       key: '9',
//       sorter: (a, b) => a.takeProfit.length - b.takeProfit.length,
//       sortDirections: ['ascend', 'descend'],
//       sortIcon: (sortDir) => {
//         if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
//         if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
//         return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
//       },
//     },
//     {
//       title:<span className="dragHandler">Open Price</span>,
//       dataIndex: 'open_price',
//       key: '10',
//       sorter: (a, b) => a.open_price.length - b.open_price.length,
//       sortDirections: ['ascend', 'descend'],
//       sortIcon: (sortDir) => {
//         if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
//         if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
//         return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
//       },
//     },
//     {
//       title:<span className="dragHandler">Closed Price</span>,
//       dataIndex: 'close_price',
//       key: '11',
//       sorter: (a, b) => a.close_price.length - b.close_price.length,
//       sortDirections: ['ascend', 'descend'],
//       sortIcon: (sortDir) => {
//         if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
//         if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
//         return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
//       },
//     },

//     {
//       title:<span className="dragHandler">Reason</span>,
//       dataIndex: 'reason',
//       key: '12',
//       sorter: (a, b) => a.reason.length - b.reason.length,
//       sortDirections: ['ascend', 'descend'],
//       sortIcon: (sortDir) => {
//         if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
//         if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
//         return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
//       },
//     },
//     {
//       title:<span className="dragHandler">Swap</span>,
//       dataIndex: 'reason',
//       key: '13',
//       sorter: (a, b) => a.swap.length - b.swap.length,
//       sortDirections: ['ascend', 'descend'],
//       sortIcon: (sortDir) => {
//         if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
//         if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
//         return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
//       },
//     },
//     {
//       title:<span className="dragHandler">Profit</span>,
//       dataIndex: 'profit',
//       key: '14',
//       sorter: (a, b) => a.profit.length - b.profit.length,
//       sortDirections: ['ascend', 'descend'],
//       sortIcon: (sortDir) => {
//         if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
//         if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
//         return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
//       },
//     },
//     {
//       title:<span className="dragHandler">Comment</span>,
//       dataIndex: 'comment',
//       key: '15',
//       sorter: (a, b) => a.comment.length - b.comment.length,
//       sortDirections: ['ascend', 'descend'],
//       sortIcon: (sortDir) => {
//         if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
//         if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
//         return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
//       },
//     },
//     {
//       title: 'Actions',
//       dataIndex: 'actions',
//       key: 'actions',
//       render: (_, record) => (
//         <Space size="middle" className='cursor-pointer'>
//             <DeleteOutlined style={{ fontSize: "24px", color: colorPrimary }} onClick={() => CustomDeleteDeleteHandler(record.id, token, Delete_Trade_Order, setIsLoading, fetchPendingOrders)} />
//         </Space>

//       ),
//     },
//   ];
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
      fetchPendingOrders(userBrand.public_key,CurrentPage)
    }
    else{
      fetchPendingOrders(null,CurrentPage)
    }

  }, [perPage])

    const LoadingHandler = React.useCallback((isLoading)=>{
    setIsLoading(isLoading)
  },[])





  useEffect(() => {
    const newCols = columns.filter(x => checkedList.includes(x.key));
    setNewColumns(newCols)
    }, [checkedList]);

  useEffect(() => {
    setIsUpdated(true)

    if(userRole === 'brand' ){
      fetchPendingOrders(userBrand.public_key,CurrentPage)
    }
    else{
      fetchPendingOrders(null,CurrentPage)
    }
  }, [])

  return (
    <Spin spinning={isLoading} size="large">
      <div className='p-8 w-full' style={{ backgroundColor: colorBG }}>
        <h1 className='text-2xl font-bold'>Pending Orders</h1>
         <CustomTable
        //   direction="/pending-orders-entry"
          formName = "Pending Orders" 
          columns={newColumns}
          data={pendingOrders} 
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

export default PendingOrder