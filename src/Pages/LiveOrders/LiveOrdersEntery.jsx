import { theme, Spin, Dropdown } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { LeftOutlined, RightOutlined, CaretDownOutlined } from '@ant-design/icons';
import ARROW_BACK_CDN from '../../assets/images/arrow-back.svg';
import CustomTextField from '../../components/CustomTextField';
import { PendingOrderTypes,  TradeOrderTypes } from '../../utils/constants';
import CustomButton from '../../components/CustomButton';
import { useDispatch, useSelector } from 'react-redux';
import { Autocomplete, TextField,InputAdornment } from '@mui/material'
import { EditOutlined } from '@mui/icons-material';
import { numberInputStyle } from '../TradingAccount/style';
import { CustomBulkDeleteHandler } from '../../utils/helpers';
import { GenericEdit,GenericDelete } from '../../utils/_APICalls';
import CustomNotification from '../../components/CustomNotification';
import { AllSymbelSettingList,  SymbolSettingPost, UpdateSymbolSettings } from '../../utils/_SymbolSettingAPICalls';
import CustomNumberTextField from '../../components/CustomNumberTextField';
import CustomStopLossTextField from '../../components/CustomStopLossTextField';
import { Get_Single_Trade_Order } from '../../utils/_TradingAPICalls';
import { deleteLiveOrderById } from '../../store/TradeOrders';




