import React from 'react'

import ARROW_BACK_CDN from '../../assets/images/arrow-back.svg';
import { Link, useNavigate } from 'react-router-dom';
import { Space, theme } from 'antd';
import CustomButton from '../../components/CustomButton';
import CustomTable from '../../components/CustomTable';

const MassDipositWidthdraw = () => {
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
      title: 'Time',
      dataIndex: 'Time',
      key: '1',
    },
    {
      title: 'Deal',
      dataIndex: 'Deal',
      key: '2',
    },
    {
      title: 'Type',
      dataIndex: 'Type',
      key: '3',
    },
    {
      title: 'Amount',
      dataIndex: 'Amount',
      key: '4',
    },
  ];
  
  const data = [
    {
      key: '1',
      Time: '10:00',
      Deal: 'Deal A',
      Type: 'Type A',
      Amount: '100',
    },
    {
      key: '2',
      Time: '11:00',
      Deal: 'Deal B',
      Type: 'Type B',
      Amount: '200',
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
       
        <h1 className='text-3xl font-bold'>Mass Deposit/Withdraw</h1>
     </div>
     <Link to={'/trading-group/mass-deposit/0/0'}>
       <CustomButton
         Text='Create New Mass Deposit / withdraw'
         style={{
         padding: '16px',
         height: '48px',
         borderRadius: '8px',
         
         }}
       />
      </Link>
     </div>
     <CustomTable columns={columns} data={data} headerStyle={headerStyle} />

 </div>
  )
}

export default MassDipositWidthdraw