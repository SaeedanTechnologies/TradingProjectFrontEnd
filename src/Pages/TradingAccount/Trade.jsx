import { Spin, theme } from 'antd';
import React, { useState, useEffect } from 'react'
import ARROW_BACK_CDN from '../../assets/images/arrow-back.svg';
import { TradeOrderTypes,PendingOrderTypes,MarketOrderTypes, LeverageList } from '../../utils/constants';

import { PlusCircleOutlined } from '@ant-design/icons';

import CustomTextField from '../../components/CustomTextField';
import CustomButton from '../../components/CustomButton';
import CustomCheckbox from '../../components/CustomCheckbox';
import { useNavigate } from 'react-router-dom';
import { TradeValidationSchema } from '../../utils/validations';
import { numberInputStyle } from './style'
import { useSelector } from 'react-redux';
import { Get_Single_Trading_Account, Post_Group_Trade_Order, Post_Trade_Order } from '../../utils/_TradingAPICalls';
import { Autocomplete, TextField } from '@mui/material';
import { AllSymbelSettingList, All_Setting_Data } from '../../utils/_SymbolSettingAPICalls';
import CustomNotification from '../../components/CustomNotification';
import BinanceBidAsk from '../../websockets/BinanceBidAsk';
import axios from 'axios';
// import BinanceSocket from '../../websockets/BinanceSocket';
import TradePrice from './TradePrice';
import CustomNumberTextField from '../../components/CustomNumberTextField';
import CustomStopLossTextField from '../../components/CustomStopLossTextField';
import {calculateLotSize, calculateMargin, requiredMargin } from '../../utils/helpers';
import moment from 'moment';

import establishWebSocketConnection from '../../websockets/FCSAPIWebSocket';
import CandleStickChart from '../../components/CandleStickChart';

