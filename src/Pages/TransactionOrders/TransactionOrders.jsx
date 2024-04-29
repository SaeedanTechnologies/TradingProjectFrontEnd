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
  const userRole = useSelector((state)=>state?.user?.user?.user?.roles[0]?.name);
  const userBrand = useSelector((state)=> state?.user?.user?.brand)
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
      title:<span className="dragHandler">OrderID</span>,
      dataIndex: 'id',
      key: '1',
      sorter: (a, b) => a.id.length - b.id.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">Name</span>,
      dataIndex: 'name',
      key: '3',
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">Group</span>,
      dataIndex: 'group',
      key: '4',
      sorter: (a, b) => a.group.length - b.group.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">Country</span>,
      dataIndex: 'country',
      key: '5',
      sorter: (a, b) => a.country.length - b.country.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">Phone Number</span>,
      dataIndex: 'phone',
      key: '6',
      sorter: (a, b) => a.phone.length - b.phone.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">Email</span>,
      dataIndex: 'email',
      key: '7',
      sorter: (a, b) => a.email.length - b.email.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">Time</span>,
      dataIndex: 'created_at',
      key: '8',
      sorter: (a, b) => a.created_at.length - b.created_at.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">Type</span>,
      dataIndex: 'type',
      key: '9',
      sorter: (a, b) => a.type.length - b.type.length,
      sortDirections: ['ascend'],

    },
    {
     
      title:<span className="dragHandler">Method</span>,
      dataIndex: 'method',
      key: '10',
      sorter: (a, b) => a.method.length - b.method.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">Comment</span>,
      dataIndex: 'comment',
      key: '11',
      sorter: (a, b) => a.comment.length - b.comment.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">Amount</span>,
      dataIndex: 'amount',
      key: '12',
      sorter: (a, b) => a.amount.length - b.amount.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">Currency</span>,
      dataIndex: 'currency',
      key: '13',
      sorter: (a, b) => a.currency.length - b.currency.length,
      sortDirections: ['ascend'],
    },
    // {
    //   title: 'Actions',
    //   dataIndex: 'type',
    //   key: '9',
    //   render: (_, record) => (
    //     <Space size="middle" className='cursor-pointer'>
    //       <Link to={"/transaction-orders/:0"}><EditOutlined style={{ fontSize: "24px", color: colorPrimary }} /></Link>
    //       <DeleteOutlined style={{ fontSize: "24px", color: colorPrimary }} />
    //     </Space>
    //   ),
    // },
  ];

  const [isLoading, setIsLoading] = useState(false)
  const [transactionData, setTransactionData] = useState([])
  const [CurrentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)


  const fetchTransactionOrder = async (brandId,page) => {
    setIsLoading(true)

    const res = await Trading_Transaction_Order(token,brandId,page)
    const { data: { message, payload, success } } = res
    console.log(res)
    setIsLoading(false)
    if (success) {
      
      setCurrentPage(payload.current_page)
      setTransactionData(payload.data)
      setLastPage(payload.last_page)
      setTotalRecords(payload.total)
    
    }
  }
  useEffect(() => {
     if(userRole === 'brand' ){
      fetchTransactionOrder(userBrand.public_key,CurrentPage)
    }
    else{
      fetchTransactionOrder(null,CurrentPage)
    }
  }, [])

  const onPageChange = (page) =>{
      if(userRole === 'brand' ){
      fetchTransactionOrder(userBrand.public_key,page)
    }
    else{
      fetchTransactionOrder(null,page)
    }
  }

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
         <CustomTable
          direction="/transaction-orders"
          formName = "Transactions Orders" 
          columns={columns}
          data={transactionData} 
          headerStyle={headerStyle}
          total={totalRecords}
          onPageChange = {onPageChange}
          current_page={CurrentPage}
          token = {token}
        />
      </div>
    </Spin>
  )
}

export default TransactionOrders