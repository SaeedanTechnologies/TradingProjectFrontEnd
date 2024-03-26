import { AutoComplete, Space, theme } from 'antd';
import React, { useState } from 'react'
import CustomTable from '../../components/CustomTable';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import CustomButton from '../../components/CustomButton';
import FILTER_CDN from '../../assets/images/filter-white.svg';
import CustomAutocomplete from '../../components/CustomAutocomplete';
import { Link } from 'react-router-dom';

const TransactionOrders = () => {
  const {
    token: { colorBG, colorPrimary, TableHeaderColor },
  } = theme.useToken();
  const [IsShowFilter, setIsShowFilter] = useState(false)
  const [TypeList, setTypeList] = useState([])
  const [SelectedType, setSelectedType] = useState(null)
  const [MethodList, setMethodList] = useState([])
  const [SelectedMethod, setSelectedMethod] = useState([])
  const columns = [
    {
      title: 'LoginID',
      dataIndex: 'LoginID',
      key: '1',
    },
    {
      title: 'OrderID',
      dataIndex: 'OrderID',
      key: '2',
    },
    {
      title: 'Name',
      dataIndex: 'Name',
      key: '3',
    },
    {
      title: 'Group',
      dataIndex: 'Group',
      key: '4',
    },
    {
      title: 'Country',
      dataIndex: 'Country',
      key: '5',
    },
    {
      title: 'Phone Number',
      dataIndex: 'PhoneNumber',
      key: '6',
    },
    {
      title: 'Email',
      dataIndex: 'Email',
      key: '7',
    },
    {
      title: 'Time',
      dataIndex: 'Time',
      key: '8',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: '9',
      render: (text) => <span style={{ color: colorPrimary }}>{text}</span>

    },
    {
      title: 'Method',
      dataIndex: 'Method',
      key: '9',
    },
    {
      title: 'Comment',
      dataIndex: 'Comment',
      key: '9',
      render: (text) => <span style={{ color: colorPrimary }}>{text}</span>

    },
    {
      title: 'Amount',
      dataIndex: 'Amount',
      key: '9',
    },
    {
      title: 'Currency',
      dataIndex: 'Currency',
      key: '9',
    },
    {
      title: 'Actions',
      dataIndex: 'type',
      key: '9',
      render: (_, record) => (
        <Space size="middle" className='cursor-pointer'>
          <Link to={"/transaction-orders/:0"}><EditOutlined   style={{ fontSize: "24px", color: colorPrimary }} /></Link>
          <DeleteOutlined style={{ fontSize: "24px", color: colorPrimary }} />
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      LoginID: 'login1',
      OrderID: 'order1',
      Name: 'John Doe',
      Group: 'Group 1',
      Country: 'USA',
      PhoneNumber: '123-456-7890',
      Email: 'john@example.com',
      Time: '9:30',
      type: 'Type 1',
      Method: 'Method 1',
      Comment: 'Comment 1',
      Amount: '$100',
      Currency: 'USD',
    },
    {
      key: '2',
      LoginID: 'login2',
      OrderID: 'order2',
      Name: 'Jane Smith',
      Group: 'Group 2',
      Country: 'UK',
      PhoneNumber: '987-654-3210',
      Email: 'jane@example.com',
      Time: '10:00',
      type: 'Type 2',
      Method: 'Method 2',
      Comment: 'Comment 2',
      Amount: '$200',
      Currency: 'GBP',
    },
    // Add more rows as needed
  ];

  const headerStyle = {
    background: TableHeaderColor, // Set the background color of the header
    color: 'black', // Set the text color of the header
  };
  return (
    <div className='p-8 w-full' style={{ backgroundColor: colorBG }}>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Transactions Orders</h1>
        {!IsShowFilter && <CustomButton
          Text={'Filters'}
          icon={<img src={FILTER_CDN} alt='icon' />}
          style={{ height: '48px', borderRadius: '8px' }}
          onClickHandler={()=> setIsShowFilter(!IsShowFilter)}
        />
        }
      </div>
      {
      IsShowFilter &&  <div className="grid grid-cols-12 gap-4 my-3">
      <div className="col-span-12 sm:col-span-5 ">
        <CustomAutocomplete
          name={'Type'}
          varient={'standard'}
          label={'Select Type'}
          options={TypeList}
          getOptionLabel={(option) => option.title ? option.title : ""}
          onChange={(e, value) => {
            if (value) {
              setSelectedType(value)
            }
            else {
              setSelectedType(null)
            }
          }}
        />
      </div>
      <div className="col-span-12 sm:col-span-5 ">
        <CustomAutocomplete
          name={'Method'}
          varient={'standard'}
          label={'Select Method'}
          options={SelectedMethod}
          getOptionLabel={(option) => option.title ? option.title : ""}
          onChange={(e, value) => {
            if (value) {
              setSelectedMethod(value)
            }
            else {
              setSelectedMethod(null)
            }
          }}
        />
      </div>
      <div className="col-span-6 sm:col-span-1">
        <CustomButton
          Text={"Cancle"}
          style={{ height: "48px", borderRadius: "8px", backgroundColor: "#fff", borderColor: "#c1c1c1", color: "#7E7E7E" }}
          onClickHandler={()=> setIsShowFilter(!IsShowFilter)}
        />
      </div>
      <div className="col-span-6 sm:col-span-1">
        <CustomButton
          Text={"Apply Filters"}
          style={{ height: "48px", borderRadius: "8px" }}
        />
      </div>
    </div>
      }
     



      <CustomTable columns={columns} data={data} headerStyle={headerStyle} />
    </div>
  )
}

export default TransactionOrders