import React, { useState, useEffect } from 'react'
import { Space, theme, Spin } from 'antd';
import CustomTable from '../../components/CustomTable';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { EditOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

import { Delete_Trade_Order, Get_Trade_Order } from '../../utils/_TradingAPICalls';
import { CustomDeleteDeleteHandler } from '../../utils/helpers';

const LiveOrders = () => {
  const userRole = useSelector((state)=>state?.user?.user?.user?.roles[0]?.name);
  const userBrand = useSelector((state)=> state?.user?.user?.brand)
  const token = useSelector(({ user }) => user?.user?.token)
  const { token: { colorBG, colorPrimary, TableHeaderColor } } = theme.useToken();
  const [isLoading, setIsLoading] = useState(false)
  const [liveOrders, setLiveOrders] = useState([])
  const [CurrentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [isUpdated, setIsUpdated] = useState(true)
  const [totalRecords, setTotalRecords] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [sortDirection, setSortDirection] = useState("")

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
      title:<span className="dragHandler">Type</span>,
      dataIndex: 'type',
      key: '5',
      sorter: (a, b) => a.type.length - b.type.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">Volume</span>,
      dataIndex: 'volume',
      key: '6',
      sorter: (a, b) => a.volume.length - b.volume.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">Open Price</span>,
      dataIndex: 'open_price',
      key: '7',
      sorter: (a, b) => a.open_price.length - b.open_price.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">SL</span>,
      dataIndex: 'stopLoss',
      key: '8',
      sorter: (a, b) => a.stopLoss.length - b.stopLoss.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">TP</span>,
      dataIndex: 'takeProfit',
      key: '9',
      sorter: (a, b) => a.takeProfit.length - b.takeProfit.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">Reason</span>,
      dataIndex: 'reason',
      key: '10',
      sorter: (a, b) => a.reason.length - b.reason.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">Swap</span>,
      dataIndex: 'swap',
      key: '11',
      sorter: (a, b) => a.swap.length - b.swap.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">Profit</span>,
      dataIndex: 'profit',
      key: '12',
      sorter: (a, b) => a.profit.length - b.profit.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">Comment</span>,
      dataIndex: 'comment',
      key: '13',
      sorter: (a, b) => a.comment.length - b.comment.length,
      sortDirections: ['ascend']
    },
  // {
    //   title: 'Actions',
    //   dataIndex: 'actions',
    //   key: 'actions',
    //   render: (_, record) => (
    //     <Space size="middle" className='cursor-pointer'>

    //         <DeleteOutlined style={{fontSize:"24px", color: colorPrimary }} onClick={()=> CustomDeleteDeleteHandler(record.id, token, Delete_Trade_Order,setIsLoading,fetchLiveOrder)} />

    //     </Space>
    //   ),
    // },
  ];
  const defaultCheckedList = columns.map((item) => item.key);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [newColumns , setNewColumns] = useState(columns)


  const headerStyle = {
    background: TableHeaderColor,
    color: 'black',
  };

  const fetchLiveOrder = async (brandId,page) => {
    setIsLoading(true)
    const params = { OrderTypes: ['market', 'pending'], token,brandId,page}
    const mData = await Get_Trade_Order(params,page)
    const { data: { message, payload, success } } = mData
    
    const allLiveOrders = payload?.data?.map((order) => ({
      id: order.id,
      loginId: order.trading_account_id,
      orderId: order.id,
      symbol: order.symbol,
      open_time: moment(order.open_time).format('L'),
      type: order.type,
      volume: order.volume,
      open_price: order.open_price,
      stopLoss: order.stopLoss,
      takeProfit: order.takeProfit,
      reason: order.reason ? order.reason : '...',
      swap: order.swap ? order.swap : '...',
      profit: order.profit ? order.profit : '...',
      comment: order.comment

    }))
    setIsLoading(false)
    if (success) {
      setLiveOrders(allLiveOrders)
      setCurrentPage(payload.current_page)
      setLastPage(payload.last_page)
      setTotalRecords(payload.total)
      setIsUpdated(false)

    }
  }
    const onPageChange = (page) =>{
      if(userRole === 'brand' ){
      fetchLiveOrder(userBrand.public_key,page)
    }
    else{
      fetchLiveOrder(null,page)
    }
  }
  useEffect(() => {
    const newCols = columns.filter(x => checkedList.includes(x.key));
    setNewColumns(newCols)
    }, [checkedList]);
  const LoadingHandler = React.useCallback((isLoading)=>{
    setIsLoading(isLoading)
  },[])
  useEffect(() => {
    setIsUpdated(true)
    if(userRole === 'brand' ){
      fetchLiveOrder(userBrand.public_key,CurrentPage)
    }
    else{
      fetchLiveOrder(null,CurrentPage)
    }
  }, [])
  return (
    <Spin spinning={isLoading} size="large">
      <div className='p-8 w-full' style={{ backgroundColor: colorBG }}>
        <h1 className='text-2xl font-bold'>Live Orders</h1>

         <CustomTable
          direction="/live-orders"
          formName = "Live Orders" 
          columns={newColumns}
          data={liveOrders} 
          headerStyle={headerStyle}
          total={totalRecords}
          onPageChange = {onPageChange}
          current_page={CurrentPage}
          token = {token}
          isUpated={isUpdated} //
          // setSelecetdIDs={setSymbolSettingsSelecetdIDs}
          // setTableData = {setSymbolSettingsData}
          table_name= "trade_orders"
          setSortDirection = {setSortDirection}//
          editPermissionName="close_orders_update"
          deletePermissionName="close_orders_delete"
          perPage={parseInt(perPage)}
          setPerPage={setPerPage}
          SearchQuery = {Get_Trade_Order}
          LoadingHandler={LoadingHandler}

        />
      </div>
    </Spin>
  )
}
export default LiveOrders