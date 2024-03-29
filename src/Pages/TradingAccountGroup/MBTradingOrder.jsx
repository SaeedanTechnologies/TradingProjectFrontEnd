import React from 'react'
import {PlusCircleOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons';

import ARROW_BACK_CDN from '../../assets/images/arrow-back.svg';
import { Link, useNavigate } from 'react-router-dom';
import { Space, theme } from 'antd';
import CustomButton from '../../components/CustomButton';
import CustomTable from '../../components/CustomTable';

const MBTradingOrder = () => {
  const {
    token: { colorBG, TableHeaderColor, colorPrimary  },
  } = theme.useToken();
  const navigate = useNavigate()
  const headerStyle = {
    background: TableHeaderColor,
    color: 'black', 
  };
  const columns = [
    {
      title: 'Symbol',
      dataIndex: 'Symbol',
      key: '1',
    },
    {
      title: 'Time',
      dataIndex: 'Time',
      key: '2',
    },
    {
      title: 'Type',
      dataIndex: 'Type',
      key: '3',
    },
    {
      title: 'Volume',
      dataIndex: 'Volume',
      key: '4',
    },
    {
      title: 'Price',
      dataIndex: 'Price',
      key: '5',
    },
    {
      title: 'SL',
      dataIndex: 'SL',
      key: '6',
    },
    {
      title: 'TP',
      dataIndex: 'TP',
      key: '7',
    },
    {
      title: 'Price',
      dataIndex: 'Price2',
      key: '8',
    },
    {
      title: 'Profit',
      dataIndex: 'Profit',
      key: '9',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle" className='cursor-pointer'>
          <Link to="/trading-group/mb-to/0/0"><EditOutlined style={{ fontSize: "24px", color: colorPrimary }} /></Link>
          <DeleteOutlined style={{ fontSize: "24px", color: colorPrimary }} />
        </Space>
      ),
    },
  ];
  
  const data = [
    {
      key: '1',
      Symbol: 'Symbol A',
      Time: '10:00',
      Type: 'Type A',
      Volume: '100',
      Price: '50',
      SL: '45',
      TP: '55',
      Price2: '60',
      Profit: '20%',
    },
    {
      key: '2',
      Symbol: 'Symbol B',
      Time: '11:00',
      Type: 'Type B',
      Volume: '200',
      Price: '55',
      SL: '50',
      TP: '60',
      Price2: '65',
      Profit: '15%',
    },
    // Add more data objects as needed
  ];
  
  return (
    <div className='p-8' style={{backgroundColor: colorBG}}>
       <div className='flex gap-3 justify-between'>
        <div className='flex gap-3'>
        <img 
           src={ARROW_BACK_CDN} 
           alt='back icon' 
           className='cursor-pointer'
           onClick={() => navigate(-1)}
           />
          
           <h1 className='text-3xl font-bold'>Mass Buy/Sell Trading Order</h1>
        </div>
          <CustomButton
            Text='Create New Order'
            style={{
            padding: '16px',
            height: '48px',
            borderRadius: '8px',
            }}
            onClickHandler={()=>navigate('/trading-group/mb-to/0/0')}
          />
        </div>
        <CustomTable columns={columns} data={data} headerStyle={headerStyle} />

    </div>
  )
}

export default MBTradingOrder