import React, {  useState } from 'react';
import { footerStyle, submitStyle } from './style';
import CustomButton from '../../components/CustomButton';
import {  Save_Trading_Account } from '../../utils/_TradingAPICalls';
import { notifyError, notifySuccess } from '../../utils/constants';
import { ToastContainer } from 'react-toastify';
import { TradingAutocompleteDummyData,BrandIdAutocompleteDummyData } from '../../utils/constants';
import CustomNotification from '../../components/CustomNotification';
import { Spin } from 'antd';
import CustomTextField from '../../components/CustomTextField';
import CustomAutocomplete from '../../components/CustomAutocomplete';
import CustomPhoneNo from '../../components/CustomPhoneNo';
import { MuiTelInput } from 'mui-tel-input'
import { useSelector } from 'react-redux';


const TradingModal = ({setIsModalOpen, fetchTradingAccounts, TradingAccountID}) => {
  const token = useSelector(({user})=> user?.user?.token )
  

  const initialValues= {
    user_id:"",
    trading_group_id:"",
    country:"pakistan",
    phone:"",
    email:"",
    leverage:"",
    balance:"",
    credit:"",
    equity:"",
    margin_level_percentage:"",
    profit:"",
    swap:"",
    currency:"",
    brand_id:"",
    status:"active"
  }

  
  const [tradingAccount,setTradingAccount] = useState(initialValues) 

  const [errors, setErrors] = useState({}); // State to hold validation errors
  const [isLoading, setIsLoading] = useState(false)

 


  const Control = [
     {id: 1, control:'CustomTextField',  label:'User Login ID', varient: 'standard',value:tradingAccount.user_id, onChange:(e) =>{
        setTradingAccount(prevData => ({
                    ...prevData,
                    user_id: e.target.value
        }));
      }},
     {
        id: 2, 
        control:'CustomAutocomplete',
        name:'Group',   
        label:'Group', 
        varient: 'standard',
        options:TradingAutocompleteDummyData,
        value:tradingAccount.trading_group_id,
        getOptionLabel:(option) => option.label ? option.value : "",
        onChange:(e,value) =>{
           if(value){
               setTradingAccount(prevData => ({
                    ...prevData,
                    trading_group_id: value.value
                }));
          } 
          }   
      },
      {
        id: 3, 
        control:'CustomTextField',
        name:'Country',   
        label:'Country', 
        varient: 'standard',
        value:tradingAccount.country,
        onChange:(e) =>{
   
               setTradingAccount(prevData => ({
                    ...prevData,
                    country: e.target.value
                }));
          }   
      },
      
      {id: 5, control:'CustomTextField',  label:'Email', varient: 'standard',  value:tradingAccount.email, onChange:(e) =>{
               setTradingAccount(prevData => ({
                    ...prevData,
                    email: e.target.value
                }));
           
          }   
        },
      {id: 6, control:'CustomTextField',  label:'Leverage', varient: 'standard',value:tradingAccount.leverage,onChange:(e) =>{
          
               setTradingAccount(prevData => ({
                    ...prevData,
                    leverage: e.target.value
                }))
          }
      },
      {id: 7, control:'CustomTextField',  label:'Balance', varient: 'standard',value:tradingAccount.balance,onChange:(e) =>{
               setTradingAccount(prevData => ({
                    ...prevData,
                    balance: e.target.value
                }))
          }  },
      {
        id: 8, 
        control:'CustomAutocomplete',
        name:'Credit',   
        label:'Credit', 
        varient: 'standard',
        options:TradingAutocompleteDummyData,
        value:tradingAccount.credit, 
        getOptionLabel:(option) => option.label ? option.value : "",
        onChange:(e,value) =>{
          if(value){
               setTradingAccount(prevData => ({
                    ...prevData,
                    credit: value.value
                }))
          } 
          } 
             
      },
      {id: 9, control:'CustomTextField',  label:'Equity', varient: 'standard',value:tradingAccount.equity,
      onChange:(e) =>{
               setTradingAccount(prevData => ({
                    ...prevData,
                    equity: e.target.value
                }))
          }    },
      {
        id: 10, 
        control:'CustomAutocomplete',
        name:'MarginLevel',   
        label:'Margin Level', 
        varient: 'standard',
        options:TradingAutocompleteDummyData,
        value:tradingAccount.margin_level_percentage,
        getOptionLabel:(option) => option.label ? option.value : "",
        onChange:(e,value) =>{
         if(value){
               setTradingAccount(prevData => ({
                    ...prevData,
                    margin_level_percentage: value.value
                }))
          }  
          }

      },
      {id: 11, control:'CustomTextField',  label:'Profit', varient: 'standard', value:tradingAccount.profit,onChange:(e) =>{
               setTradingAccount(prevData => ({
                    ...prevData,
                    profit: e.target.value
                }))
          }  },
      {id: 12, control:'CustomTextField',  label:'Swap', varient: 'standard',value:tradingAccount.swap,onChange:(e) =>{
               setTradingAccount(prevData => ({
                    ...prevData,
                    swap: e.target.value
                }))
          }  },
      {
        id: 13, 
        control:'CustomAutocomplete',
        name:'Currency',   
        label:'Currency', 
        varient: 'standard',
        options:TradingAutocompleteDummyData,
        value:tradingAccount.currency,
        getOptionLabel:(option) => option.label ? option.value : "",
        onChange:(e,value) =>{
         if(value){
               setTradingAccount(prevData => ({
                    ...prevData,
                    currency: value.value
                }))
          }  
          } 
      },
      {
        id: 14, 
        control:'CustomAutocomplete',
        name:'BrandId',   
        label:'BrandId', 
        varient: 'standard',
        options:BrandIdAutocompleteDummyData,
        value:tradingAccount.brand_id,
        getOptionLabel:(option) => option.label ? option.value : "",
        onChange:(e,value) =>{
          if(value){
               setTradingAccount(prevData => ({
                    ...prevData,
                    brand_id: value.value
                }))
          } 
          }   
      },
    
  ]

   const ComponentMap = {
    CustomTextField: CustomTextField,
    CustomAutocomplete: CustomAutocomplete,
    CustomPhoneNo: CustomPhoneNo,
  };


  console.log('=====tradingAccount======',tradingAccount)

  const handleSubmit = async () => {
    try {
     setIsLoading(true)
     const res = await Save_Trading_Account(tradingAccount, token)
     const {data: {message, payload, success}} = res
     setIsLoading(false)
        if(success){
          console.log('success message',message)
          setTradingAccount(prevData=>({...prevData,... initialValues}))
          notifySuccess(message)
          setIsModalOpen(false)
          fetchTradingAccounts()
        
        }else{
          notifyError(payload.trading_group_id[0]) 
        }      
     
    }catch (err) {
     
       notifyError(err) 
    }
  };


 

  return (
    <Spin spinning={isLoading} size="large">
    <div className='flex flex-col gap-6'>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
       { Control.map(val=>{
            const ComponentToRender = ComponentMap[val.control]
            return (
            <div key={val.id}>
              <ComponentToRender
              name={val.name} 
              varient={val.varient} 
              label={val.label}
              options={val.options}
              getOptionLabel={(option) => val.getOptionLabel(option)}
              onChange={(e,value) => val.onChange(e,value)} 
              />
              {errors.marginCall && <span style={{ color: 'red' }}>{errors.marginCall}</span>}
            </div>
              )
            })
          }
        <MuiTelInput 
          value={tradingAccount.phone} 
          onChange={(newValue) => 
            setTradingAccount(prevData => ({
              ...prevData,
              phone: newValue
            }))
          }  
          variant="standard"
          defaultCountry="PK" 
/>

      <div style={footerStyle}>
        <CustomButton
          Text={'Submit'}
          style={submitStyle}
          onClickHandler={handleSubmit}
        />
      </div>
     
        </div>
         <ToastContainer />
    </div>
    </Spin>
  );
};

export default TradingModal;
