import React, { useState, useEffect } from 'react'
import { PlusCircleOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { Space, Spin, Tag, theme } from 'antd';
import CustomButton from '../../components/CustomButton';
import CustomTable from '../../components/CustomTable';
import { Link, useNavigate } from 'react-router-dom';
import CustomTextField from '../../components/CustomTextField';
import { Trading_Accounts_List, Delete_Trading_Account } from '../../utils/_TradingAPICalls';
import CustomModal from '../../components/CustomModal';
import { notifySuccess, notifyError } from '../../utils/constants';
import { useSelector, useDispatch } from 'react-redux';
import TradingModal from './TradingModal'
import { setAccountID } from '../../store/TradeSlice';


const Index = ({ title, direction }) => {

  const [tradingAccountsList, setTradingAccountsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tradingID, setTradingID] = useState(null);
  const token = useSelector(({ user }) => user?.user?.token)
  const {
    token: { colorBG, TableHeaderColor, colorPrimary },
  } = theme.useToken();

  const navigate = useNavigate();
  const dispatch = useDispatch();


  const renderColumns = [
    {
      title: 'LoginId',
      dataIndex: 'loginId',
      key: 'loginId',
    },

    {
      title: 'Trading Group Id',
      dataIndex: 'trading_group_id',
      key: 'trading_group_id',
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: 'Phone No.',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Leverage',
      dataIndex: 'leverage',
      key: 'leverage'
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance'
    },
    {
      title: 'Credit',
      dataIndex: 'credit',
      key: 'credit'
    },
    {
      title: 'Equity',
      dataIndex: 'equity',
      key: 'equity'
    },
    {
      title: 'Margin Level',
      dataIndex: 'margin_level_percentage',
      key: 'margin_level_percentage'
    },
    {
      title: 'Profit',
      dataIndex: 'profit',
      key: 'profit'
    },
    {
      title: 'Swap',
      dataIndex: 'swap',
      key: 'swap'
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
      key: 'currency'
    },
    {
      title: 'Registration Time',
      dataIndex: 'registration_time',
      key: 'registration_time'
    },
    {
      title: 'Last Access Time',
      dataIndex: 'last_access_time',
      key: 'last_access_time'
    },
    {
      title: 'Last Access IP',
      dataIndex: 'last_access_address_IP',
      key: 'last_access_address_IP'
    },
    {
      title: 'Actions',
      dataIndex: 'type',
      key: '9',
      render: (_, record) => (
        <Space size="middle" className='cursor-pointer'>
          <EyeOutlined style={{ fontSize: "24px", color: colorPrimary }} onClick={() => setTradeId(record.id)} />
          <DeleteOutlined style={{ fontSize: "24px", color: colorPrimary }} onClick={() => DeleteHandler(record.id)} />

        </Space>
      ),
    },
  ]

  const headerStyle = {
    background: TableHeaderColor, // Set the background color of the header
    color: 'black', // Set the text color of the header
  };

  const setTradeId = (id) => {
    dispatch(setAccountID(id))
    navigate('/single-trading-accounts/details/live-order')

  }


  const fetchTradingAccounts = async () => {
    setIsLoading(true)
    const mData = await Trading_Accounts_List(token)
    const { data: { message, payload, success } } = mData
    setIsLoading(false)
    if (success) {
      const tradingAccounts = payload?.data?.map((item) => ({
        id: item.id,
        loginId: item.login_id,
        trading_group_id: item.trading_group_id,
        country: item.country,
        phone: item.phone,
        email: item.email,
        leverage: item.leverage,
        balance: item.balance,
        credit: item.credit,
        equity: item.equity,
        margin_level_percentage: item.margin_level_percentage,
        profit: item.profit,
        swap: item.swap,
        currency: item.currency,
        registration_time: item.registration_time,
        last_access_time: item.last_access_time === null ? 'null' : item.last_access_time,
        last_access_address_IP: item.last_access_address_IP === null ? 'null' : item.last_access_address_IP,

      }))
      setTradingAccountsList(tradingAccounts)
    }
  }

  const showModal = (id = null) => {
    setTradingID(id)
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const DeleteHandler = async (id) => {
    setIsLoading(true)
    const res = await Delete_Trading_Account(id, token)
    const { data: { success, message, payload } } = res
    setIsLoading(false)
    if (success) {
      notifySuccess(message)
      fetchTradingAccounts()
    } else {
      notifyError(message)
    }
  }

  useEffect(() => {
    debugger
    if (direction === 1) { // trading account list
      fetchTradingAccounts()

    } else if (direction === 2) { // Active Account Group


    } else { // margin calls


    }

  }, [direction])

  return (
    <Spin spinning={isLoading} size="large">
      <div className='p-8' style={{ backgroundColor: colorBG }}>
        <div className='flex flex-col sm:flex-row items-center gap-2 justify-between'>
          <h1 className='text-2xl font-semibold'>{title}</h1>
          <CustomTextField
            label='Search'
            sx={{ width: '300px' }}

          />
          {/* <CustomButton
                Text='Add New Trading Account'
                style={{borderRadius: '8px', padding: '14px, 20px, 14px, 20px'}}
                icon={<PlusCircleOutlined />}
                onClickHandler={()=>showModal(0)}
              />*/}
        </div>
        <CustomTable columns={renderColumns} data={tradingAccountsList} headerStyle={headerStyle} />
        <CustomModal
          isModalOpen={isModalOpen}
          handleOk={handleOk}
          handleCancel={handleCancel}
          title={''}
          width={800}
          footer={null}
        >
          <TradingModal
            setIsModalOpen={setIsModalOpen}
            fetchTradingAccounts={fetchTradingAccounts}
            BrandID={tradingID}
          />
        </CustomModal>
      </div>
    </Spin>
  )
}

export default Index