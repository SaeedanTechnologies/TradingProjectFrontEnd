import { Spin, theme } from 'antd';
import React, { useState,useEffect } from 'react'
import ARROW_BACK_CDN from '../../assets/images/arrow-back.svg';
import { PlusCircleOutlined } from '@ant-design/icons';
import CustomAutocomplete from '../../components/CustomAutocomplete';
import { SymbolAutocompleteDummyData,TradeOrderTypes,PendingOrderTypes,MarketOrderTypes } from '../../utils/constants';
import CustomTextField from '../../components/CustomTextField';
import CustomButton from '../../components/CustomButton';
import CustomCheckbox from '../../components/CustomCheckbox';
import { Link, useNavigate } from 'react-router-dom';
import { TradeValidationSchema } from '../../utils/validations';
import { notifySuccess, notifyError } from '../../utils/constants';
import { numberInputStyle } from './style';
import { useSelector } from 'react-redux';
import { Post_Trade_Order } from '../../utils/_TradingAPICalls';
import { Autocomplete,TextField } from '@mui/material';
import TradeChart from './TradeChart';




const Trade = () => {
    const token = useSelector(({user})=> user?.user?.token )
  const {
    token: { colorBG, TableHeaderColor, colorPrimary, colorTransparentPrimary },
  } = theme.useToken();
  const navigate = useNavigate();
  const trading_account_id = useSelector((state)=> state?.trade?.trading_account_id )

  const [isLoading,setIsLoading] = useState(false)
  const [symbol,setSymbol] = useState(null);
  const [order_type, setOrder_type] = useState(null);
  const [type,setType] = useState(null);
  const [volume,setVolume] = useState('');
  const [price,setPrice] = useState('');
  const [comment,setComment] = useState('');
  const [takeProfit,setTakeProfit] = useState('');
  const [stopLoss,setStopLoss] = useState('');
  const [stop_limit_price,setStop_limit_price] = useState('')
  const [errors, setErrors] = useState({});

 

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
        case 'price':
        setPrice(value);
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

   const clearFields = () =>{
      setSymbol(null);
      setOrder_type(null);
      setType(null);
      setVolume('');
      setPrice('');
      setComment('');
      setTakeProfit('');
      setStopLoss('');
      setStop_limit_price('')
    }

   const handleSubmit = async(typeReceive)=> {
    try{
      await TradeValidationSchema.validate({
            symbol,
            order_type,
            volume,
            comment,
            price,
            takeProfit,
            stopLoss,
        }, { abortEarly: false });

      setErrors({});
      const SymbolData = {
        symbol:symbol.value,
        order_type:order_type.value,
        type: typeReceive? typeReceive: type.value,
        volume,
        comment,
        price,
        takeProfit,
        stopLoss,
        stop_limit_price,
        trading_account_id,
        open_time: new Date().toISOString(),
        open_price: price
        
      }
      
      setIsLoading(true)
       const res = await Post_Trade_Order(SymbolData, token)
       const {data: {message, payload, success}} = res
       setIsLoading(false)
       alert(message)
       clearFields()  
    
    }catch(err){
      notifyError(err.message);
      const validationErrors = {};
      err.inner.forEach(error => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
    }
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
        sx={{width: '300px'}}
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
              options={SymbolAutocompleteDummyData}
              getOptionLabel={(option) => option.label ? option.label : ""} 
              value={symbol}
              onChange={(e,value) =>{
              if(value)
                {
                   setErrors(prevErrors => ({ ...prevErrors, symbol: "" }))
                   setSymbol(value)
                }
                else
                  setSymbol(null)                                                        
                }}
                 renderInput={(params) => 
                <TextField {...params} name="Symbol" label="Symbol"  variant="standard" />
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
                onChange={(e,value) =>{
                if(value)
                  {
                  
                      setOrder_type(value)
                      setErrors(prevErrors => ({ ...prevErrors, order_type: "" }))
                  }
                  else
                    setOrder_type(null)                                                        
                  }}
                  renderInput={(params) => 
                  <TextField {...params} name="Type" label="Type"  variant="standard" />
                    }
                />
                {errors.order_type && <span style={{ color: 'red' }}>{errors.order_type}</span>}
              </div>
          </div>

          <div className={`mb-4 grid ${order_type?.value === 'pending' ? 'grid-cols-1 md:grid-cols-2'  :'grid-cols-1'}  gap-4`}>
            <div>
              {order_type?.value === 'pending' &&
               <Autocomplete
                name={'Type'}
                variant={'standard'}
                label={'Type'}
                options={PendingOrderTypes}
                value={type}
                getOptionLabel={(option) => option.label ? option.label : ""}
                onChange={(e,value) =>{
                if(value)
                  {
                    setType(value)
                  }
                  else
                    setType(null)                                                        
                  }}
                  renderInput={(params) => 
                  <TextField {...params} name="Type" label="Type"  variant="standard" />
                    }
                />
              } 
            </div>
             
          
             <div>
              <CustomTextField  
              label={'Volume'} varient={'standard'} type="number" sx={numberInputStyle} value={volume}  onChange={e => handleInputChange('volume', e.target.value)}  />
               {errors.volume && <span style={{ color: 'red' }}>{errors.volume}</span>}
             </div>
            
          </div>
            
            <div className="mb-4 grid grid-cols-1 gap-4">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <CustomTextField label={'Price'} value={price} type="number" sx={numberInputStyle}
                      varient={'standard'}  onChange={e => handleInputChange('price', e.target.value)}/>
                       {errors.price && <span style={{ color: 'red' }}>{errors.price}</span>}
                </div>
                <div className="flex flex-1 flex-row  gap-2 border-b">
                  <CustomButton style={{
                    backgroundColor: colorTransparentPrimary,
                    borderColor: colorTransparentPrimary,
                    color: 'black',
                    fontWeight: 'bold',
                    borderRadius: 8
                  }} Text={'Update'} />
                  <CustomCheckbox />
                  <label className='mt-2'>Auto</label>
                </div>
                <div className= "flex-1">
                <CustomTextField label={'Take Profit'}  varient={'standard'} type="number" sx={numberInputStyle} value = {takeProfit}  onChange={e => handleInputChange('takeProfit', e.target.value)} />
                 {errors.takeProfit && <span style={{ color: 'red' }}>{errors.takeProfit}</span>}
                </div>
              </div>
          </div>
              
          <div className={`mb-4 grid  ${type?.value === 'Buy Sell Limit' || type?.value === 'Sell Stop Limit' ? 'grid-cols-1 md:grid-cols-2'  :'grid-cols-1'} gap-4`}>
            <div>
                <CustomTextField label={'Stop Loss'} varient={'standard'}  type="number" sx={numberInputStyle} value={stopLoss}  onChange={e => handleInputChange('stopLoss', e.target.value)} />
                {errors.stopLoss && <span style={{ color: 'red' }}>{errors.stopLoss}</span>}
            </div>
          {(type?.value === 'Buy Sell Limit' || type?.value === 'Sell Stop Limit') &&
          <CustomTextField label={'Stop Limit Price'} varient={'standard'} type="number" sx={numberInputStyle} value={stop_limit_price}  onChange={e => handleInputChange('stop_limit_price', e.target.value)}/>}
          </div>
          <div className="mb-4 grid grid-cols-1 gap-4">
            <CustomTextField label={'Comments'}
            value={comment}
            onChange={e => handleInputChange('comment', e.target.value)}
            multiline = {true}
            rows={4}/>
          </div>
          { order_type?.value === 'pending' ? 
        
          
          <div className="mb-4 grid grid-cols-1   gap-4">
            <CustomButton
            Text={"Place Order"} 
            style={{height:"48px",  backgroundColor:"#D52B1E", borderColor: "#D52B1E"  }}
            onClickHandler={()=>handleSubmit('')}
            />
            </div>
            :
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomButton
                Text={"Sell"} 
                style={{height:"48px", backgroundColor:"#D52B1E", borderColor: "#D52B1E"  }}
                onClickHandler={()=>handleSubmit('sell')}
                />
                <CustomButton Text={"Buy"}
                style={{height:"48px" }}
                onClickHandler={()=>handleSubmit('buy')}
                />
          </div>
            }
        </div> 
        <div className="flex-1 ml-2 ">
          <div className="mb-4">Chart Section</div>
          {/* Your chart content */}
        </div>
      </div>
      </div>
    </Spin>
  )
}

export default Trade