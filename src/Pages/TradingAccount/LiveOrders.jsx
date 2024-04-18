import { Space, theme,Spin } from 'antd';
import React, { useState,useEffect } from 'react'

import CustomTable from '../../components/CustomTable';
import {EditOutlined, CloseOutlined, DeleteOutlined} from '@ant-design/icons';
import { Link,  } from 'react-router-dom';
import { Get_Trade_Order } from '../../utils/_TradingAPICalls';
import { useSelector } from 'react-redux';
import moment from 'moment';
 

const LiveOrders = () => {
  const token = useSelector(({user})=> user?.user?.token )
  const {
    token: { colorBG, TableHeaderColor, colorPrimary  },
  } = theme.useToken();
   const [isLoading,setIsLoading] = useState(false)

  const [tradeOrder,setTradeOrder] = useState([])
    const trading_account_id = useSelector((state)=> state?.trade?.trading_account_id )

  const columns = [
       {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (text)=> <span style={{color:colorPrimary}}>{text}</span>
    },
    {
      title: 'Volume',
      dataIndex: 'volume',
      key: 'volume',
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
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Profit',
      dataIndex: 'profit',
      key: 'profit',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle" className='cursor-pointer'>
           <Link to={`/single-trading-accounts/details/live-order/${record.id}`}><EditOutlined style={{fontSize:"24px", color: colorPrimary }}/></Link>
           <Link to="/single-trading-accounts/details"><CloseOutlined style={{fontSize:"24px", color: colorPrimary }} /></Link>
           <DeleteOutlined style={{fontSize:"24px", color: colorPrimary }} />
        </Space>
      ),
    },
  ];
  
 
  const headerStyle = {
    background: TableHeaderColor,
    color: 'black',
  };

  

  const fetchTradeOrder = async () => {

      setIsLoading(true)
      const params ={trading_account_id,OrderTypes:['market','pending'],token}
      const mData = await Get_Trade_Order(params)
      const {data:{message, payload, success}} = mData
      const liveOrders = payload?.data?.map((order)=>({
        id:order.id,
        symbol: order.symbol,
        time:moment(order.created_at).format('L'),
        type:order.type,
        volume:order.volume,
        stopLoss:order.stopLoss,
        takeProfit:order.takeProfit,
        price:order.price,
        profit:order.profit ? order.profit : '...'


       
      }))
       setIsLoading(false)
      if(success){
      
      setTradeOrder(liveOrders)
    }
    
  }
  useEffect(()=>{
    fetchTradeOrder()
  },[])
  
  return (
     <Spin spinning={isLoading} size="large">
    <div className='p-8' style={{backgroundColor: colorBG}}>
      <CustomTable columns={columns} data={tradeOrder} headerStyle={headerStyle} />
    </div>
    </Spin>
  )
}

export default LiveOrders