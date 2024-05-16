import { theme, Spin, Table } from 'antd';
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
import { UpdateMultiTradeOrder } from '../../utils/_APICalls';

const LiveOrders = ({ fetchLiveOrder, tradeOrder, isLoading, setIsLoading,CurrentPage,totalRecords,lastPage, grandProfit, lotSize,margin, totalSwap }) => {
 
  const token = useSelector(({ user }) => user?.user?.token)
  const liveOrdersData = useSelector(({liveOrder})=> liveOrder.liveorder)
  const {balance, currency, leverage, brand_margin_call, id, credit, bonus, commission, tax} = useSelector(({tradingAccountGroup})=> tradingAccountGroup?.tradingAccountGroupData )
  const {value: accountLeverage} = LeverageList?.find(x=> x.title === leverage)
  const {title : CurrencyName} = CurrenciesList?.find(x=> x.value === currency)
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
      dataIndex: 'created_at',
      key: '2',
      render:(text)=><span style={{color:colorPrimary}}>{moment(text).format('MM/DD/YYYY HH:mm:ss')}</span>,
      sorter: (a, b) => a.time.length - b.time.length,
      sortDirections: ['ascend'],
    
    },
    {
      title: <span className="dragHandler">Type</span>,
      dataIndex: 'type',
      key: 'type',
      sorter: (a, b) => a.time.length - b.time.length,
      sortDirections: ['ascend'],
      render: (text)=> <span className={`${text === 'sell' ? 'text-red-600' : 'text-green-600'}`}>{text}</span>
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
      sorter: (a, b) => a?.stopLoss.length - b?.stopLoss.length,
      sortDirections: ['ascend'],
    },
    {
      title: <span className="dragHandler">TP</span>,
      dataIndex: 'takeProfit',
      key: 'takeProfit',
      sorter: (a, b) => a?.takeProfit.length - b?.takeProfit.length,
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
      title: <span className="dragHandler">Current Price</span>,
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      sorter: (a, b) => a.currentPrice.length - b.currentPrice.length,
      sortDirections: ['ascend'],
    },
    {
      title: <span className="dragHandler">Swap</span>,
      dataIndex: 'swap',
      key: 'swap',
      sorter: (a, b) => a.profit.length - b.profit.length,
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
  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        if(liveOrdersData.length > 0){
          const Params  = {orders:liveOrdersData}
          const res = await UpdateMultiTradeOrder(Params, token);
        }
       
      } catch (error) {
        console.error('Error calling API:', error);
      }
    }, 30000); // Interval set to 1000ms (1 second)
    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

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
            summary={() => (
              <Table.Summary fixed>
                <Table.Summary.Row className='bg-gray-300'>
                  <Table.Summary.Cell index={0} colSpan={9}>
                  <span className='text-sm font-bold text-arial'>
                      <MinusCircleOutlined /> 
                      Balance: {parseFloat(balance).toFixed(2)} {CurrencyName} &nbsp;
                      Equity: {calculateEquity(balance, grandProfit, credit, bonus)} {CurrencyName}  &nbsp;
                      Credit: {parseFloat(credit).toFixed(2)} {CurrencyName} &nbsp;
                      {tradeOrder.length > 0  &&
                      <span> Margin: {margin}</span>}&nbsp;
                      Free Margin {calculateFreeMargin(balance,grandProfit,lotSize,accountLeverage)} &nbsp;
                      {tradeOrder.length > 0  && <span>Margin Level:  {calculateMarginCallPer(balance,grandProfit,lotSize,accountLeverage)} %</span>}
                      </span>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>{totalSwap}</Table.Summary.Cell>
                  <Table.Summary.Cell>{grandProfit}</Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />
      </div>
    </Spin>
  )
}

export default LiveOrders