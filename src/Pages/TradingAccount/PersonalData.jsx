import { Spin, theme } from 'antd';
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
import moment from 'moment';
import { notifySuccess, notifyError } from '../../utils/constants';




const PersonalData = () => {
  const token = useSelector(({user})=> user?.user?.token );
  const { token: { colorBG,  }} = theme.useToken();
  const [name,setName] = useState('')
  const [registration_time,setRegistration_time ] =  useState(moment().format('YYYY-MM-DD'))
  const [email,setEmail] = useState('')
  const [country, setCountry] = useState('')
  const [phone,setPhone] = useState('')
  const [isLoading,setIsLoading] = useState(false)
  const trading_account_id = useSelector((state)=>state?.trade?.trading_account_id)
  const [errors, setErrors] = useState({});


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
      

      setIsLoading(false)
      if(success){
        setName(payload?.name)
        setEmail(payload?.email)
        setCountry(payload?.country)
        setPhone(payload?.phone)
        const registeredDate = payload?.registration_time.split(" ")[0]
        setRegistration_time(registeredDate)
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
        const paramsString = `name=${name}&email=${email}&country=${country}&phone=${phone}&registration_time=${registration_time}`;
        const res = await  Put_Trading_Account(trading_account_id, paramsString, token)
       const {data: {message, payload, success}} = res
       if(success)
    {
      setIsLoading(false)
       alert(message)
       fetchSingleTradeAccount()
    }   
    else{
      setIsLoading(false)
      alert(err.message);
    }    
    
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