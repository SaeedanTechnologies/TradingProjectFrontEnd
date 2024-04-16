import React, { useState } from 'react'
import { Space, theme } from 'antd';
import {PlusCircleOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons';

import CustomTable from '../../../components/CustomTable';
import CustomButton from '../../../components/CustomButton';
import { AddnewStyle } from '../../Brand/style';
import CustomTextField from '../../../components/CustomTextField';
import { Link, useNavigate } from 'react-router-dom';

const Index = () => {
  const {
    token: { colorBG, TableHeaderColor, Gray2, colorPrimary  },
  } = theme.useToken();
  const navigate = useNavigate()
  const headerStyle = {
    background: TableHeaderColor, // Set the background color of the header
    color: 'black', // Set the text color of the header
  };
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: '1',
    },
    {
      title: 'Laverage',
      dataIndex: 'leverage',
      key: '2',
    },
    {
      title: 'Swap',
      dataIndex: 'swap',
      key: '3',
    },
    {
      title: 'Lot Size',
      dataIndex: 'lot_size',
      key: '4',
    },
    {
      title: 'Lot Steps',
      dataIndex: 'lot_step',
      key: '5',
    },
    {
      title: 'Minimum Value',
      dataIndex: 'vol_min',
      key: '6',
    },
    {
      title: 'Maximum Value',
      dataIndex: 'vol_max',
      key: '7',
    },
    {
      title: 'Symbol Group TI',
      dataIndex: 'SGTI',
      key: '8',
    },
    {
      title: 'Symbols',
      dataIndex: 'Symbols',
      key: '9',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle" className='cursor-pointer'>
         <Link to={'/symbol-settings/0'}><EditOutlined style={{fontSize:"24px", color: colorPrimary }}  /></Link> 
           <DeleteOutlined style={{fontSize:"24px", color: colorPrimary }} />
        </Space>
      ),
    },
  ];
 const data = [
  {
    key: '1',
    Name: 'Sample Name 1',
    Laverage: 100,
    Swap: 10,
    LotSize: 1,
    LotSteps: 0.1,
    minval: 0,
    MaxValue: 1000,
    SGTI: 'Sample Group TI 1',
    Symbols: 'Sample Symbol 1',
  },
  {
    key: '2',
    Name: 'Sample Name 2',
    Laverage: 200,
    Swap: 20,
    LotSize: 2,
    LotSteps: 0.2,
    minval: 10,
    MaxValue: 2000,
    SGTI: 'Sample Group TI 2',
    Symbols: 'Sample Symbol 2',
  },
  // Add more data objects as needed
];

  return (
    <div className='p-8' style={{ backgroundColor: colorBG }}>
    <div className='flex flex-col sm:flex-row items-center gap-2 justify-between'>
      <h1 className='text-2xl font-semibold'>Symbol Settings</h1>
      <div className='flex items-center gap-4'>
       <CustomTextField label={'Search'} varient={'outlined'} sx={{height:'48px'}} />
        <CustomButton
          Text='Add Symbol'
          style={AddnewStyle}
          icon={<PlusCircleOutlined />}
          onClickHandler={()=> navigate('/symbol-settings/0')}
        />
       
      </div>
    </div>
    <CustomTable columns={columns} data={data} headerStyle={headerStyle} />
  </div>
  )
}

export default Index