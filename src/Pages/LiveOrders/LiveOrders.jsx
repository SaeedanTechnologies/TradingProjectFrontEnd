import React from 'react'
import { Space, theme } from 'antd';
import {DeleteOutlined} from '@ant-design/icons';
import CustomTable from '../../components/CustomTable';


const LiveOrders = () => {
  const { token: { colorBG,colorPrimary, TableHeaderColor  } } = theme.useToken();

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
  return (
    <div className='p-8 w-full' style={{ backgroundColor: colorBG }}>
       <h1 className='text-2xl font-bold'>Live Orders</h1> 
       <CustomTable columns={columns} data={data} headerStyle={headerStyle} />
    </div>
  )
}
export default LiveOrders