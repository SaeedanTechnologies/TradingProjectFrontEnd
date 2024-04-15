import React, { useEffect, useState } from 'react';
import { footerStyle, submitStyle } from './style';
import CustomButton from '../../components/CustomButton';
import * as Yup from 'yup';
import {tradingAccountValidationSchema } from '../../utils/validations'
import { useSelector } from 'react-redux';
import { GetSingleBrand, Save_Trading_Account, UpdateBrand } from '../../utils/_APICalls';
import { notifyError, notifySuccess } from '../../utils/constants';
import { ToastContainer } from 'react-toastify';
import { AutocompleteDummyData,TradingAutocompleteDummyData } from '../../utils/constants';
import { Spin } from 'antd';
import CustomTextField from '../../components/CustomTextField';
import CustomAutocomplete from '../../components/CustomAutocomplete';
import CustomPhoneNo from '../../components/CustomPhoneNo';


const TradingModal = ({setIsModalOpen, fetchTradingAccounts, TradingAccountID}) => {
  const token = useSelector(({user})=> user?.user?.token )
  const [GroupList, setGroupList] = useState(TradingAutocompleteDummyData)
  const [SelectedGroup, setSelectedGroup] = useState(null)
  const [CountryList, setCountryList] = useState(TradingAutocompleteDummyData)
  const [SelectedCountry, setSelectedCountry] = useState(null)
  const [CreditList, setCreditList] = useState(TradingAutocompleteDummyData)
  const [SelectedCredit, setSelectedCredit] = useState(null)
  const [MarginLevel, setMarginLevel] = useState(TradingAutocompleteDummyData)
  const [SelectedMarginLevel, setSelectedMarginLevel] = useState(null)
  const [CurencyList, setCurencyList] = useState(TradingAutocompleteDummyData)
  const [SelectedCurrency, setSelectedCurrency] = useState(null)
  const [CreditAccountGroup, setCreditAccountGroup] = useState(TradingAutocompleteDummyData)
  const [SelectedCreditAccountGroup, setSelectedCreditAccountGroup] = useState(null)

  const initialValues= {
    user_id:1,
    trading_group_id:1,
    country:"pakistan",
    phone:123123,
    email:"",
    leverage:"",
    balance:"",
    credit:"",
    equity:"",
    margin_level_percentage:"",
    profit:"",
    swap:"",
    currency:"",
    brand_id:0,
    status:"active"
  }

  
  const [tradingAccount,setTradingAccount] = useState(initialValues) 


  const [disabledDomain, setDisabledDomain] = useState(false);
  const [marginCall, setMarginCall] = useState('');
  const [errors, setErrors] = useState({}); // State to hold validation errors
  const [isLoading, setIsLoading] = useState(false)

 


  const Control = [
     {id: 1, control:'CustomTextField',  label:'Login ID', varient: 'standard',value:tradingAccount.user_id, onChange:(e,value) =>{
          if(value){
               setTradingAccount(prevData => ({
                    ...prevData,
                    user_id: value
                }));
          }
          
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
                    trading_group_id: value
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
        onChange:(e,value) =>{
          if(value){
               setTradingAccount(prevData => ({
                    ...prevData,
                    trading_group_id: value
                }));
          } 
          }   
      },
      {
        id: 4, 
        control:'CustomPhoneNo',
        value:tradingAccount.phone,
         onChange:(e,value) =>{
          if(value){
               setTradingAccount(prevData => ({
                    ...prevData,
                    phone: value
                }));
          } 
          } 
      }, 
      {id: 5, control:'CustomTextField',  label:'Email', varient: 'standard',  value:tradingAccount.email, onChange:(e,value) =>{
          if(value){
               setTradingAccount(prevData => ({
                    ...prevData,
                    email: value
                }));
          } 
          }   },
      {id: 6, control:'CustomTextField',  label:'Leverage', varient: 'standard',value:tradingAccount.leverage,onChange:(e,value) =>{
          if(value){
               setTradingAccount(prevData => ({
                    ...prevData,
                    leverage: value
                }))
          } 
          }   },  },
      {id: 7, control:'CustomTextField',  label:'Balance', varient: 'standard',value:tradingAccount.balance  },
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
              setSelectedCredit(value)
          }
          else{
              setSelectedCredit(null)
          } 
          }   
      },
      {id: 9, control:'CustomTextField',  label:'Equity', varient: 'standard',value:tradingAccount.equity   },
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
              setSelectedMarginLevel(value)
          }
          else{
              setSelectedMarginLevel(null)
          } 
          }   
      },
      {id: 11, control:'CustomTextField',  label:'Profit', varient: 'standard', value:tradingAccount.profit,  },
      {id: 12, control:'CustomTextField',  label:'Swap', varient: 'standard',value:tradingAccount.swap  },
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
              setSelectedCurrency(value)
          }
          else{
              setSelectedCurrency(null)
          } 
          }   
      },
      {id: 14, control:'CustomTextField',  label:'Last Access Time', varient: 'standard'  },
      {
        id: 15, 
        control:'CustomAutocomplete',
        name:'BrandId',   
        label:'BrandId', 
        varient: 'standard',
        options:TradingAutocompleteDummyData,
        value:tradingAccount.brand_id,
        getOptionLabel:(option) => option.label ? option.value : "",
        onChange:(e,value) =>{
          if(value){
              setSelectedCurrency(value)
          }
          else{
              setSelectedCurrency(null)
          } 
          }   
      },
    
  ]

   const ComponentMap = {
    CustomTextField: CustomTextField,
    CustomAutocomplete: CustomAutocomplete,
    CustomPhoneNo: CustomPhoneNo,
  };

  const handleInputChange = (fieldName, value) => {
    setErrors(prevErrors => ({ ...prevErrors, [fieldName]: '' }));
    switch (fieldName) {
      case 'name':
        
        break;
      case 'domain':
       
        break;
      case 'marginCall':
        
        break;
      default:
        break;
    }
  };
  

  const handleSubmit = async () => {
    try {
     setIsLoading(true)
     const res = await Save_Trading_Account(tradingAccount, token)
     const {data: {message, payload, success}} = res
     setIsLoading(false)
        if(success){
          notifySuccess(message)
          setIsModalOpen(false)
          fetchTradingAccounts()
          setTradingAccount(initialValues)
        }else{
          notifyError(message) 
          setIsLoading(false)
        }      
     
    }catch (err) {
      const validationErrors = {};
      err.inner.forEach(error => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
    }
  };


 

  return (
    <Spin spinning={isLoading} size="large">
    <div className='flex flex-col gap-6'>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
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

      <div style={footerStyle}>
        <CustomButton
          Text={'Submit'}
          style={submitStyle}
          onClickHandler={handleSubmit}
        />
      </div>
      <ToastContainer />
        </div>
    </div>
    </Spin>
  );
};

export default TradingModal;
