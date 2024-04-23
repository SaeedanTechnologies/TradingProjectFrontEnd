import { Space, theme, Spin } from 'antd';
import React, {  useEffect } from 'react'

import CustomTable from '../../components/CustomTable';
import { EditOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link, useLocation, } from 'react-router-dom';
import { Delete_Trade_Order,  Put_Trade_Order } from '../../utils/_TradingAPICalls';
import { useSelector } from 'react-redux';
import moment from 'moment';
import Swal from 'sweetalert2';
import { CustomDeleteDeleteHandler } from '../../utils/helpers';

const LiveOrders = ({ fetchLiveOrder, tradeOrder, isLoading, setIsLoading }) => {
  const token = useSelector(({ user }) => user?.user?.token)
  const location = useLocation()
  const { pathname } = location
  const {
    token: { colorBG, TableHeaderColor, colorPrimary },
  } = theme.useToken();


  const columns = [
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      render:(text)=><span style={{color:colorPrimary}}>{moment(text).format('MM/DD/YYYY HH:mm')}</span>
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (text) => <span style={{ color: colorPrimary }}>{text}</span>
    },
    {
      title: 'Volume',
      dataIndex: 'volume',
      key: 'volume',
    },
    {
      title: 'SL',
      dataIndex: 'stopLoss',
      key: 'stopLoss',
    },
    {
      title: 'TP',
      dataIndex: 'takeProfit',
      key: 'takeProfit',
    },
    {
      title: 'Open Price',
      dataIndex: 'open_price',
      key: 'open_price',
    },
    {
      title: 'Profit',
      dataIndex: 'profit',
      key: 'profit',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle" className='cursor-pointer'>
          <Link to={`/single-trading-accounts/details/live-order/${record.id}`}><EditOutlined style={{ fontSize: "24px", color: colorPrimary }} /></Link>
          <CloseOutlined style={{ fontSize: "24px", color: colorPrimary }} onClick={() => CancelLiveOrder(record.id)} />
          <DeleteOutlined style={{ fontSize: "24px", color: colorPrimary }} onClick={() => CustomDeleteDeleteHandler(record.id, token, Delete_Trade_Order, setIsLoading, fetchLiveOrder)} />
        </Space >
      ),
    },
  ];


  const headerStyle = {
    background: TableHeaderColor,
    color: 'black',
  };





  const CancelLiveOrder = async (id) => {

   const requiredOrder = tradeOrder.find((order)=>order.id === id)


    setIsLoading(true)
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1CAC70",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Close the Order!"
    }).then(async (result) => {
      if (result.isConfirmed) {


        const currentDateISO = new Date().toISOString();
        const currentDate = new Date(currentDateISO);
        const formattedDate = moment(currentDate).format('MM/DD/YYYY HH:mm');
   
    const closeOrderData = {
        order_type : 'close',
        close_time: formattedDate,
        close_price : requiredOrder.open_price
      }



        // const close_time = new Date().toISOString;
        // const paramsString = `order_type=close&close_time=${close_time}&close_price=${requiredOrder.open_price}`;
        // const res = await Put_Trade_Order(id, paramsString, token)

        
        const res = await Put_Trade_Order(id,closeOrderData, token)
        const { data: { message, payload, success } } = res

        setIsLoading(false)
        if (success) {
          Swal.fire({
            title: "Order Closed!",
            text: message,
            icon: "success"
          });
          fetchLiveOrder()
        } else {
          Swal.fire({
            title: "Opps!",
            text: { message },
            icon: "error"
          });
        }

      }
    });

    setIsLoading(false)

  }


  useEffect(() => {
    fetchLiveOrder()
  }, [pathname])

  return (
    <Spin spinning={isLoading} size="large">
      <div className='p-8' style={{ backgroundColor: colorBG }}>
        <CustomTable columns={columns} data={tradeOrder} headerStyle={headerStyle} />
      </div>
    </Spin>
  )
}

export default LiveOrders