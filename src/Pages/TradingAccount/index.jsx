import React from 'react'
import {PlusCircleOutlined, EyeOutlined, DeleteOutlined} from '@ant-design/icons';
import { Space, Tag, theme } from 'antd';
import CustomButton from '../../components/CustomButton';
import CustomTable from '../../components/CustomTable';
import { Link } from 'react-router-dom';

const Index = () => {
  const {
    token: { colorBG, TableHeaderColor, colorPrimary  },
  } = theme.useToken();
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle" className='cursor-pointer'>
          <Link to="/single-trading-accounts/details"><EyeOutlined style={{fontSize:"24px", color: colorPrimary }} /></Link>
         <DeleteOutlined style={{fontSize:"24px", color: colorPrimary }} />
        </Space>
      ),
    },
  ];
  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sydney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ];
  const headerStyle = {
    background: TableHeaderColor, // Set the background color of the header
    color: 'black', // Set the text color of the header
  };
  return (
    <div className='p-8' style={{backgroundColor: colorBG}}>
      <div className='flex flex-col sm:flex-row items-center gap-2 justify-between'>
        <h1 className='text-2xl font-semibold'>Trading Account</h1>
        {/* <Link to='/trading-accounts/0'>
            <CustomButton
             Text='Add New Trading Account' 
             style={{borderRadius: '8px', padding: '14px, 20px, 14px, 20px'}}
             icon={<PlusCircleOutlined />}
             />
          </Link>*/}
      </div>
      <CustomTable columns={columns} data={data} headerStyle={headerStyle} />
   </div>
  )
}

export default Index