const LiveOrdersEntery = () => {
  const token = useSelector(({ user }) => user?.user?.token)
  const LiveOrdersRowsIds = useSelector(({ tradeOrders }) => tradeOrders.selectedLiveOrdersRowsIds)
  const LiveOrdersData = useSelector(({tradeOrders})=> tradeOrders.liveOrdersData)
  const ArrangedLiveOrdersData = LiveOrdersData.slice().sort((a, b) => a.id - b.id);
  
  const {
    token: { colorBG },} = theme.useToken();
  const navigate = useNavigate()
  const dispatch = useDispatch()

    const [symbolsList, setSymbolsList] = useState([])
    const [symbol, setSymbol] = useState(null);
    const [pricing, setPricing] = useState({ openPrice: 0, askPrice: 0 });
    const [open_price,setOpen_price] = useState(0);
    const [order_type, setOrder_type] = useState(null);
    const [type,setType] = useState(null);
    const [volume,setVolume] = useState(0.01);
    const [takeProfit,setTakeProfit] = useState('');
    const [stopLoss,setStopLoss] = useState('');
    const [comment,setComment] = useState('');
    const [brand_id,setBrand_id] = useState('')





  const [selectedFeedNameFetch, setSelectedFeedNameFetch] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const [symbolName, setSymbolName] = useState('')
  const [SelectedLeverage, setSelectedLeverage] = useState(null)
  const [errors, setErrors] = useState({});

  const [selectedFeedName, setSelectedFeedName] = useState(null)
  const [SelectedSymbol, setSelectedSymbol] = useState(null)

  const [swap, setSwap] = useState('')
  const [lotSize, setLotSize] = useState('')
  const [lotSteps, setLotSteps] = useState('')
  const [volMin, setVolMin] = useState('')
  const [volMax, setVolMax] = useState('')
  const [commission, setCommission] = useState('')
  
  const [selectedPip,setSelectedPip] = useState(null)
  const [Selectedenable, setSelectedEnable] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const [isDisabled, setIsDisabled] = useState(false)
  const [connected, setConnected] = useState(false);

 




  const fetchBinancehData = async (symbol, feed_name) => {
    try {
      const endPoint= `https://api.binance.com/api/v3/ticker/bookTicker?symbol=${symbol}`
      if(feed_name === 'binance') {
        const response = await axios.get(endPoint);
        const data = response?.data;
       
        setPricing({
          ...pricing,
          openPrice: parseFloat(data?.bidPrice).toFixed(5),
          askPrice: parseFloat(data?.askPrice).toFixed(5)
        })
        setOpen_price(parseFloat(data?.askPrice).toFixed(5))
      }
      else {
        CustomNotification({ type: "error", title: "Opps", description: `${feed_name} not configured yet`, key: 1 })
      }
     
    } catch (error) {
      // setError('Error fetching data');
      console.error(error);
    }
  };


  const setStatesForEditMode = async (payload, success)=>{
      if (success) {
        setIsLoading(true)
        const selectedSymbolList =  symbolsList?.find((x)=> x.name === payload?.symbol)
        setSymbol(selectedSymbolList);
        setOpen_price(payload.open_price);
        const selectedOrderType =  TradeOrderTypes.find((x=>x.value === payload?.order_type))
        setOrder_type(selectedOrderType);
        const selectedType = PendingOrderTypes.find((x)=>x.value === payload?.type)
        setType(selectedType);
        setVolume(payload?.volume);
        setTakeProfit(payload?.takeProfit);
        setStopLoss(payload?.stopLoss);
        setComment(payload?.comment);
        setBrand_id(payload?.brand_id)
        setIsLoading(false)
      }
   
  }

  
  const handleNext = () => {
    if (currentIndex < ArrangedLiveOrdersData.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
      const payload = ArrangedLiveOrdersData[currentIndex + 1];
      setIsLoading(true)
      setTimeout(()=>{
        setIsLoading(false)
        setStatesForEditMode(payload, true)
      }, 3000)
    }else{
      alert(`no next record found`)
    }
  };
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
      const payload = ArrangedLiveOrdersData[currentIndex - 1];
      setIsLoading(true)
      setTimeout(()=>{
        setIsLoading(false)
        setStatesForEditMode(payload, true)
      }, 3000)
      
    }
  };

  
   const fetchSingleTradeOrder = async () => {
    setIsLoading(true)

    const { data: {  payload:SymbolsList } } = await AllSymbelSettingList(token);
    setSymbolsList(SymbolsList)


    const res = await Get_Single_Trade_Order(LiveOrdersRowsIds[0], token)
    const { data: { message, payload, success } } = res

    setIsLoading(false)
    if (success) {
    const selectedSymbolList =  symbolsList?.find((x)=> x.name === payload?.symbol)
    setSymbol(selectedSymbolList);
    setOpen_price(payload.open_price);
    const selectedOrderType =  TradeOrderTypes.find((x=>x.value === payload?.order_type))
    setOrder_type(selectedOrderType);
    const selectedType = PendingOrderTypes.find((x)=>x.value === payload?.type)
    setType(selectedType);
    setVolume(payload?.volume);
    setTakeProfit(payload?.takeProfit);
    setStopLoss(payload?.stopLoss);
    setComment(payload?.comment);
    setBrand_id(payload?.brand_id)

    }

    


    



  }

  useEffect(()=>{
    
     if (LiveOrdersRowsIds.length === 1 && parseInt(LiveOrdersRowsIds[0]) === 0) { // save
      setIsDisabled(false)
    } else if (LiveOrdersRowsIds.length === 1 && parseInt(LiveOrdersRowsIds[0]) !== 0) { // single edit
      const cIndex = ArrangedLiveOrdersData.findIndex(item => parseInt(item.id) === parseInt(LiveOrdersRowsIds[0]))
      setCurrentIndex(cIndex)
      setIsDisabled(true)
      fetchSingleTradeOrder()
    } else { // mass edit
      setIsDisabled(true)
    }
  },[])

  const handleSubmit = async () => {
    
    try {
    

     const SymbolGroupData = { // passing 0 to all fields if thers no need to validtion for mass editcase pass 0 so backend skip update which records have 0
        name: symbolName ? symbolName : '',
        symbel_group_id: SelectedSymbol ? SelectedSymbol.id : '',
        feed_fetch_name: selectedFeedNameFetch ? selectedFeedNameFetch.id : '',
        feed_fetch_key:selectedFeedNameFetch?.group?.toLowerCase(),
        speed_max: 'abc',
        lot_size: lotSize ? lotSize : '',
        lot_step: lotSteps ? lotSteps : '',
        commission: commission ? commission : '',
        enabled: Selectedenable ? Selectedenable.title = 'Yes' ? 1 : 0 : 0,
        pip:selectedPip.value,
        leverage: SelectedLeverage ? SelectedLeverage.value : '',
        feed_name: selectedFeedName ? selectedFeedName.module : '',
        feed_server: selectedFeedName ? selectedFeedName.feed_server : '',
        swap: swap ? swap : '',
        vol_min: volMin ? volMin : '',
        vol_max: volMax ? volMax : '',
      };
      if (LiveOrdersRowsIds?.length === 1 && parseInt(LiveOrdersRowsIds[0]) === 0) { // save 
        setIsLoading(true)
        const res = await SymbolSettingPost(SymbolGroupData, token);
        const { data: { message, success, payload } } = res;
        setIsLoading(false)
        if (success) {
          CustomNotification({
            type: 'success',
            title: 'success',
            description: 'Live Order is  Created Successfully',
            key: 2
          })
        }

      } else{
        setIsLoading(true)
        const Params = {
          table_name: 'trade_orders',
          table_ids: LiveOrdersRowsIds,
          ...SymbolGroupData
        }
        const res = await GenericEdit(Params, token)
        const { data: { message, success, payload } } = res;
        setIsLoading(false)
        if (res !== undefined) {
          if (success) {
            CustomNotification({
              type: 'success',
              title: 'success',
              description: 'Live Order Updated Successfully',
              key: 2
            })
            navigate('/live-orders')
          } else {
            setIsLoading(false)
            CustomNotification({
              type: 'error',
              title: 'error',
              description: message,
              key: `abc`
            })
          }
        }

      }
      

    } catch (err) {
      const validationErrors = {};
      err.inner?.forEach(error => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
    }
  };

const handleVolumeChange = (newValue) => {
    setVolume(newValue)
  }

const handleProfitChange = (newValue) => {
    setTakeProfit(newValue);
  };

const handleLossChange = (newValue) => {
    setStopLoss(newValue);
  };

  
  const deleteHandler = ()=>{
    const Params = {
      table_name:'trade_orders',
      table_ids: [ArrangedLiveOrdersData[currentIndex].id]
    }
    
    CustomBulkDeleteHandler(Params,token,GenericDelete, setIsLoading )
    dispatch(deleteLiveOrderById(ArrangedLiveOrdersData[currentIndex].id))
    if(ArrangedLiveOrdersData.length === 0 || ArrangedLiveOrdersData === undefined || ArrangedLiveOrdersData === null){
       navigate("/live-orders")
    }else{
      if(currentIndex < ArrangedLiveOrdersData.length)
      handleNext()
      else
      handlePrevious()
    }
    

  }
  const items = [
    
    {
      key: '1',
      label: (
        <button className='w-full text-left' rel="noopener noreferrer" onClick={()=>{
          setIsDisabled(false)
        }}>   Edit </button>
      ),
    },
    {
      key: '2',
      label: (
        <button  className='w-full text-left' rel="noopener noreferrer" onClick={deleteHandler} >   Delete  </button>
      ),
    },
   
  ];
  const cancleHandler= ()=>{
    if(isDisabled){
      navigate('/live-orders')

    }else{
      setIsDisabled(true)
    }
  }
  return (
    <Spin spinning={isLoading} size="large">
      <div className='p-8' style={{ backgroundColor: colorBG }}>
        <div className='flex justify-between'>
          <div className='flex gap-3 items-center'>
            <img
              src={ARROW_BACK_CDN}
              alt='back icon'
              className='cursor-pointer'
              onClick={() => navigate("/live-orders")}
            />
            {
              isDisabled ? <h1 className='text-2xl font-semibold'>Preview Live Orders</h1> :
                <h1 className='text-2xl font-semibold'>{LiveOrdersRowsIds?.length === 1 && parseInt(LiveOrdersRowsIds[0]) === 0 ? 'Add Live Order' : 'Edit Live Order'}</h1>
            }
          </div>
          {/* toolbar */}
          {(isDisabled && LiveOrdersRowsIds?.length > 1) && <EditOutlined className='cursor-pointer' onClick={()=> setIsDisabled(false)} />}
          {(LiveOrdersRowsIds?.length === 1 && parseInt(LiveOrdersRowsIds[0]) !== 0 && isDisabled)  &&
            <div className='flex gap-4 bg-gray-100 py-2 px-4 rounded-md mb-4' >
           <LeftOutlined className='text-[24px] cursor-pointer' onClick={handlePrevious} />
            <RightOutlined className='text-[24px] cursor-pointer' onClick={handleNext} />
            <Dropdown
              menu={{
                items,
              }}
              placement="bottom"
              arrow
              trigger={['click']}
              
            >
              <div className='bg-gray-200 p-2 px-4 rounded-md cursor-pointer'> More <CaretDownOutlined /> </div>
          </Dropdown>
            </div>
          }
        
        </div>
        <div className='border rounded-lg p-4'>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>

            <div>

                <Autocomplete
                  name="Symbol"
                  id="Symbol"
                  variant={'standard'}
                  options={symbolsList}
                  disabled={isDisabled}
                  getOptionLabel={(option) => option?.name ? option?.name : ""}
                  value={symbol}
                  onChange={(e, value) => {
                    if (value) {
                      setErrors(prevErrors => ({ ...prevErrors, symbol: "" }))
                      setSymbol(value)
                      fetchBinancehData(value?.feed_fetch_name, value?.feed_name)
                      if (value && connected) {
                      // setSymbol(value)
                      // setErrors(prevErrors => ({ ...prevErrors, symbol: "" }))
                      fetchData(value, connected);
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
                  options={TradeOrderTypes}
                  disabled={isDisabled}
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
                    <TextField {...params} name="Type" label="Order Type" variant="standard" />
                  }
                />
                {errors.order_type && <span style={{ color: 'red' }}>{errors.order_type}</span>}
            </div>

              {order_type?.value === 'pending' && ( <div>
                
                  <Autocomplete
                    name={'Type'}
                    variant={'standard'}
                    label={'Type'}
                    disabled={isDisabled}
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
             
            </div>
               )}
            
             { order_type?.value === 'pending' && (
                    <div>
                      <CustomTextField
                        label={'Open Price'}
                        value={open_price}
                        type="number"
                        disabled={isDisabled}
                        sx={numberInputStyle}
                        varient={'standard'}
                        onChange={e => handleInputChange('open_price', e.target.value)}
                      />
                      {errors.open_price && <span style={{ color: 'red' }}>{errors.open_price}</span>}
                    </div>
              )}
           
            <div>
              <CustomNumberTextField
                      label="Volume"
                      value={volume}
                      initialFromState={0.01}
                      onChange={handleVolumeChange}
                      disabled={isDisabled}
                      fullWidth
                      min={0.01}
                      max={100}
                      step={0.01}
                    />
                {errors.volume && <span style={{ color: 'red' }}>{errors.volume}</span>}
            </div>

            <div>
            <CustomStopLossTextField
            label="Take Profit"
                      value={takeProfit}
                      initialFromState={pricing?.askPrice ?? 0}
                      checkFirst={pricing?.askPrice ? true : false}
                      onChange={ handleProfitChange}
                       disabled={isDisabled}
                      fullWidth
                      min={0}
            step={0.1}
            />
           {errors.takeProfit && <span style={{ color: 'red' }}>{errors.takeProfit}</span>}
            </div>

            <div>
              <CustomStopLossTextField
                        label="Stop Loss"
                        value={stopLoss}
                        initialFromState={pricing?.askPrice ?? 0}
                        checkFirst={pricing?.askPrice ? true : false}
                        onChange={handleLossChange}
                        disabled={isDisabled}
                        fullWidth
                        min={0}
                        step={0.1}
                      />
                  {errors.stopLoss && <span style={{ color: 'red' }}>{errors.stopLoss}</span>}
            </div>

             <div>
              <CustomTextField label={'Comments'}
                varient={'standard'}
                value={comment}
                disabled={isDisabled}
                onChange={e => setComment(e.target.value)}
                 />
            </div>


          </div>
          
           



          {
            !isDisabled &&  <div className='flex justify-center items-center sm:justify-end flex-wrap gap-4 mt-6'>
            <CustomButton
              Text={ LiveOrdersRowsIds?.length === 1 && parseInt(LiveOrdersRowsIds[0]) === 0 ? 'Submit' : 'Update'}
              style={{
                padding: '16px',
                height: '48px',
                width: '200px',
                borderRadius: '8px',
                zIndex: '100'
              }}
              disabled={isDisabled}
              onClickHandler={handleSubmit}
            />
            <CustomButton
              Text='Cancel'
              style={{
                padding: '16px',
                height: '48px',
                width: '200px',
                borderRadius: '8px',
                backgroundColor: '#c5c5c5',
                borderColor: '#c5c5c5',
                color: '#fff'
              }}
              onClickHandler={cancleHandler}
            />
          </div>
          }
         
        </div>
      </div>
    </Spin>
  )
}

export default LiveOrdersEntery