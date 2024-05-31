import { Space, theme } from 'antd';
import {DeleteOutlined, EyeOutlined} from '@ant-design/icons';
import React from 'react'
import ARROW_BACK_CDN from '../../assets/images/arrow-back.svg';
import { Link, useNavigate } from 'react-router-dom';
import CustomTable from '../../components/CustomTable';
import { Divider, Tab, Tabs } from '@mui/material';
import {useState} from 'react'
import AdminIP from './AdminIP'
import BrandIP from './BannedIP'
import UserIP from './UserIP';

const Firewall = () => {
  const { token: { colorBG, TableHeaderColor, colorPrimary } } = theme.useToken();
  const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('0');


  const columns = [
    {
      title: 'Date & Time',
      dataIndex: 'DateTime',
      key: '1',
    },
    {
      title: 'Value 1',
      dataIndex: 'value1',
      key: '2',
    },
    {
      title: 'Value 2',
      dataIndex: 'value2',
      key: '3'
    },
    {
      title: 'Value 3',
      dataIndex: 'value3',
      key: '4',
    },
    {
      title: 'value4',
      dataIndex: 'Value 4',
      key: '5',
    },
    {
      title: 'Actions',
      dataIndex: 'type',
      key: '9',
      render: (_, record) => (
        <Space size="middle" className='cursor-pointer'>
          <Link to="/"><EyeOutlined style={{fontSize:"24px", color: colorPrimary }} /></Link>
          <DeleteOutlined style={{fontSize:"24px", color: colorPrimary }} />
        </Space>
      ),
    },
  ];
  
  const data = [
    {
      key: '1',
      DateTime: '9:30',
      value1: 'Buy',
      value2: '1000',
      value3: '125.50',
      'Value 4': '124.50',
    },
    {
      key: '2',
      DateTime: '10:00',
      value1: 'Sell',
      value2: '500',
      value3: '127.00',
      'Value 4': '128.00',
    },
    // Add more data objects as needed
  ];
  
    const items = [
    {
      key: '1',
      label: 'User IP',
      component: <UserIP />,
      path: '/user-ip',
    },
    {
      key: '2',
      label: 'Admin IP',
      component: <AdminIP />,
      path: '/admin-ip',
    },
    {
      key: '3',
      label: 'Banned IP',
      component: <BrandIP />,
      path: "/banned-ip",
    },
    
   
  ];

  const headerStyle = {
    background: TableHeaderColor,
    color: 'black',
  };

    const onChange = (event, key) => {
    const selectedItem = items.find(item => item.key === key);
    if (selectedItem && selectedItem.path) {
      setActiveTab(key);
      navigate(selectedItem.path);
    }
  };


  return (
    <div className='p-8' style={{ backgroundColor: colorBG }}>
    <div className='flex items-center gap-3'>
     <img 
        src={ARROW_BACK_CDN} 
        alt='back icon' 
        className='cursor-pointer'
        onClick={()=> navigate(-1)}
        />
      <h1 className='text-2xl font-semibold'>Firewall IP Restrictions</h1>

    </div>

      <div className="mt-4">
        <Tabs 
          value={activeTab}
          onChange={onChange}
          TabIndicatorProps={{ style: { backgroundColor: '#1CAC70' } }}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '14px',
              mb: -2,
            },
            '& .Mui-selected': {
              color: '#1CAC70 !important', // Ensure that the selected tab retains the custom color
            },
          }}
          aria-label="tabs example"
        >
          {items.map(item => (
            
            <Tab sx={{ fontSize: "14px", textTransform: "none", mb: -2, fontWeight:'bold' }} label={item.label} key={item.key} value={item.key} /> 
          ))}
        </Tabs>
      </div>

    <div className='mt-4'>
          <CustomTable columns={columns} data={data} headerStyle={headerStyle} />
    </div>
    </div>
  )
}

export default Firewall