const Trade = ({ CurrentPage }) => {
  const token = useSelector(({ user }) => user?.user?.token)
  const {
    token: { colorBG, TableHeaderColor, colorPrimary, colorTransparentPrimary },
  } = theme.useToken();
  const navigate = useNavigate();
  const trading_account_id = useSelector((state) => state?.trade?.selectedRowsIds[0])
  const trading_group_id = useSelector(({group}) => group?.tradingGroupData?.id)
  
  const {balance, currency, leverage, brand_margin_call, id} = useSelector(({tradingAccountGroup})=> tradingAccountGroup?.tradingAccountGroupData )
  
  const {value: accountLeverage} = LeverageList?.find(x=> x?.title === leverage) ||  { value: '1', title: '1:1' }

  // console.log('trading_group_id',trading_group_id)

  const [isLoading, setIsLoading] = useState(false)
  const [symbolsList, setSymbolsList] = useState([])
  const [symbol, setSymbol] = useState(null);
  const [order_type, setOrder_type] = useState(null);
  const [type,setType] = useState(null);
  const [volume,setVolume] = useState('');
  const [lotstep,setLotStep] = useState('');
  const [volumerange,setVolumeRange] = useState({
    min_vol: '',
    max_vol: ''
  });
  const [pipVal, setPipVal] = useState(0);
  const [open_price,setOpen_price] = useState('');
  const [comment,setComment] = useState('');
  const [takeProfit,setTakeProfit] = useState('');
  const [stopLoss,setStopLoss] = useState('');
  const [stop_limit_price,setStop_limit_price] = useState('')
  const [pricing, setPricing] = useState({ openPrice: '', askPrice: '' });
  const [connected, setConnected] = useState(true);
  const [lot_size, setLotSize] = useState('')
  // const [rerenderCount, setRerenderCount] = useState(0);
  // const [streamConnected, setStreamConnected] = useState(false);
  const [brand_id,setBrand_id] = useState(-1);


  // const [manualpricing, setManualPricing] = useState({ openPrice: null, askPrice: null });
  const [errors, setErrors] = useState({});

  //  useBinanceBidAsk({symbol:symbol?.feed_fetch_name, onUpdate:onUpdateBidPrice})

  const lotSize = calculateLotSize(volume)
  
  const calculatedMargin = requiredMargin(volume,accountLeverage)

  const Margin= calculateMargin(lotSize,accountLeverage)

  const handleProfitChange = (newValue) => {
    setTakeProfit(newValue);
  };

  const handleLossChange = (newValue) => {
    setStopLoss(newValue);
  };

  const handleVolumeChange = (newValue) => {
    setVolume(newValue)
  }
  
  const handleInputChange = (fieldName, value) => {
    setErrors(prevErrors => ({ ...prevErrors, [fieldName]: '' }));
    switch (fieldName) {
      case 'order_type':
        setOrder_type(value);
        break;
      case 'type':
        setType(value);
        break;
      case 'volume':
        setVolume(value);
        break;
      case 'comment':
        setComment(value);
        break;
      case 'open_price':
        setOpen_price(value);
        break;
      case 'takeProfit':
        setTakeProfit(value);
        break;
      case 'stopLoss':
        setStopLoss(value)
      default:
      case 'stop_limit_price':
        setStop_limit_price(value)
        break;
    }
  };

  const clearFields = () => {
    setSymbol(null);
    setOrder_type(null);
    setType(null);
    setVolume('');
    setOpen_price('');
    setComment('');
    setTakeProfit('');
    setStopLoss('');
    setPricing({
      ...pricing,
      openPrice: '',
      askPrice: ''
    })
    setVolumeRange({
      ...volumerange,
      min_vol: '',
      max_vol: ''
    })
    setLotStep('')
    setStop_limit_price('')
  }

  const createOrder = async (typeReceive) => {
    try {
      await TradeValidationSchema.validate({
        symbol,
        order_type,
        volume,
        open_price: (connected && typeReceive ==='buy') ? pricing.openPrice : (connected && typeReceive ==='sell') ? pricing.askPrice : open_price,
        // takeProfit,
        // stopLoss,
      }, { abortEarly: false });

      setErrors({});
      const SymbolData = {
        symbol: symbol.feed_fetch_name,
        feed_name: symbol.feed_name,
        order_type: order_type.value,
        type: typeReceive ? typeReceive : type.value,
        volume: String(volume),
        comment,
        takeProfit: String(takeProfit === "" ? "" : takeProfit),
        stopLoss: String(stopLoss === "" ? "" : stopLoss),
        stop_limit_price,
        trading_account_id,
        open_price: String((connected && typeReceive ==='buy') ? `${pricing.openPrice}` : (connected && typeReceive ==='sell') ? `${pricing.askPrice}` : open_price),
        open_time: moment().format('MM/DD/YYYY hh:mm A'),
        brand_id
      }
      
      const TradeGroupSymbolData = {
        symbol: symbol.feed_fetch_name,
        feed_name: symbol.feed_name,
        order_type: order_type.value,
        type: typeReceive ? typeReceive : type.value,
        volume: String(volume),
        comment,
        takeProfit: String(takeProfit === "" ? "" : takeProfit),
        stopLoss: String(stopLoss === "" ? "" : stopLoss),
        stop_limit_price,
        trading_group_id: trading_group_id,
        open_price: String((connected && typeReceive ==='buy') ? `${pricing.openPrice}` : (connected && typeReceive ==='sell') ? `${pricing.askPrice}` : open_price),
        open_time: new Date().toISOString(),
        // brand_id
      }
      setIsLoading(true)
      const res = await (!CurrentPage ? Post_Group_Trade_Order(TradeGroupSymbolData, token) : Post_Trade_Order(SymbolData, token))
      const { data: { message, payload, success } } = res
      if (success) {
        setIsLoading(false)
        fetchData(null, connected, 0); //to stop connection when no symbol is selected
        CustomNotification({ type: "success", title: "Live Order", description: message, key: 1 })
        // CurrentPage && fetchLiveOrder(CurrentPage)
        clearFields()
      }
      else {
        setIsLoading(false)
        CustomNotification({ type: "error", title: "Live Order", description: message, key: 1 })

      }

    } catch (err) {
      CustomNotification({ type: "error", title: "Live Order", description: err.message, key: 1 })

      const validationErrors = {};
      err.inner.forEach(error => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
    }
  }

  const handleSubmit = (typeReceive) => {
      const tradePrice = (connected && typeReceive ==='buy') ? pricing.openPrice : (connected && typeReceive ==='sell') ? pricing.askPrice : open_price;
      const res = (parseFloat(parseFloat(volume) * parseFloat(lot_size) * tradePrice ).toFixed(2))
      // const margin = calculateMargin(res, accountLeverage)
      // if(margin > balance || balance === 0 ){
      // CustomNotification({ 
      //   type: "error", 
      //   title: "Validation", 
      //   description: 'Margin must be less than your balance', 
      //   key: 1 
      // })
      // }else{
        balance > 0 ? (stopLoss !== "" || takeProfit !== "") ?  typeReceive === 'sell' ? (stopLoss > (connected ? pricing.askPrice : open_price ) && takeProfit < (connected ? pricing.askPrice : open_price )) ?
        createOrder(typeReceive) : CustomNotification({ type: "error", title: "Live Order (Sell)", description: 'Stop Loss should be greater and Take Profit should be less than Price', key: 1 }) :
        typeReceive === 'buy' ? 
        (stopLoss < (connected ? pricing.askPrice : open_price ) && takeProfit > (connected ? pricing.askPrice : open_price )) ?
        createOrder(typeReceive) : CustomNotification({ type: "error", title: "Live Order (Buy)", description: 'Take Profit should be greater and Stop Loss should be less than Price', key: 1 }) :
        createOrder(typeReceive)
        :
        createOrder(typeReceive)
        :
        CustomNotification({ type: "error", title: "Live Order", description: `Insufficient Balance. You balance should be greater than $${calculatedMargin.toFixed(2)} but you have $${balance}`, key: 1 })
      // }
   
  }

  const fetchSymbolSettings = async () => {
    try {
      setIsLoading(true)
      // const res = await All_Setting_Data(token);
      const res = await AllSymbelSettingList(token);
      // debugger;
      const { data: { message, success, payload } } = res
      // setSymbolsList(payload).data

      setSymbolsList(payload)

      setIsLoading(false)

    } catch (error) {
      console.error('Error fetching symbol groups:', error);
    }
  };


   const fetchSingleTradeAccount = async () => {

    setIsLoading(true)
    const res = await Get_Single_Trading_Account(trading_account_id, token)
    const { data: { message, payload, success } } = res


    setIsLoading(false)
    if (success) {
      setBrand_id(payload?.brand_id)

    }



  }

  useEffect(()=>{
    fetchSingleTradeAccount()
   fetchSymbolSettings()
  },[])

useEffect(() => {
    // Skip the first render
    // if (rerenderCount > 0 && symbol !== null) {
    //     fetchData(symbol, connected);
    // }

    // // Increment rerender count after the first render
    // if (rerenderCount === 0) {
    //     setRerenderCount(1);
    // }

    // Cleanup function
    return () => {
        // Cleanup actions here (if needed)
        console.log('here')
        fetchData(null, connected, 0); //to stop connection when component unmounts
    };
},[]);


  //  function onUpdateBidPrice (bidPrice){
  //   setOpen_price(bidPrice);
  // };


  const fetchBinancehData = async (symbol, pip) => {
    try {
      const endPoint= `https://api.binance.com/api/v3/ticker/bookTicker?symbol=${symbol}`

      // if(feed_name === 'binance') {
        const response = await axios.get(endPoint);
        const data = response?.data;
        // setManualPricing({
        //   ...pricing,
        //   openPrice: data?.bidPrice,
        //   askPrice: data?.askPrice
        // })
        setPricing({
          ...pricing,
          openPrice: parseFloat(data?.bidPrice).toFixed(pip),
          askPrice: parseFloat(data?.askPrice).toFixed(pip)
        })
        setOpen_price(parseFloat(data?.askPrice).toFixed(pip))
      // }
      // else {
      //   CustomNotification({ type: "error", title: "Opps", description: `${feed_name} not configured yet`, key: 1 })
      // }
     
    } catch (error) {
      // setError('Error fetching data');
      console.error(error);
    }
  };

  const fetchFcsapiData = async (symbol, key, pip) => {
    try {
      const endPoint1= `https://fcsapi.com/api-v3/${key}/latest?id=${symbol?.toLowerCase()}&access_key=lg8vMu3Zi5mq8YOMQiXYgV`

      // if(feed_name === 'binance') {
        const response = await axios.get(endPoint1);
        const data = response?.data;
        console.log(data)

        setPricing({
          ...pricing,
          openPrice: parseFloat(data?.response[0]?.o).toFixed(pip),
          askPrice: parseFloat(data?.response[0]?.c).toFixed(pip)
        })
        setOpen_price(parseFloat(data?.response[0]?.c).toFixed(pip))
      // }
      // else {
      //   CustomNotification({ type: "error", title: "Opps", description: `${feed_name} not configured yet`, key: 1 })
      // }
     
    } catch (error) {
      // setError('Error fetching data');
      console.error(error);
    }
  };

  const handleCheckboxClick = (e) => {
    setConnected(e.target.checked)
    if(symbol?.feed_name === 'binance'){
      fetchData(symbol, e.target.checked, pipVal)
    }
    // if(symbol?.feed_name === 'binance'){
    //   fetchData(symbol, e.target.checked, pipVal)
    // }
    // if(symbol?.feed_name === 'fcsapi'){
    //   fetchData(symbol, e.target.checked, pipVal)
    // }
    // if(!e.target.checked){
    //   setOpen_price(pricing.askPrice)
    // }
  }

  // const fetchFcsapiSocketData = (api_key, currencyIds, pip) => {
  //       // Define callback functions
  //   const onDataReceived = (data) => {
  //     console.log('Data received:', data);
  //   };

  //   const onError = (error) => {
  //     console.error('WebSocket error:', error);
  //   };

  //   const onClose = () => {
  //     console.log('WebSocket connection closed.');
  //   };

  //   // Call establishWebSocketConnection with callbacks
  //   const closeWebSocketConnection = establishWebSocketConnection(api_key, currencyIds, onDataReceived, onError, onClose);

  //   // Close the WebSocket connection when needed
  //     // closeWebSocketConnection();

  // }


  const fetchData = (symbol, connected, pip) => {

    // if(symbol?.feed_name === 'binance') {


      const onError = (error) => {
        console.error('WebSocket error:', error);
      };
  
      const onClose = () => {
        console.log('Previous WebSocket connection closed');
      };
  
      // const onStop = () => {
      //   console.log('Previous WebSocket connection stopped manually');
      // };
      const binanceStream = BinanceBidAsk(symbol, connected);
  
      // if((!connected && streamConnected)){
  
      //   binanceStream.stop(onStop)
      //   setStreamConnected(false)
      //   return
      // }
  
      // setStreamConnected(true)
  
      if (binanceStream) {
        const onDataReceived = (data) => {
          if(!data?.bidPrice){
            if(symbol?.feed_name === 'binance'){
              fetchBinancehData(symbol?.feed_fetch_name, pipVal)
            }
            else{
              fetchFcsapiData(symbol?.feed_fetch_name, symbol?.feed_fetch_key, pipVal)
            }
          }
          else {
          // console.log('Bid Price:', data.bidPrice);
          // console.log('Ask Price:', data.askPrice);
          if(symbol?.feed_name === 'binance'){
            setPricing({
            ...pricing,
            openPrice: parseFloat(data?.bidPrice).toFixed(pip),
            askPrice: parseFloat(data?.askPrice).toFixed(pip)
          })
          }
          else {
            console.log('Fcsapi Data here')
          }
          }
        };
  
        binanceStream.start(onDataReceived, onError, onClose);
        // Optionally, stop the WebSocket connection when it's no longer needed  
        // binanceStream.stop();
      };
    // }
    // else {
    //   CustomNotification({ type: "error", title: "Opps", description: `${symbol?.feed_name} not configured yet`, key: 1 })
    // }
  }


  return (
    <Spin spinning={isLoading} size="large">

      <div className='p-8 border border-gray-300 rounded-lg' style={{ backgroundColor: colorBG }}>
        <div className='flex gap-3 justify-between'>
          <div className='flex gap-3 w-full'>
            {/* <img
              src={ARROW_BACK_CDN}
              alt='back icon'
              className='cursor-pointer'
              onClick={() => navigate(-1)}
            /> */}

            <h1 className='text-3xl font-bold'>Create New Order</h1>
          </div>
          {/* <CustomTextField
            label={'Search'}
            varient={'standard'}
            sx={{ width: '300px' }}
          /> */}
        </div>
        <div className='flex'>
          <div className="flex-1 mr-2 ">
            <div className="mb-4 grid grid-cols-1 gap-4">
              <div>

                <Autocomplete
                  name="Symbol"
                  id="Symbol"
                  variant={'standard'}
                  options={symbolsList}
                  getOptionLabel={(option) => option?.name ? option?.name : ""}
                  value={symbol}
                  onChange={(e, value) => {
                    
                    setLotSize(value?.lot_size)
                    setPipVal(value?.pip)
                    setVolumeRange({
                      ...volumerange,
                      min_vol: value?.vol_min,
                      max_vol: value?.vol_max
                    })
                    setLotStep(value?.lot_step)
                    setVolume(value?.vol_min)
                    if (value) {
                    setErrors(prevErrors => ({ ...prevErrors, symbol: "" }))
                    setSymbol(value)
                      if(value?.feed_name === 'binance'){
                      
                      fetchBinancehData(value?.feed_fetch_name, value?.pip)
                      if (value && connected) {
                      // setSymbol(value)
                      // setErrors(prevErrors => ({ ...prevErrors, symbol: "" }))
                      fetchData(value, connected, value?.pip);
                    }
                      }
                      else if (value?.feed_name === 'fcsapi'){
                        fetchData(null, connected, 0); //to stop connection when binance symbol is not selected
                        // fetchData(value, connected, value?.pip);
                        // fetchFcsapiSocketData('lg8vMu3Zi5mq8YOMQiXYgV' ,value?.feed_fetch_name, value?.pip)
                        fetchFcsapiData(value?.feed_fetch_name, value?.feed_fetch_key, value?.pip)
                      }

                      else {
                        CustomNotification({ type: "error", title: "Opps", description: `${value?.feed_name} not configured yet`, key: 1 })
                      }
                      
                    }
                    else
                      setSymbol(null)
                  }}
                  renderInput={(params) =>
                    <TextField {...params} name="Symbol" label="Select Symbol" variant="standard" />
                  }
                />
                {errors.symbol && <span style={{ color: 'red' }}>{errors.symbol}</span>}
              </div>

              <div>
                <Autocomplete
                  name={'Type'}
                  variant={'standard'}
                  label={'Type'}
                  options={TradeOrderTypes.slice(0,2)}
                  value={order_type}
                  getOptionLabel={(option) => option?.label ? option?.label : ""}
                  onChange={(e, value) => {
                    if (value) {

                      setOrder_type(value)
                      setErrors(prevErrors => ({ ...prevErrors, order_type: "" }))
                    }
                    else
                      setOrder_type(null)
                  }}
                  renderInput={(params) =>
                    <TextField {...params} name="Type" label="Order Type" variant="standard" />
                  }
                />
                {errors.order_type && <span style={{ color: 'red' }}>{errors.order_type}</span>}
              </div>
            </div>

            <div className={`mb-4 grid ${order_type?.value === 'pending' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}  gap-4`}>
              <div>
                {order_type?.value === 'pending' &&
                  <Autocomplete
                    name={'Type'}
                    variant={'standard'}
                    label={'Type'}
                    options={PendingOrderTypes}
                    value={type}
                    getOptionLabel={(option) => option?.label ? option?.label : ""}
                    onChange={(e, value) => {
                      if (value) {
                        setType(value)
                      }
                      else
                        setType(null)
                    }}
                    renderInput={(params) =>
                      <TextField {...params} name="Type" label="Select Type" variant="standard" />
                    }
                  />
                }
              </div>

              <div>
              <CustomNumberTextField
                      label="Volume"
                      value={volume}
                      initialFromState={volumerange?.min_vol ? parseFloat(volumerange?.min_vol) : 0.01}
                      onChange={handleVolumeChange}
                      fullWidth
                      // min={0.01}
                      // max={100}
                      min={volumerange?.min_vol ? parseFloat(volumerange?.min_vol) : 0.01}
                      max={volumerange?.max_vol ? parseFloat(volumerange?.max_vol) : 100}
                      step={lotstep ? parseFloat(lotstep) : 0.01}
                      // step={0.01}
                    />
                {/* <CustomTextField label={'Volume'} varient={'standard'} type="number" sx={numberInputStyle} value={volume} onChange={e => handleInputChange('volume', e.target.value)} /> */}
                {errors.volume && <span style={{ color: 'red' }}>{errors.volume}</span>}
              </div>

            </div>

            <div className="mb-4 grid grid-cols-1  gap-4">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                {
                  (!connected || order_type?.value === 'pending') ?
                    <div className="flex-1">
                      <CustomTextField
                        label={'Open Price'}
                        value={open_price}
                        type="number"
                        sx={numberInputStyle}
                        varient={'standard'}
                        onChange={e => handleInputChange('open_price', e.target.value)}
                      />
                      {errors.open_price && <span style={{ color: 'red' }}>{errors.open_price}</span>}
                    </div>
                  :  
                  <TradePrice label={'Price'} askPrice={pricing?.askPrice ?? ''} />  
                  // <TradePrice label={'Open Price / Ask Price'} openPrice={pricing?.openPrice ?? ''} askPrice={pricing?.askPrice ?? ''} />  
                }

                 
                  {/* <label className='mt-2'>Auto</label> */}
                  {order_type?.value !== 'pending' && 
              
                <div className="gap-2 border-b">
            
                  <CustomCheckbox label='Auto' checked={connected} onChange={handleCheckboxClick} />
                </div>
                  }
              </div>
            </div>

            <div className={`mb-4 grid  ${type?.value === 'Buy Sell Limit' || type?.value === 'Sell Stop Limit' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-4`}>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className="flex-1">
                    <CustomStopLossTextField
                      label="Take Profit"
                      value={takeProfit}
                      initialFromState={pricing?.askPrice ? pricing?.askPrice : 0}
                      // checkFirst={pricing?.askPrice ? true : false}
                      checkFirst={takeProfit === '' ? true : false}
                      onChange={ handleProfitChange}
                      fullWidth
                      min={0}
                      step={0.1}
                    />
                  {/* <CustomTextField label={'Take Profit'} varient={'standard'} type="number" sx={numberInputStyle} value={takeProfit} onChange={e => handleInputChange('takeProfit', e.target.value)} /> */}
                  {errors.takeProfit && <span style={{ color: 'red' }}>{errors.takeProfit}</span>}
                </div>
                <CustomStopLossTextField
                      label="Stop Loss"
                      value={stopLoss}
                      initialFromState={pricing?.askPrice ? pricing?.askPrice : 0}
                      checkFirst={stopLoss === '' ? true : false}
                      onChange={handleLossChange}
                      fullWidth
                      min={0}
                      step={0.1}
                    />
                {/* <CustomTextField label={'Stop Loss'} varient={'standard'} type="number" sx={numberInputStyle} value={stopLoss} onChange={e => handleInputChange('stopLoss', e.target.value)} /> */}
                {errors.stopLoss && <span style={{ color: 'red' }}>{errors.stopLoss}</span>}
              </div>
              {(type?.value === 'Buy Stop Limit' || type?.value === 'Sell Stop Limit') &&
                <CustomTextField label={'Stop Limit Price'} varient={'standard'} type="number" sx={numberInputStyle} value={stop_limit_price} onChange={e => handleInputChange('stop_limit_price', e.target.value)} />}
            </div>
            {/* <b>Open Price: {pricing?.openPrice ? `(${pricing?.openPrice})` : ''} / Ask Price: {pricing?.askPrice ? `(${pricing?.askPrice})` : ''}</b> */}
            {/* <b> Open Price (Socket) : {pricing?.openPrice} / Ask Price (Socket) : {pricing?.askPrice}</b> <br /> <b> Open Price (Manual) : {manualpricing.openPrice} / Ask Price (Manual): {manualpricing.askPrice}</b> */}
            <div className="mb-4 grid grid-cols-1 gap-4">
              <CustomTextField label={'Comments'}
                value={comment}
                onChange={e => handleInputChange('comment', e.target.value)}
                multiline={true}
                rows={1} />
            </div>
            {order_type?.value === 'pending' ?


              <div className="mb-4 grid grid-cols-1 w-full gap-4">
                <CustomButton
                  Text={"Place Order"}
                  style={{ height: "48px", backgroundColor: "#D52B1E", borderColor: "#D52B1E" }}
                  disabled={(type?.label === "Sell Limit" || type?.label === "Sell Stop") ? 
                  (stopLoss > open_price && takeProfit < open_price) ? false : true
                  : (type?.label === "Buy Limit" || type?.label === "Buy Stop") ?
                   (stopLoss < open_price && takeProfit > open_price) ? false : true 
                   : (type?.label === "Buy Stop Limit" && stop_limit_price < open_price) ?  
                   (stopLoss < stop_limit_price && takeProfit > stop_limit_price) ? false : true : (type?.label === "Sell Stop Limit" && stop_limit_price > open_price) ? (stopLoss > stop_limit_price && takeProfit < stop_limit_price) ? false : true : true}
                  onClickHandler={() => handleSubmit('')}
                />
              </div>
              :
              <div className="mb-4 grid grid-cols-1 md:grid-cols-2 w-full gap-4">
                <CustomButton
                  Text={`Sell ${pricing.askPrice ? `(${pricing.askPrice})` : ''}`}
                  style={{ height: "48px",width:"100%", backgroundColor: "#D52B1E", borderColor: "#D52B1E" }}
                  // disabled={connected ? (stopLoss > pricing.askPrice && takeProfit < pricing.askPrice) ? false : true : (stopLoss > open_price && takeProfit < open_price) ? false : true}
                  onClickHandler={() => handleSubmit('sell')}
                />
                <CustomButton Text={`Buy ${pricing.openPrice ? `(${pricing.openPrice})` : ''}`}
                  style={{ height: "48px",width:"100%" }}
                  // disabled={connected ? (stopLoss < pricing.askPrice && takeProfit > pricing.askPrice) ? false : true : (stopLoss < open_price && takeProfit > open_price) ? false : true}
                  onClickHandler={() => handleSubmit('buy')}
                />
              </div>
            }
          </div>
          <div className="flex-1 ml-2 ">
            <div className="mb-4">
                  <CandleStickChart symbol={symbol?.feed_fetch_name} connected={true} pricing = {pricing}/>
                  {Symbol.length > 0 && <div className='flex flex-col bg-white shadow-lg rounded-lg p-2 text-md font-bold text-gray-400 gap-3'>
                      <div className='flex justify-between'>
                      <span >1 Lots</span>
                      <span>1000 units</span>
                      </div>
                      <div className='flex justify-between'>
                      <span >Pips Value</span>
                      <span>USDT 0.01</span>
                      </div>
                      <div className='flex justify-between'>
                      <span >Required Margin</span>
                      <span>USDT 967.143</span>
                      </div>
                    
                  </div>}
              {/* <BinanceBidAsk symbol={"BTCUSD"}/> */}
            </div>
            {/* Your chart content */}
          </div>
        </div>
      </div>
    </Spin>
  )
}

export default Trade