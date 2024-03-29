import React, { useState } from 'react'
import { Space, theme } from 'antd';
import {PlusCircleOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons';


import CustomButton from '../../components/CustomButton';
import { AddnewStyle, footerStyle, submitStyle } from '../Brand/style';
import CustomTable from '../../components/CustomTable';
import { Link } from 'react-router-dom';
import CustomModal from '../../components/CustomModal';
import TradingAccountModal from '../TradingAccountGroup/TradingAccountModal';

const Index = () => {
  const { token: { colorBG, TableHeaderColor,colorPrimary } } = theme.useToken();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const headerStyle = {
    background: TableHeaderColor,
    color: 'black', 
  };
  const columns = [
    {
      title: 'Group Name',
      dataIndex: 'GroupName',
      key: '1',
    },
    {
      title: 'Symbol Group',
      dataIndex: 'SymbolGroup',
      key: '2',
    },
    {
      title: 'Mass Buy/Sell Trading Order',
      dataIndex: 'MBS',
      key: '3',
      render: (text)=> <Link to={'/trading-group/mb-to/0'} style={{color: colorPrimary, fontWeight:'600'}}>View Details</Link>
    },
    {
      title: 'Mass deposit/widthdraw',
      dataIndex: 'MDW',
      key: '4',
      render: (text)=> <Link to={'/trading-group/mass-deposit/0'}  style={{color: colorPrimary, fontWeight:'600'}}>View Details</Link>
    },
    {
      title: 'Mass Laverage',
      dataIndex: 'ML',
      key: '5',
    },
    {
      title: 'Mass Swap',
      dataIndex: 'MS',
      key: '6',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle" className='cursor-pointer'>
          <EditOutlined style={{fontSize:"24px", color: colorPrimary }} onClick={showModal} />
           <DeleteOutlined style={{fontSize:"24px", color: colorPrimary }} />
        </Space>
      ),
    },
  ];
  const data = [
    {
      key: '1',
      GroupName: 'Group A',
      SymbolGroup: 'Symbols 1',
      MBS: 'Yes',
      MDW: 'No',
      ML: 'Yes',
      MS: 'No',
    },
    {
      key: '2',
      GroupName: 'Group B',
      SymbolGroup: 'Symbols 2',
      MBS: 'No',
      MDW: 'Yes',
      ML: 'No',
      MS: 'Yes',
    },
    // Add more data objects as needed
  ];
  
  return (
    <div className='p-8' style={{ backgroundColor: colorBG }}>
      <div className='flex flex-col sm:flex-row items-center gap-2 justify-between'>
         <h1 className='text-2xl font-semibold'>Trading Account Group</h1>
         <CustomButton
            Text='Add Trading Group'
            style={{height:'48px' ,...AddnewStyle}}
            icon={<PlusCircleOutlined />}
            onClickHandler={showModal}
          />
      </div>
      <CustomTable columns={columns} data={data} headerStyle={headerStyle} />
      <CustomModal
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
        title={''}
        width={800}
        footer={[
          <div className='flex items-center justify-end gap-4'>
             <CustomButton
              Text={'Cancle'}
              onClickHandler={handleOk}
              style={{backgroundColor:'#C5C5C5',borderColor:'#C5C5C5', color:'#fff'  ,...submitStyle}}
            />
            <CustomButton
              Text={'Submit'}
              onClickHandler={handleOk}
              style={submitStyle}
            />
           
          </div>
        ]}
      >
       <TradingAccountModal />
      </CustomModal>
    </div>
  )
}

export default Index