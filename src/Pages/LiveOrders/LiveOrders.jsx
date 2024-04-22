import React,{useState,useEffect} from 'react'
import { Space, theme,Spin } from 'antd';
import CustomTable from '../../components/CustomTable';
import { useSelector } from 'react-redux';
import { Link  } from 'react-router-dom';
import {EditOutlined, CloseOutlined, DeleteOutlined} from '@ant-design/icons';
import moment from 'moment';
import { Delete_Trade_Order, Get_Trade_Order } from '../../utils/_TradingAPICalls';
import { CustomDeleteDeleteHandler } from '../../utils/helpers';

const LiveOrders = () => {
    const token = useSelector(({user})=> user?.user?.token )
    const { token: { colorBG,colorPrimary, TableHeaderColor  } } = theme.useToken();
   const [isLoading,setIsLoading] = useState(false)
   const [liveOrders,setLiveOrders] = useState([])

   const columns = [
  
    {
      title: 'LoginID',
      dataIndex: 'loginId',
      key: 'loginId',
    },
     {
      title: 'OrderID',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: 'Open Time',
      dataIndex: 'open_time',
      key: 'open_time',
    },
    
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Volume',
      dataIndex: 'volume',
      key: 'volume',
    },
    {
      title: 'Open Price',
      dataIndex: 'open_price',
      key: 'open_price',
    },
     {
      title: 'SL',
      dataIndex: 'stopLoss',
      key: 'stopLoss',
    },
    {
      title: 'TP',
      dataIndex: 'takeProfit',
      key: 'takeProfit',
    },
     {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
    },
   {
      title: 'Swap',
      dataIndex: 'swap',
      key: 'swap',
    },
    {
      title: 'Profit',
      dataIndex: 'profit',
      key: 'profit',
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle" className='cursor-pointer'>
            <DeleteOutlined style={{fontSize:"24px", color: colorPrimary }} onClick={()=> CustomDeleteDeleteHandler(record.id, token, Delete_Trade_Order,setIsLoading,fetchLiveOrder)} />
        </Space>
      ),
    },
  ];
  
 
  const headerStyle = {
    background: TableHeaderColor,
    color: 'black',
  };

 const fetchLiveOrder = async () => {

      setIsLoading(true)
      const params ={OrderTypes:['market','pending'],token}
      const mData = await Get_Trade_Order(params)
      const {data:{message, payload, success}} = mData
      const allLiveOrders = payload?.data?.map((order)=>({
        id:order.id,
        loginId:order.trading_account_id,
        orderId:order.id,
        symbol:order.symbol,
        open_time:moment(order.open_time).format('L'),
        type:order.type,
        volume:order.volume,
        open_price:order.open_price,
        stopLoss:order.stopLoss,
        takeProfit:order.takeProfit,
        reason:order.reason ? order.reason :'...',
        swap:order.swap ? order.swap : '...',
        profit:order.profit ? order.profit :'...',
        comment:order.comment

      }))
       setIsLoading(false)
      if(success){
      
      setLiveOrders(allLiveOrders)
    }
    
  }

 

  useEffect(()=>{
    fetchLiveOrder()
  },[])

  return (
     <Spin spinning={isLoading} size="large">
      <div className='p-8 w-full' style={{ backgroundColor: colorBG }}>
        <h1 className='text-2xl font-bold'>Live Orders</h1> 
        <CustomTable columns={columns} data={liveOrders} headerStyle={headerStyle} />
      </div>
    </Spin>
  )
}
export default LiveOrders