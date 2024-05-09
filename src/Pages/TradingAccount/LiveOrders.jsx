import { theme, Spin } from 'antd';
import React, {useState, useEffect } from 'react'

import CustomTable from '../../components/CustomTable';
import { MinusCircleOutlined  } from '@ant-design/icons';
import { useLocation, } from 'react-router-dom';
import { Put_Trade_Order, Put_Trading_Account } from '../../utils/_TradingAPICalls';
import { useSelector } from 'react-redux';
import moment from 'moment';
import CustomNotification from '../../components/CustomNotification';
import { CurrenciesList, LeverageList } from '../../utils/constants';
import { calculateEquity, calculateFreeMargin, calculateMargin, calculateMarginCallPer } from '../../utils/helpers';

const LiveOrders = ({ fetchLiveOrder, tradeOrder, isLoading, setIsLoading,CurrentPage,totalRecords,lastPage, grandProfit, lotSize }) => {
 
  const token = useSelector(({ user }) => user?.user?.token)
  const {balance, currency, leverage, brand_margin_call, id} = useSelector(({tradingAccountGroup})=> tradingAccountGroup.tradingAccountGroupData )
  const {value: accountLeverage} = LeverageList.find(x=> x.title === leverage)
  const {title : CurrencyName} = CurrenciesList.find(x=> x.value === currency)
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
      render: (text)=> <span className={`${text < 0 ? 'text-red-600' : 'text-green-600'}`}>{text}</span>
    },
    // {
    //   title: 'Actions',
    //   dataIndex: 'actions',
    //   key: 'actions',
    //   render: (_, record) => (
    //     <Space size="middle" className='cursor-pointer'>
    //       <CloseOutlined style={{ fontSize: "24px", color: colorPrimary }} onClick={() => CancelLiveOrder(record.id)} />
    //     </Space >
    //   ),
    // },
  ];

  const headerStyle = {
    background: TableHeaderColor,
    color: 'black',
  };

 const onPageChange = (page) =>{
      fetchLiveOrder(page)
  }
  // const CancelLiveOrder = async (id) => {

   const requiredOrder = tradeOrder.find((order)=>order.id === id)

  //   setIsLoading(true)
  //   const currentDateISO = new Date().toISOString();
  //   // const currentDate = new Date(currentDateISO);
  //   // const formattedDate = moment(currentDate).format('MM/DD/YYYY HH:mm');
  //   const closeOrderData = {
  //       order_type : 'close',
  //       close_time: currentDateISO,
  //       close_price : requiredOrder.open_price

  //     }
  //     try{
  //       const res = await Put_Trade_Order(id,closeOrderData, token)
  //       const { data: { message, payload, success } } = res
  //       if (success) {
        
  //       CustomNotification({ type: "success", title: "Live Order", description: message, key: 1 })
  //       fetchLiveOrder(page)       
      
  //     }
  //     else {
      
  //       CustomNotification({ type: "error", title: "Live Order", description: message, key: 1 })

  //     }
  //     }catch(error){
  //       CustomNotification({ type: "error", title: "Live Order", description: error.message, key: 1 })

  //     }
        
  // }
  useEffect(() => {
    fetchLiveOrder(CurrentPage)
  }, [pathname])
  useEffect(()=>{
    const res = calculateMarginCallPer(balance,grandProfit,lotSize,accountLeverage)
    
    if(parseFloat(res) < parseFloat(brand_margin_call)){
      UpdateTradingAccountStatus()
    }
  }, [balance,grandProfit,lotSize,accountLeverage])
  const UpdateTradingAccountStatus = async()=>{
    const Params = {
      status: "margin_call", 
      margin_level_percentage:calculateMarginCallPer(balance,grandProfit,lotSize,accountLeverage),
      equity:calculateEquity(balance, grandProfit)
    }
    const res = await Put_Trading_Account(id, Params, token)
    
  }
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
            footer={()=> <span className='text-sm font-bold text-arial'>
             <MinusCircleOutlined /> 
             Balance: {balance} {CurrencyName} &nbsp;
             Equity: {calculateEquity(balance, grandProfit)} {CurrencyName}  &nbsp;
             Margin: {calculateMargin(lotSize,accountLeverage)} &nbsp;
             Free Margin {calculateFreeMargin(balance,grandProfit,lotSize,accountLeverage)} &nbsp;
             Margin Level:  {calculateMarginCallPer(balance,grandProfit,lotSize,accountLeverage)} %
            </span>}
          />
      </div>
    </Spin>
  )
}

export default LiveOrders