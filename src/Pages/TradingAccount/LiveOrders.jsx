import { Space, theme,Spin } from 'antd';
import React, { useState,useEffect } from 'react'

import CustomTable from '../../components/CustomTable';
import {EditOutlined, CloseOutlined, DeleteOutlined} from '@ant-design/icons';
import { Link, useLocation,  } from 'react-router-dom';
import { Delete_Trade_Order, Get_Trade_Order,Put_Trade_Order } from '../../utils/_TradingAPICalls';
import { useSelector } from 'react-redux';
import moment from 'moment';
import Swal from 'sweetalert2';

 

const LiveOrders = ({fetchLiveOrder,tradeOrder}) => {
  const token = useSelector(({user})=> user?.user?.token )
  const location = useLocation()
  const {pathname} = location
  const {
    token: { colorBG, TableHeaderColor, colorPrimary  },
  } = theme.useToken();
   const [isLoading,setIsLoading] = useState(false)

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
           <CloseOutlined style={{fontSize:"24px", color: colorPrimary }} onClick={()=>CancelLiveOrder(record.id)} />
           <DeleteOutlined style={{fontSize:"24px", color: colorPrimary }} onClick={()=>DeleteHandler(record.id)} />
        </Space>
      ),
    },
  ];
  
 
  const headerStyle = {
    background: TableHeaderColor,
    color: 'black',
  };

//  const fetchTradeOrder = async () => {

//       setIsLoading(true)
//       const params ={trading_account_id,OrderTypes:['market','pending'],token}
//       const mData = await Get_Trade_Order(params)
//       const {data:{message, payload, success}} = mData
//       const liveOrders = payload?.data?.map((order)=>({
//         id:order.id,
//         symbol: order.symbol,
//         time:moment(order.created_at).format('L'),
//         type:order.type,
//         volume:order.volume,
//         stopLoss:order.stopLoss,
//         takeProfit:order.takeProfit,
//         price:order.price,
//         profit:order.profit ? order.profit : '...',
//         open_price:order.open_price,
//         close_price:order.close_price ? order.close_price: order.open_price,
//         open_time:order.open_time,
//         close_time:order.close_time ? order.close_time : new Date().toISOString()




       
//       }))
//        setIsLoading(false)
//       if(success){
      
//       setTradeOrder(liveOrders)
//     }
    
//   }

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
      const res = await Delete_Trade_Order(id, token)
      const {data:{success, message, payload}} = res
      setIsLoading(false)
      if(success){
        Swal.fire({
          title: "Deleted!",
          text: message,
          icon: "success"
        });
        fetchLiveOrder()
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


const CancelLiveOrder = async(id)=>{
  setIsLoading(true)
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#1CAC70",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Close the Order!"
  }).then(async(result) => {
    if (result.isConfirmed) {

      const paramsString = 'order_type=close';
       const res = await Put_Trade_Order(id,paramsString, token) 

       const {data: {message, payload, success}} = res

      setIsLoading(false)
      if(success){
        Swal.fire({
          title: "Order Closed!",
          text: message,
          icon: "success"
        });
        fetchLiveOrder()
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


  useEffect(()=>{
    fetchLiveOrder()
  },[pathname])
  
  return (
     <Spin spinning={isLoading} size="large">
    <div className='p-8' style={{backgroundColor: colorBG}}>
      <CustomTable columns={columns} data={tradeOrder} headerStyle={headerStyle} />
    </div>
    </Spin>
  )
}

export default LiveOrders