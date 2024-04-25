import React, { useEffect, useState } from 'react'

import ARROW_BACK_CDN from '../../assets/images/arrow-back.svg';
import { Link, useNavigate } from 'react-router-dom';
import { Space, Spin, theme } from 'antd';
import CustomButton from '../../components/CustomButton';
import CustomTable from '../../components/CustomTable';
import { GET_Group_Transaction_Order } from '../../utils/_TradeOrderAPI';
import { useSelector } from 'react-redux';
import moment from 'moment';

const MassDipositWidthdraw = () => {
  const token = useSelector(({ user }) => user?.user?.token)
  const {
    token: { colorBG, TableHeaderColor, colorPrimary },
  } = theme.useToken();
  const navigate = useNavigate()
  const [transactionOrder, setTransactionOrder] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const getTransectionOrder = async () => {
    setIsLoading(true)
    const res = await GET_Group_Transaction_Order(token)
    const { data: { message, payload, success, } } = res
    setIsLoading(false)
    if (success) {
      setTransactionOrder(payload.data)
    }
  }
  useEffect(() => { getTransectionOrder() }, [])

  const headerStyle = {
    background: TableHeaderColor,
    color: 'black',
  };
  const columns = [
    {
      title: 'Time',
      dataIndex: 'Time',
      key: 'created_at',
      render: (text) => <a>{moment(text).format("YYYY-MM-DD HH:mm")}</a>,
    },

    {
      title: 'Type',
      dataIndex: 'type',
      key: '3',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: '4',
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
      key: '5',
    },
    {
      title: 'Method',
      dataIndex: 'method',
      key: '5',
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
    <Spin spinning={isLoading} size="large">
      <div className='p-8' style={{ backgroundColor: colorBG }}>
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
        <CustomTable columns={columns} data={transactionOrder} headerStyle={headerStyle} />

      </div>
    </Spin>
  )
}

export default MassDipositWidthdraw