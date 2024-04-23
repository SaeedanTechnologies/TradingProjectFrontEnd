import React, { useState, useEffect } from 'react'
import { Space, theme, Spin } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import CustomTable from '../../components/CustomTable';
import moment from 'moment';

import { Delete_Trade_Order, Get_Trade_Order } from '../../utils/_TradingAPICalls';
import { CustomDeleteDeleteHandler } from '../../utils/helpers';



const CloseOrder = () => {
  const token = useSelector(({ user }) => user?.user?.token)
  const { token: { colorBG, colorPrimary, TableHeaderColor } } = theme.useToken();
  const [isLoading, setIsLoading] = useState(false)
  const [closeOrders, setCloseOrders] = useState([])

  const headerStyle = {
    background: TableHeaderColor, // Set the background color of the header
    color: 'black', // Set the text color of the header
  };
  const fetchCloseOrders = async () => {

    setIsLoading(true)
    const params = { OrderTypes: ['close'], token }
    const mData = await Get_Trade_Order(params)
    const { data: { message, payload, success } } = mData
    const allLiveOrders = payload?.data?.map((order) => ({
      id: order.id,
      loginId: order.trading_account_id,
      orderId: order.id,
      symbol: order.symbol,
      open_time: moment(order.open_time).format('L'),
      close_time: order.close_time ? moment(order.close_time).format('L') : '...',
      type: order.type,
      volume: order.volume,
      price: order.price,
      stopLoss: order.stopLoss,
      takeProfit: order.takeProfit,
      open_price: order.open_price,
      close_price: order.close_price ? close_price : '...',
      reason: order.reason ? order.reason : '...',
      swap: order.swap ? order.swap : '...',
      profit: order.profit ? order.profit : '...',
      comment: order.comment

    }))
    setIsLoading(false)
    if (success) {

      setCloseOrders(allLiveOrders)
    }

  }
  useEffect(() => {
    fetchCloseOrders()
  }, [])





  const columns = [


    {
      title: 'LoginID',
      dataIndex: 'loginId',
      key: 'loginId',
    },
    {
      title: 'OrderID',
      dataIndex: 'orderId',
      key: 'orderId',
    },

    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: 'Open Time',
      dataIndex: 'open_time',
      key: 'open_time',
    },
    {
      title: 'Closed Time',
      dataIndex: 'close_time',
      key: 'close_time',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Volume',
      dataIndex: 'volume',
      key: 'volume',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price'
    },
    {
      title: 'Stop Lose',
      dataIndex: 'stopLoss',
      key: 'stopLoss',
    },
    {
      title: 'Take Profit',
      dataIndex: 'takeProfit',
      key: 'takeProfit',
    },
    {
      title: 'Open Price',
      dataIndex: 'open_price',
      key: 'open_price',
    },
    {
      title: 'Closed Price',
      dataIndex: 'close_price',
      key: 'close_price',
    },

    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'Swap',
      dataIndex: 'swap',
      key: 'swap',
    },
    {
      title: 'Profit',
      dataIndex: 'profit',
      key: 'profit',
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle" className='cursor-pointer'>


          <DeleteOutlined style={{ fontSize: "24px", color: colorPrimary }} onClick={() => CustomDeleteDeleteHandler(record.id, token, Delete_Trade_Order, setIsLoading, fetchCloseOrders)} />

        </Space>

      ),
    },
  ];


  useEffect(() => {
    fetchCloseOrders()
  }, [])



  return (
    <Spin spinning={isLoading} size="large">
      <div className='p-8 w-full' style={{ backgroundColor: colorBG }}>
        <h1 className='text-2xl font-bold'>Close Orders</h1>
        <CustomTable columns={columns} data={closeOrders} headerStyle={headerStyle} />
      </div>
    </Spin>
  )
}

export default CloseOrder