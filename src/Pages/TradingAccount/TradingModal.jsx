import React, {  useState,useEffect } from 'react';
import { footerStyle, submitStyle } from './style';
import CustomButton from '../../components/CustomButton';
import {  Save_Trading_Account } from '../../utils/_TradingAPICalls';
import { ToastContainer } from 'react-toastify';
import { CurrenciesList } from '../../utils/constants';
import CustomNotification from '../../components/CustomNotification';
import { Spin } from 'antd';
import CustomTextField from '../../components/CustomTextField';
import CustomAutocomplete from '../../components/CustomAutocomplete';
import CustomPhoneNo from '../../components/CustomPhoneNo';
import { useSelector } from 'react-redux';
import { LeverageList } from '../../utils/constants';
import { GetBrandsList } from '../../utils/_BrandListAPI';
import { TradingAccountValidationSchema } from '../../utils/validations';


const TradingModal = ({setIsModalOpen, fetchTradingAccounts, TradingAccountID,page}) => {
  const userRole = useSelector((state)=>state?.user?.user?.user?.roles[0]?.name);
  const userBrand = useSelector((state)=> state?.user?.user?.brand)
  const token = useSelector(({user})=> user?.user?.token )
  const [brandList,setBrandList] = useState([])

  const getBrandsList = async () =>{
    setIsLoading(true)
    const res = await GetBrandsList(token)
    const { data: { success, message, payload } } = res
    setIsLoading(false)
    if (success) {

      setBrandList(payload)

       
    }
  }

   useEffect(()=>{
    if(userRole  === 'admin'){
    getBrandsList()
    }
 
  },[])


  const initialValues= {
    country:"",
    phone:"",
    email:"",
    balance:"",
    leverage:"",
    swap:"",
    currency:"",
    brand_id:"",
    status:"active"
  }

  
  const [tradingAccount,setTradingAccount] = useState(initialValues) 

  const [errors, setErrors] = useState({}); // State to hold validation errors
  const [isLoading, setIsLoading] = useState(false)

 


  const Control = [
    
      {
        id: 14, 
        control:'CustomAutocomplete',
        name:'Brands',   
        label:'Brands', 
        varient: 'standard',
        display: userRole === 'admin' ? 'show' : 'hide',
        options:brandList,
        value:tradingAccount.brand_id,
        getOptionLabel:(option) => option.name ? option.name : "",
        onChange:(e,value) =>{
          if(value){

            setErrors(prevErrors => ({ ...prevErrors, brand_id: "" }))
               setTradingAccount(prevData => ({
                    ...prevData,
                    brand_id: value.public_key
                }))
          } 
          }   
      },
      {
        id: 14, 
        control:'CustomAutocomplete',
        display: 'show' ,
        name:'Leverage',   
        label:'Leverage', 
        varient: 'standard',
        options:LeverageList,
        value: tradingAccount.leverage,
        getOptionLabel:(option) =>  option.title ? option.title : "",
        onChange:(e,value) =>{
          if(value){
            setErrors(prevErrors => ({ ...prevErrors, leverage: "" }))
               setTradingAccount(prevData => ({

                    ...prevData,
                    leverage: value.value
                }))
          } 
          }   
      },
   
      {id: 5, control:'CustomTextField',   display: 'show' , label:'Email', varient: 'standard',  value:tradingAccount.email, onChange:(e) =>{
               setTradingAccount(prevData => ({
                    ...prevData,
                    email: e.target.value
                }));
           
          }   
      },
       {
        id: 12, 
        control:'CustomTextField',
        display: 'show' ,
        name:'Phone',   
        label:'Phone', 
        varient: 'standard',
        value:tradingAccount.phone,
        onChange:(e) =>{
   
               setTradingAccount(prevData => ({
                    ...prevData,
                    phone: e.target.value
                }));
          }   
      },
      {
        id: 3, 
        control:'CustomTextField',
        display: 'show' ,
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
     
      {id: 7, control:'CustomTextField',    display: 'show' , label:'Balance', varient: 'standard',value:tradingAccount.balance,onChange:(e) =>{
               setTradingAccount(prevData => ({
                    ...prevData,
                    balance: e.target.value
                }))
    
     
      }},
      {id: 12, control:'CustomTextField',   display: 'show' ,  label:'Swap', varient: 'standard',value:tradingAccount.swap,onChange:(e) =>{
               setTradingAccount(prevData => ({
                    ...prevData,
                    swap: e.target.value
                }))
          }  },
      {
        id: 13, 
        control:'CustomAutocomplete',
        name:'Currency',   
        display: 'show' ,
        label:'Currency', 
        varient: 'standard',
        options:CurrenciesList,
        value:tradingAccount.currency,
        getOptionLabel:(option) => option.label ? option.label : "",
        onChange:(e,value) =>{
         if(value){
               setTradingAccount(prevData => ({
                    ...prevData,
                    currency: value.value
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


 

  const handleSubmit = async () => {
    try {
     
      //  await TradingAccountValidationSchema.validate({
      //   brand_id,
      //   leverage
      // }, { abortEarly: false });
      // setErrors({});

    const formPayload = {...tradingAccount, brand_id:userRole === 'admin' ? tradingAccount.brand_id :userBrand.public_key}
    
     setIsLoading(true)
     const res = await Save_Trading_Account(formPayload, token)
     const {data: {message, payload, success}} = res
     setIsLoading(false)
        if(success){
          console.log('success message',message)
           
          setTradingAccount(prevData=>({...prevData,... initialValues}))
          CustomNotification({ type: "success", title: "Trading Account", description: message, key: 1 })
          setIsModalOpen(false)

          if(userRole === 'brand' ){
            fetchTradingAccounts(userBrand.public_key,page)
          }
          else{
            fetchTradingAccounts(null,page)
          }
        
        }else{
          CustomNotification({ type: "error", title: "Trading Account", description: message, key: 1 })

          
        }      
     
    }catch (err) {
       CustomNotification({ type: "error", title: "Trading Account", description: err.message, key: 1 })

     
    }
  };


 

  return (
    <Spin spinning={isLoading} size="large">
    <div className='flex flex-col gap-6'>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
       { Control.map(val=>{
            const ComponentToRender = ComponentMap[val.control]
             const shouldDisplay =
            val.display === 'show' &&
            (userRole === 'admin' || (userRole === 'brand' && val.name !== 'brand'));

         return  shouldDisplay && (
              val.control === 'CustomAutocomplete'  ?(
            <div key={val.id}>
              <ComponentToRender
              name={val.name} 
              variant={val.varient} 
              label={val.label}
              options={val.options}
              getOptionLabel={(option) => val.getOptionLabel(option)}
              onChange={(e,value) => val.onChange(e,value)} 
              />
              {errors.marginCall && <span style={{ color: 'red' }}>{errors.marginCall}</span>}
            </div>)

            :
              ( 
              <div key={val.id}>
              <ComponentToRender
              name={val.name} 
              varient={val.varient} 
              label={val.label}
              options={val.options}
              getOptionLabel={(option) => val.getOptionLabel(option)}
              onChange={(e,value) => val.onChange(e,value)} 
              />
              {errors.symbol && <span style={{ color: 'red' }}>{errors.symbol}</span>}
            </div>
              )
            )})
          }
 

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
