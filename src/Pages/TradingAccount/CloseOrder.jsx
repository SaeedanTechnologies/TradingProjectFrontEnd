import React from 'react'
import { Space, theme } from 'antd';
import { DeleteOutlined} from '@ant-design/icons';
import CustomTable from '../../components/CustomTable';

const CloseOrder = () => {
  const {token: { colorBG, TableHeaderColor, colorPrimary  },} = theme.useToken();
  const columns = [
    {
      title: 'Time',
      dataIndex: 'time',
      key: '1',
    },
    {
      title: 'Ticket',
      dataIndex: 'ticket',
      key: '2',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: '3',
      render: (text)=> <span style={{color:colorPrimary}}>{text}</span>
    },
    {
      title: 'Volumn',
      dataIndex: 'Volumn',
      key: '4',
    },
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: '5',
    },
    {
      title: 'Price',
      dataIndex: 'Price',
      key: '6',
    },
    {
      title: 'SL',
      dataIndex: 'SL',
      key: '7',
    },
    {
      title: 'TP',
      dataIndex: 'Time',
      key: '8',
    },
    {
      title: 'Price',
      dataIndex: 'Price',
      key: '9',
    },
    {
      title: 'Reason',
      dataIndex: 'Reason',
      key: '10',
    },
    {
      title: 'Swap',
      dataIndex: 'Swap',
      key: '11',
    },
    {
      title: 'Profit',
      dataIndex: 'Profit',
      key: '12',
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
      key: '1',
      time: '9:30',
      ticket: 'audkdi',
      type: 'Buy',
      Volumn: '1000',
      symbol: '125.50',
      Price: '130.50',
      SL: '124.50',
      TP: '127.50',
      Reason: '...',
      Swap: '...',
      Profit: '5%',
    },
    {
      key: '2',
      time: '10:00',
      ticket: 'audkdi',
      type: 'Sell',
      Volumn: '500',
      symbol: '127.00',
      Price: '120.00',
      SL: '128.00',
      TP: '124.00',
      Reason: '...',
      Swap: '...',
      Profit: '-3%',
    },
    // Add more data objects as needed
  ];
  
  const headerStyle = {
    background: TableHeaderColor, 
    color: 'black', 
  };
  return (
    <div className='p-8' style={{backgroundColor: colorBG}}>
      <CustomTable
        columns={columns} 
        data={data} 
        headerStyle={headerStyle} 
      />
    </div>
  )
}

export default CloseOrder