import { Spin, theme } from 'antd';
import React, { useState,useEffect } from 'react'
import CustomButton from '../../components/CustomButton';
import CustomTextField from '../../components/CustomTextField';
import { numberInputStyle, PDataSaveBtnStyle } from './style';
import { Get_Single_Trading_Account,Put_Trading_Account } from '../../utils/_TradingAPICalls';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { notifySuccess, notifyError } from '../../utils/constants';
import { GetAllBrandsCustomerList } from '../../utils/_BrandListAPI';
import { Autocomplete,TextField } from '@mui/material'
import CustomNotification from '../../components/CustomNotification';

const PersonalData = () => {
  const token = useSelector(({user})=> user?.user?.token );
  const tradingAccountGroupData = useSelector(({tradingAccountGroup})=>tradingAccountGroup?.tradingAccountGroupData)
  const { token: { colorBG,  }} = theme.useToken();
  const [name,setName] = useState('')
  const [registration_time,setRegistration_time ] =  useState(moment().format('YYYY-MM-DD'))
  const [email,setEmail] = useState('')
  const [country, setCountry] = useState('')
  const [phone,setPhone] = useState('')
  const [SelectedCustomerBrand,SetSelectedCustomerBrand] = useState(null)
  const [isLoading,setIsLoading] = useState(false)
  const trading_account_id = useSelector((state)=>state?.trade?.trading_account_id)
  const [errors, setErrors] = useState({});
  const [BrandCustomerList,setBrandCustomerList] = useState([])


   const handleInputChange = (fieldName, value) => {
    setErrors(prevErrors => ({ ...prevErrors, [fieldName]: '' }));
    switch (fieldName) {
      case 'name':
        setName(value);
        break;
      case 'registration_time':
        setRegistration_time(value);
        break;
      case 'email':
        setEmail(value);
        break;
          case 'country':
        setCountry(value);
        break;
        case 'phone':
        setPhone(value);
        break; 
    }
  };
  
 
  
const fetchSingleTradeAccount= async()=>{
      setIsLoading(true)
      const res = await Get_Single_Trading_Account(trading_account_id, token)
      const {data: {message, payload, success}} = res
      
      const { data: {payload:customersList } } = await GetAllBrandsCustomerList(token, tradingAccountGroupData?.brand_public_key)
      setBrandCustomerList(customersList)


      setIsLoading(false)
      if(success){
        setName(payload?.name)
        setEmail(payload?.email)
        setCountry(payload?.country)
        setPhone(payload?.phone)
        const registeredDate = payload?.registration_time.split(" ")[0]
        setRegistration_time(registeredDate)
        const branderCustomer = customersList?.find(x=> x.id === payload?.brand_customer_id) 
        SetSelectedCustomerBrand(branderCustomer)
      }


   
  }

    const clearFields = () =>{
      setName('');
      setEmail('');
      setCountry('')
      setPhone('')
      setRegistration_time('')
    }

  useEffect(()=>{
      
        fetchSingleTradeAccount()
  },[])


  const handleSubmit = async()=> {
    try{
        setIsLoading(true)
        setErrors({});
        const paramsString = `name=${name}&email=${email}&country=${country}&phone=${phone}&registration_time=${registration_time}&brand_customer_id=${SelectedCustomerBrand.id}&currency=${SelectedCustomerBrand.currency}`;
        const res = await  Put_Trading_Account(trading_account_id, paramsString, token)
       const {data: {message, payload, success}} = res
       if(success)
    {
      setIsLoading(false)
       CustomNotification({ type: "success", title: "Trading Account", description: message, key: 1 })
      fetchSingleTradeAccount()
    }   
    else{
      setIsLoading(false)
      CustomNotification({ type: "error", title: "Trading Account", description: message, key: 1 })
     
    }    
    
    }catch(err){
      const validationErrors = {};
      err.inner.forEach(error => {
        validationErrors[error.path] = error.message;
      });
      CustomNotification({ type: "error", title: "Trading Account", description: err.message, key: 1 })
      setErrors(validationErrors);
    }
  }


  return (
    <Spin spinning={isLoading} size="large">
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
          name='Name'
          type={'text'}
          varient='standard'
          label='Name'
          value={name}
          onChange={e => handleInputChange('name', e.target.value)}
        />
        </div>
        <div>
         <CustomTextField
          name='date'
          type={'date'}
          varient='standard'
          label='Registered Date'
          value={registration_time}
          onChange={e => handleInputChange('registration_time', e.target.value)}
        
        />
        </div>
         <div>
         <CustomTextField
          name='email'
          type={'text'}
          varient='standard'
          label='Email'
          value={email}
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
          value={phone}
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
          value={country}
          onChange={e => handleInputChange('country', e.target.value)}
          sx={numberInputStyle}
        />
        </div>

        <div>
           <Autocomplete
                  name="Customers"
                  id="Customers"
                  variant={'standard'}
                  options={BrandCustomerList}
                  getOptionLabel={ (option) => option.name ? option.name : ""}
                  value={SelectedCustomerBrand}
                  onChange={(e, value) => {
                    if (value) {
                     
                      SetSelectedCustomerBrand(value)
                       setName(value?.name);
                        setEmail(value?.email);
                        setCountry(value?.country);
                        setPhone(value?.phone);

                    
                    }
                    else
                      SetSelectedCustomerBrand(null)
                  }}
                  renderInput={(params) =>
                    <TextField {...params} name="Customer" label="Select Customer" variant="standard" />
                  }
                />
        </div>

          
    </div>
    <div className='flex justify-end'>
    <CustomButton
              Text={'Save Changes'}
              style={PDataSaveBtnStyle}
              onClickHandler={handleSubmit}
            />
    </div>
   
   </div>
  </Spin>
  

  )
}

export default PersonalData