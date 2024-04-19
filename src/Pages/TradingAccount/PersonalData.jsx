import { theme } from 'antd';
import React, { useState,useEffect } from 'react'
import { GetCurrentDate } from '../../utils/constants';
import CustomAvatar from '../../components/CustomAvatar';
import CustomButton from '../../components/CustomButton';
import CustomTextField from '../../components/CustomTextField';
import CustomPhoneNo from '../../components/CustomPhoneNo';
import { AutocompleteDummyData } from '../../utils/constants';
import CustomAutocomplete from '../../components/CustomAutocomplete';
import { numberInputStyle, PDataSaveBtnStyle } from './style';
import { Autocomplete,TextField } from '@mui/material';
import { Get_Single_Trading_Account,Put_Trading_Account } from '../../utils/_TradingAPICalls';
import { useSelector } from 'react-redux';




const PersonalData = () => {
  const { token: { colorBG,  }} = theme.useToken();
  const [CountryList, setCountryList] = useState(AutocompleteDummyData)
  const [SelectedCountry, setSelectedCountry] = useState(null)
  const [RegisterdDate, setRegisterdDate] = useState(GetCurrentDate())
  const [isLoading,setIsLoading] = useState(false)
  const trading_account_id = useSelector((state)=>state?.trade?.trading_account_id)

  const Controls = [
    {id:1, control: 'CustomTextField', label:'Login ID', varient:'standard' },
    {id:2, control: 'CustomTextField', label:'Name', varient:'standard' },
    {id:3, control: 'CustomTextField', label:'Registerd Date', varient:'standard', value:RegisterdDate, type:'date' },
    {id:4, control: 'CustomTextField', label:'Email', varient:'standard' },
    {id:5, control: 'CustomPhoneNo' },
    {
      id:6, 
      control: 'CustomAutocomplete',
      name:'Country',  
      label:'Country', 
      variant:'standard', 
      options:CountryList,
      getOptionLabel:(option) => option.title ? option.title : "", 
      onChange: (e,value) =>{
        if(value){
            setSelectedCountry(value)
        }
        else{
            setSelectedCountry(null)
        } 
      }
     },
  ]
  
  
const fetchSingleTradeOrder= async()=>{
    
      setIsLoading(true)
      const res = await Get_Single_Trading_Account(trading_account_id, token)
      const {data: {message, payload, success}} = res

      setIsLoading(false)
      // if(success){
      //   const selectedSymbol =  SymbolList.find(x=> x.value === payload.symbol)
      //   const selectedOrderType  = payload.order_type === 'pending' ?  PendingOrderTypes:MarketOrderTypes;
      //   const orderType = TradeOrderTypes.find(x=>x.value === payload.order_type)
      //   const selectedType = selectedOrderType.find(x=> x.value === payload.type)
      //   setSymbol(selectedSymbol)
      //   setType(selectedType)
      //   setOrder_type(orderType)
      //   setVolume(payload.volume)
      //   setOpen_price(payload.open_price)
      //   setProfit(payload.profit)
      //   setStopLoss(payload.stopLoss)
      //   setTakeProfit(payload.takeProfit)
      //   setComment(payload.comment);
      //   setPrice(payload.price)
      
      // }

   
  }

  useEffect(()=>{
      
        fetchSingleTradeOrder()
  },[])


    useEffect(()=>{
    console.log('in personal data by default')
  },[])

  return (
    <div className='p-8 border border-gray-300 rounded-lg' style={{ backgroundColor: colorBG }}>
    {/* <div className='flex flex-col gap-3 justify-center items-center'>
      <CustomAvatar />
      <CustomButton 
      Text={'Upload Photo'}
      style={{height:'38px', borderRadius:'8px'}}
      />
    
    </div> */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-4">
      <div>
         <CustomTextField
          name='LoginID'
          type={'number'}
          varient='standard'
          label='LoginID'
          onChange={e => handleInputChange('loginID', e.target.value)}
          sx={numberInputStyle}
        />
        </div>

         <div>
         <CustomTextField
          name='Name'
          type={'text'}
          varient='standard'
          label='Name'
          onChange={e => handleInputChange('name', e.target.value)}
        />
        </div>
        <div>
         <CustomTextField
          name='date'
          type={'date'}
          varient='standard'
          label='Registered Date'
          onChange={e => handleInputChange('date', e.target.value)}
        
        />
        </div>
         <div>
         <CustomTextField
          name='email'
          type={'text'}
          varient='standard'
          label='Email'
          onChange={e => handleInputChange('email', e.target.value)}
          sx={numberInputStyle}
        />
        </div>
        <div>
          <CustomTextField
          name='Phone'
          type={'number'}
          varient='standard'
          label='Phone'
          onChange={e => handleInputChange('phone', e.target.value)}
          sx={numberInputStyle}
        />
        </div>

        <div>
        <CustomTextField
          name='Country'
          type={'text'}
          varient='standard'
          label='Country'
          onChange={e => handleInputChange('country', e.target.value)}
          sx={numberInputStyle}
        />
        </div>

      {/* {
        Controls.map(val=>{
          const ComponentToRender = ComponentMap[val.control]
          return (
            <ComponentToRender
            name={val.name} 
            varient={val.varient} 
            label={val.label}
            options={val.options}
            value={val.value}
            getOptionLabel={(option) => val.getOptionLabel(option)}
            onChange={(e,value) =>val.onChange(e, value)} 
            />
          )
        })
      } */}
          
    </div>
    <div className='flex justify-end'>
    <CustomButton
              Text={'Save Changes'}
              style={PDataSaveBtnStyle}
            />
    </div>
   
  </div>
  

  )
}

export default PersonalData