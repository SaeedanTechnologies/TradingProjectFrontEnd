import { Spin, theme } from 'antd';
import React, { useState, useEffect } from 'react'
import ARROW_BACK_CDN from '../../assets/images/arrow-back.svg';
import { TradeOrderTypes,PendingOrderTypes,MarketOrderTypes } from '../../utils/constants';

import { PlusCircleOutlined } from '@ant-design/icons';

import CustomTextField from '../../components/CustomTextField';
import CustomButton from '../../components/CustomButton';
import CustomCheckbox from '../../components/CustomCheckbox';
import { useNavigate } from 'react-router-dom';
import { TradeValidationSchema } from '../../utils/validations';
import { numberInputStyle } from './style';
import { useSelector } from 'react-redux';
import { Get_Single_Trading_Account, Post_Trade_Order } from '../../utils/_TradingAPICalls';
import { Autocomplete, TextField } from '@mui/material';
import { All_Setting_Data } from '../../utils/_SymbolSettingAPICalls';
import CustomNotification from '../../components/CustomNotification';
import BinanceBidAsk from '../../websockets/BinanceBidAsk';
import axios from 'axios';
// import BinanceSocket from '../../websockets/BinanceSocket';
import TradePrice from './TradePrice';

const Trade = ({ fetchLiveOrder }) => {
  const token = useSelector(({ user }) => user?.user?.token)
  const {
    token: { colorBG, TableHeaderColor, colorPrimary, colorTransparentPrimary },
  } = theme.useToken();
  const navigate = useNavigate();
  const trading_account_id = useSelector((state) => state?.trade?.trading_account_id)


  const [isLoading, setIsLoading] = useState(false)
  const [symbolsList, setSymbolsList] = useState([])
  const [symbol, setSymbol] = useState(null);
  const [order_type, setOrder_type] = useState(null);
  const [type,setType] = useState(null);
  const [volume,setVolume] = useState('');
  const [open_price,setOpen_price] = useState('');
  const [comment,setComment] = useState('');
  const [takeProfit,setTakeProfit] = useState(0);
  const [stopLoss,setStopLoss] = useState('');
  const [stop_limit_price,setStop_limit_price] = useState('')
  const [pricing, setPricing] = useState({ openPrice: null, askPrice: null });
  const [connected, setConnected] = useState(true);
  // const [rerenderCount, setRerenderCount] = useState(0);
  // const [streamConnected, setStreamConnected] = useState(false);
  const [brand_id,setBrand_id] = useState(-1);


  // const [manualpricing, setManualPricing] = useState({ openPrice: null, askPrice: null });
  const [errors, setErrors] = useState({});

  //  useBinanceBidAsk({symbol:symbol?.feed_fetch_name, onUpdate:onUpdateBidPrice})

  const handleChange = (e) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue) && newValue >= 0) {
      setTakeProfit(newValue);
    }
  };
  
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
    setStop_limit_price('')
  }

  const handleSubmit = async (typeReceive) => {
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
        order_type: order_type.value,
        type: typeReceive ? typeReceive : type.value,
        volume,
        comment,
        takeProfit: String(takeProfit),
        stopLoss,
        stop_limit_price,
        trading_account_id,
        open_price: (connected && typeReceive ==='buy') ? `${pricing.openPrice}` : (connected && typeReceive ==='sell') ? `${pricing.askPrice}` : open_price,
        open_time: new Date().toISOString(),

        brand_id

      }

      setIsLoading(true)
      const res = await Post_Trade_Order(SymbolData, token)
      const { data: { message, payload, success } } = res
      if (success) {
        setIsLoading(false)
        CustomNotification({ type: "success", title: "Live Order", description: message, key: 1 })

        fetchLiveOrder()
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

  const fetchSymbolSettings = async () => {
    try {
      setIsLoading(true)
      const res = await All_Setting_Data(token);
      // debugger;
      const { data: { message, success, payload } } = res
      setSymbolsList(payload.data)

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
        fetchData('stop', connected); //to stop connection when component unmounts
    };
},[]);


  //  function onUpdateBidPrice (bidPrice){
  //   setOpen_price(bidPrice);
  // };

  const fetchBinancehData = async (symbol) => {
    try {
      const response = await axios.get(`https://api.binance.com/api/v3/ticker/bookTicker?symbol=${symbol}`);
      const data = response?.data;
      // setManualPricing({
      //   ...pricing,
      //   openPrice: data?.bidPrice,
      //   askPrice: data?.askPrice
      // })
      setPricing({
        ...pricing,
        openPrice: data?.bidPrice,
        askPrice: data?.askPrice
      })
    } catch (error) {
      // setError('Error fetching data');
      console.error(error);
    }
  };

  const handleCheckboxClick = (e) => {
    setConnected(e.target.checked)
    if(symbol){
      fetchData(symbol, e.target.checked)
    }
  }


  const fetchData = (symbol, connected) => {

    const onError = (error) => {
      console.error('WebSocket error:', error);
    };

    const onClose = () => {
      console.log('Previous WebSocket connection closed');
    };

    // const onStop = () => {
    //   console.log('Previous WebSocket connection stopped manually');
    // };
    const binanceStream = BinanceBidAsk(symbol?.feed_fetch_name, connected);

    // if((!connected && streamConnected)){

    //   binanceStream.stop(onStop)
    //   setStreamConnected(false)
    //   return
    // }

    // setStreamConnected(true)

    if (binanceStream) {
      const onDataReceived = (data) => {
        if(!data?.bidPrice){
          fetchBinancehData(symbol?.feed_fetch_name)
        }
        else {
        console.log('Bid Price:', data.bidPrice);
        console.log('Ask Price:', data.askPrice);
        setPricing({
          ...pricing,
          openPrice: data?.bidPrice,
          askPrice: data?.askPrice
        })
        }
      };

      binanceStream.start(onDataReceived, onError, onClose);
      // Optionally, stop the WebSocket connection when it's no longer needed  
      // binanceStream.stop();
    };
  }


  return (
    <Spin spinning={isLoading} size="large">

      <div className='p-8 border border-gray-300 rounded-lg' style={{ backgroundColor: colorBG }}>
        <div className='flex gap-3 justify-between'>
          <div className='flex gap-3 w-full'>
            <img
              src={ARROW_BACK_CDN}
              alt='back icon'
              className='cursor-pointer'
              onClick={() => navigate(-1)}
            />

            <h1 className='text-3xl font-bold'>Create New Order</h1>
          </div>
          <CustomTextField
            label={'Search'}
            varient={'standard'}
            sx={{ width: '300px' }}
          />
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
                    if (value ) {
                      setErrors(prevErrors => ({ ...prevErrors, symbol: "" }))
                      setSymbol(value)
                    }
                    if (value && connected) {
                      setSymbol(value)
                      setErrors(prevErrors => ({ ...prevErrors, symbol: "" }))
                      fetchData(value, connected);
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
                  options={TradeOrderTypes}
                  value={order_type}
                  getOptionLabel={(option) => option.label ? option.label : ""}
                  onChange={(e, value) => {
                    if (value) {

                      setOrder_type(value)
                      setErrors(prevErrors => ({ ...prevErrors, order_type: "" }))
                    }
                    else
                      setOrder_type(null)
                  }}
                  renderInput={(params) =>
                    <TextField {...params} name="Type" label="Select Type" variant="standard" />
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
                    getOptionLabel={(option) => option.label ? option.label : ""}
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
                <CustomTextField
                  label={'Volume'} varient={'standard'} type="number" sx={numberInputStyle} value={volume} onChange={e => handleInputChange('volume', e.target.value)} />
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
                  :  <TradePrice label={'Open Price / Ask Price'} openPrice={pricing?.openPrice ?? ''} askPrice={pricing?.askPrice ?? ''} />  
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
                <TextField
                      type="number"
                      label="Take Profit"
                      value={takeProfit}
                      InputProps={{ inputProps: { min: 0, step: 0.1 }, style: { border: 'none' } }}
                      onChange={handleChange}
                      variant='standard'
                      fullWidth
                    />
                  {/* <CustomTextField label={'Take Profit'} varient={'standard'} type="number" sx={numberInputStyle} value={takeProfit} onChange={e => handleInputChange('takeProfit', e.target.value)} /> */}
                  {errors.takeProfit && <span style={{ color: 'red' }}>{errors.takeProfit}</span>}
                </div>
                <CustomTextField label={'Stop Loss'} varient={'standard'} type="number" sx={numberInputStyle} value={stopLoss} onChange={e => handleInputChange('stopLoss', e.target.value)} />
                {errors.stopLoss && <span style={{ color: 'red' }}>{errors.stopLoss}</span>}
              </div>
              {(type?.value === 'Buy Sell Limit' || type?.value === 'Sell Stop Limit') &&
                <CustomTextField label={'Stop Limit Price'} varient={'standard'} type="number" sx={numberInputStyle} value={stop_limit_price} onChange={e => handleInputChange('stop_limit_price', e.target.value)} />}
            </div>
            <b> Open Price (Socket) : {pricing?.openPrice} / Ask Price (Socket) : {pricing?.askPrice}</b> 
            {/* <br /> <b> Open Price (Manual) : {manualpricing.openPrice} / Ask Price (Manual): {manualpricing.askPrice}</b> */}
            <div className="mb-4 grid grid-cols-1 gap-4">
              <CustomTextField label={'Comments'}
                value={comment}
                onChange={e => handleInputChange('comment', e.target.value)}
                multiline={true}
                rows={4} />
            </div>
            {order_type?.value === 'pending' ?


              <div className="mb-4 grid grid-cols-1   gap-4">
                <CustomButton
                  Text={"Place Order"}
                  style={{ height: "48px", backgroundColor: "#D52B1E", borderColor: "#D52B1E" }}
                  onClickHandler={() => handleSubmit('')}
                />
              </div>
              :
              <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomButton
                  Text={"Sell"}
                  style={{ height: "48px", backgroundColor: "#D52B1E", borderColor: "#D52B1E" }}
                  onClickHandler={() => handleSubmit('sell')}
                />
                <CustomButton Text={"Buy"}
                  style={{ height: "48px" }}
                  onClickHandler={() => handleSubmit('buy')}
                />
              </div>
            }
          </div>
          <div className="flex-1 ml-2 ">
            <div className="mb-4">

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