import React, { useState } from 'react'
import { theme } from 'antd';
import CustomTable from '../../../components/CustomTable';


const columns = [
  {
    title: 'DateTime',
    dataIndex: 'DateTime',
    key: '1',
  },
  {
    title: 'Open',
    dataIndex: 'Open',
    key: '2',
  },
  {
    title: 'High',
    dataIndex: 'High',
    key: '3',
  },
  {
    title: 'Low',
    dataIndex: 'Low',
    key: '4',
  },
  {
    title: 'Close',
    dataIndex: 'Close',
    key: '5',
  },
  
];
const data = [
  {
    key: '1',
    'DateTime': '2024-03-29 10:00:00',
    'Open': 100,
    'High': 105,
    'Low': 102,
    'Close': 1000,
  },
  {
    key: '2',
    'DateTime': '2024-03-29 10:05:00',
    'Open': 102,
    'High': 107,
    'Low': 105,
    'Close': 1200,
  },
  // Add more data objects as needed
];


const Index = () => {
  const { token: { colorBG, TableHeaderColor } } = theme.useToken();
  const headerStyle = {
    background: TableHeaderColor, // Set the background color of the header
    color: 'black', // Set the text color of the header
  };
  return (
    <div className='p-8' style={{ backgroundColor: colorBG }}>
      <div className='flex flex-col sm:flex-row items-center gap-2 justify-between'>
        <h1 className='text-2xl font-semibold'>1 Minute Charts</h1>
      </div>
      <CustomTable columns={columns} data={data} headerStyle={headerStyle} />
    </div>
  )
}
export default Index