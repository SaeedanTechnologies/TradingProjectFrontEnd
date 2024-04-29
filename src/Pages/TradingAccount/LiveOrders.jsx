import { Space, theme, Spin } from 'antd';
import React, {useState, useEffect } from 'react'

import CustomTable from '../../components/CustomTable';
import { EditOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link, useLocation, } from 'react-router-dom';
import { Delete_Trade_Order,  Put_Trade_Order } from '../../utils/_TradingAPICalls';
import { useSelector } from 'react-redux';
import moment from 'moment';
import Swal from 'sweetalert2';
import { CustomDeleteDeleteHandler } from '../../utils/helpers';

const LiveOrders = ({ fetchLiveOrder, tradeOrder, isLoading, setIsLoading,CurrentPage,totalRecords,lastPage }) => {
   const userRole = useSelector((state)=>state?.user?.user?.user?.roles[0]?.name);
  const userBrand = useSelector((state)=> state?.user?.user?.brand)
  const token = useSelector(({ user }) => user?.user?.token)
  const location = useLocation()
  const { pathname } = location
  const {
    token: { colorBG, TableHeaderColor, colorPrimary },
  } = theme.useToken();


  const columns = [
    {
      title:<span className="dragHandler">Symbol</span>,
      dataIndex: 'symbol',
      key: '1',
      sorter: (a, b) => a.symbol.length - b.symbol.length,
      sortDirections: ['ascend'],
    },
    {  
      title:<span className="dragHandler">Time</span>,
      dataIndex: 'time',
      key: '2',
      render:(text)=><span style={{color:colorPrimary}}>{moment(text).format('MM/DD/YYYY HH:mm')}</span>,
      sorter: (a, b) => a.time.length - b.time.length,
      sortDirections: ['ascend'],
    
    },
    {
      title: <span className="dragHandler">Type</span>,
      dataIndex: 'type',
      key: 'type',
      sorter: (a, b) => a.time.length - b.time.length,
      sortDirections: ['ascend'],
      render: (text) => <span style={{ color: colorPrimary }}>{text}</span>
    },
    {
      title: <span className="dragHandler">Volume</span>,
      dataIndex: 'volume',
      key: 'volume',
      sorter: (a, b) => a.volume.length - b.volume.length,
      sortDirections: ['ascend'],
    },
    {
      title: <span className="dragHandler">SL</span>,
      dataIndex: 'stopLoss',
      key: 'stopLoss',
      sorter: (a, b) => a.stopLoss.length - b.stopLoss.length,
      sortDirections: ['ascend'],
    },
    {
      title: <span className="dragHandler">TP</span>,
      dataIndex: 'takeProfit',
      key: 'takeProfit',
      sorter: (a, b) => a.takeProfit.length - b.takeProfit.length,
      sortDirections: ['ascend'],
    },
    {
      title: <span className="dragHandler">Open Price</span>,
      dataIndex: 'open_price',
      key: 'open_price',
      sorter: (a, b) => a.open_price.length - b.open_price.length,
      sortDirections: ['ascend'],
    },
    {
      title: <span className="dragHandler">Profit</span>,
      dataIndex: 'profit',
      key: 'profit',
      sorter: (a, b) => a.profit.length - b.profit.length,
      sortDirections: ['ascend'],
    },
    // {
    //   title: 'Actions',
    //   dataIndex: 'actions',
    //   key: 'actions',
    //   render: (_, record) => (
    //     <Space size="middle" className='cursor-pointer'>
    //       <Link to={`/single-trading-accounts/details/live-order/${record.id}`}><EditOutlined style={{ fontSize: "24px", color: colorPrimary }} /></Link>
    //       <CloseOutlined style={{ fontSize: "24px", color: colorPrimary }} onClick={() => CancelLiveOrder(record.id)} />
    //       <DeleteOutlined style={{ fontSize: "24px", color: colorPrimary }} onClick={() => CustomDeleteDeleteHandler(record.id, token, Delete_Trade_Order, setIsLoading, fetchLiveOrder)} />
    //     </Space >
    //   ),
    // },
  ];


  const headerStyle = {
    background: TableHeaderColor,
    color: 'black',
  };

 const onPageChange = (page) =>{
      if(userRole === 'brand' ){
      fetchLiveOrder(userBrand.public_key,page)
    }
    else{
      fetchLiveOrder(null,page)
    }
  }



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
          
            if(userRole === 'brand' ){
              fetchLiveOrder(userBrand.public_key,page)
            }
            else{
              fetchLiveOrder(null,page)
            }

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
      if(userRole === 'brand' ){
      fetchLiveOrder(userBrand.public_key,CurrentPage)
    }
    else{
      fetchLiveOrder(null,CurrentPage)
    }
 
  }, [pathname])

  return (
    <Spin spinning={isLoading} size="large">
      <div className='p-8' style={{ backgroundColor: colorBG }}>
         <CustomTable
            direction="/single-trading-accounts/details/live-orders"
            formName = "Live Orders" 
            columns={columns}
            data={tradeOrder} 
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

export default LiveOrders