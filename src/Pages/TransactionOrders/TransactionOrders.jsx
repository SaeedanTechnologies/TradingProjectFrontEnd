import { Alert, AutoComplete, Space, Spin, theme } from 'antd';
import React, { useEffect, useState } from 'react'
import CustomTable from '../../components/CustomTable';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import CustomButton from '../../components/CustomButton';
import FILTER_CDN from '../../assets/images/filter-white.svg';
import CustomAutocomplete from '../../components/CustomAutocomplete';
import { Link, json } from 'react-router-dom';
import { Trading_Transaction_Order } from '../../utils/_SymbolSettingAPICalls';
import { useSelector } from 'react-redux';

const TransactionOrders = () => {
  const token = useSelector(({ user }) => user?.user?.token)
  const {
    token: { colorBG, colorPrimary, TableHeaderColor },
  } = theme.useToken();
  const [IsShowFilter, setIsShowFilter] = useState(false)
  const [TypeList, setTypeList] = useState([])
  const [SelectedType, setSelectedType] = useState(null)
  const [MethodList, setMethodList] = useState([])
  const [SelectedMethod, setSelectedMethod] = useState([])
  const columns = [
    // {
    //   title: 'LoginID',
    //   dataIndex: 'LoginID',
    //   key: '1',
    // },
    {
      title: 'OrderID',
      dataIndex: 'id',
      key: '2',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: '3',
    },
    {
      title: 'Group',
      dataIndex: 'group',
      key: '4',
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: '5',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
      key: '6',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: '7',
    },
    {
      title: 'Time',
      dataIndex: 'created_at',
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
      dataIndex: 'method',
      key: '9',
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: '9',
      render: (text) => <span style={{ color: colorPrimary }}>{text}</span>

    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: '9',
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
      key: '9',
    },
    {
      title: 'Actions',
      dataIndex: 'type',
      key: '9',
      render: (_, record) => (
        <Space size="middle" className='cursor-pointer'>
          <Link to={"/transaction-orders/:0"}><EditOutlined style={{ fontSize: "24px", color: colorPrimary }} /></Link>
          <DeleteOutlined style={{ fontSize: "24px", color: colorPrimary }} />
        </Space>
      ),
    },
  ];

  const [isLoading, setIsLoading] = useState(false)
  const [transactionData, setTransactionData] = useState([])
  const fetchTransactionOrder = async () => {
    setIsLoading(true)

    const res = await Trading_Transaction_Order(token)
    debugger
    const { data: { message, payload, success } } = res
    console.log(res)
    setIsLoading(false)
    if (success) {
      setTransactionData(payload.data)
    }
  }
  useEffect(() => {
    fetchTransactionOrder()
  }, [])

  const headerStyle = {
    background: TableHeaderColor,
    color: 'black',
  };
  return (
    <Spin spinning={isLoading} size="large">
      <div className='p-8 w-full' style={{ backgroundColor: colorBG }}>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>Transactions Orders</h1>
          {!IsShowFilter && <CustomButton
            Text={'Filters'}
            icon={<img src={FILTER_CDN} alt='icon' />}
            style={{ height: '48px', borderRadius: '8px' }}
            onClickHandler={() => setIsShowFilter(!IsShowFilter)}
          />
          }
        </div>
        {
          IsShowFilter && <div className="grid grid-cols-12 gap-4 my-3">
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
                onClickHandler={() => setIsShowFilter(!IsShowFilter)}
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
        <CustomTable columns={columns} data={transactionData} headerStyle={headerStyle} />
      </div>
    </Spin>
  )
}

export default TransactionOrders