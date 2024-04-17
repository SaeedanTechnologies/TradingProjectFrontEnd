import { Space, theme } from 'antd';
import React, { useState,useEffect } from 'react'

import CustomTable from '../../components/CustomTable';
import {EditOutlined, CloseOutlined, DeleteOutlined} from '@ant-design/icons';
import { Link,  } from 'react-router-dom';
import { Get_Trade_Order } from '../../utils/_TradingAPICalls';
import { useSelector } from 'react-redux';
 

const LiveOrders = () => {
  const token = useSelector(({user})=> user?.user?.token )
  const {
    token: { colorBG, TableHeaderColor, colorPrimary  },
  } = theme.useToken();

  const [tradeOrder,setTradeOrder] = useState([])
    const trading_account_id = useSelector((state)=> state?.trade?.trading_account_id )

  const columns = [
    {
      title: 'Symbol',
      dataIndex: 'key',
      key: '1',
    },
    {
      title: 'Time',
      dataIndex: 'name',
      key: '2',
    },
    {
      title: 'Type',
      dataIndex: 'age',
      key: '3',
      render: (text)=> <span style={{color:colorPrimary}}>{text}</span>
    },
    {
      title: 'Volumn',
      dataIndex: 'address',
      key: '4',
    },
    {
      title: 'Price',
      dataIndex: 'type',
      key: '5',
    },
    {
      title: 'SL',
      dataIndex: 'type',
      key: '6',
    },
    {
      title: 'TP',
      dataIndex: 'type',
      key: '7',
    },
    {
      title: 'Price',
      dataIndex: 'type',
      key: '8',
    },
    {
      title: 'Profit',
      dataIndex: 'type',
      key: '9',
    },
    {
      title: 'Actions',
      dataIndex: 'type',
      key: '9',
      render: (_, record) => (
        <Space size="middle" className='cursor-pointer'>
            <Link to="/single-trading-accounts/details/live-order"><EditOutlined style={{fontSize:"24px", color: colorPrimary }}/></Link>
           <Link to="/single-trading-accounts/details">
            <CloseOutlined style={{fontSize:"24px", color: colorPrimary }} /></Link>
         <DeleteOutlined style={{fontSize:"24px", color: colorPrimary }} />
        </Space>
      ),
    },
  ];
  
  const data = [
    {
      key: 'audkdi',
      name: '9:30',
      age: 'Buy',
      address: '1000',
      type: '125.50',
      sl: '124.50',
      tp: '127.50',
      price: '130.50',
      profit: '5%',
      actions: 'Edit/Delete',
    },
    {
      key: 'audkdi',
      name: '10:00',
      age: 'Sell',
      address: '500',
      type: '127.00',
      sl: '128.00',
      tp: '124.00',
      price: '120.00',
      profit: '-3%',
      actions: 'Edit/Delete',
    },
    // Add more data objects as needed
  ];
  const headerStyle = {
    background: TableHeaderColor,
    color: 'black',
  };

  

  const fetchTradeOrder = async () => {
    const mData = await Get_Trade_Order(trading_account_id,'market',token)
    const {data:{message, payload, success}} = mData
    if(success){
      console.log('trade order data ======',payload)
      // const tradingOrder = payload?.data?.map((item)=>({
      // id:item.id,
      // loginId: item.login_id,
      // trading_group_id: item.trading_group_id,
      // country: item.country,
      // phone: item.phone,
      // email:item.email,
      // leverage: item.leverage,
      // balance: item.balance,
      // credit: item.credit,
      // equity: item.equity,
      // margin_level_percentage: item.margin_level_percentage,
      // profit:item.profit,
      // swap: item.swap,
      // currency: item.currency,
      // registration_time: item.registration_time,
      // last_access_time: item.last_access_time === null ? 'null': item.last_access_time ,
      // last_access_address_IP: item.last_access_address_IP === null ? 'null': item.last_access_address_IP,
    
      // }))
      // setTradeOrder(tradingAccounts)
    }
  }

  useEffect(()=>{
    fetchTradeOrder()
  },[])
  
  return (
    <div className='p-8' style={{backgroundColor: colorBG}}>
      <CustomTable columns={columns} data={data} headerStyle={headerStyle} />
    </div>
  )
}

export default LiveOrders