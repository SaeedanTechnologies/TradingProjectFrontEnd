import React, { useEffect, useState } from 'react';
import CustomTextField from '../../components/CustomTextField';
import { footerStyle, submitStyle } from './style';
import CustomButton from '../../components/CustomButton';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { GetSingleBrand, SaveBrands, UpdateBrand } from '../../utils/_APICalls';
import { notifyError, notifySuccess } from '../../utils/constants';
import { ToastContainer } from 'react-toastify';
import { Spin } from 'antd';

const BrandModal = ({setIsModalOpen, fetchBrands, BrandID}) => {
  const token = useSelector(({user})=> user?.user?.token )
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [disabledDomain, setDisabledDomain] = useState(false);
  const [marginCall, setMarginCall] = useState('');
  const [errors, setErrors] = useState({}); // State to hold validation errors
  const [isLoading, setIsLoading] = useState(false)

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    domain: Yup.string()
      .required('Domain is required')
      .matches(
        /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
        'Invalid domain'
      ),
    marginCall: Yup.number().required('Margin Call is required').positive('Margin Call must be a positive number'),
  });

  const handleInputChange = (fieldName, value) => {
    setErrors(prevErrors => ({ ...prevErrors, [fieldName]: '' }));
    switch (fieldName) {
      case 'name':
        setName(value);
        break;
      case 'domain':
        setDomain(value);
        break;
      case 'marginCall':
        setMarginCall(value);
        break;
      default:
        break;
    }
  };
  const clearFields = ()=>{
    setName('')
    setDomain('')
    setMarginCall('')
  }

  const handleSubmit = async () => {
    try {
      await validationSchema.validate({
        name,
        domain,
        marginCall,
      }, { abortEarly: false });

      setErrors({});
    const BrandData = {
      name:name, 
      domain:domain,
      margin_call:marginCall
    }
    if(BrandID === 0){
      setIsLoading(true)
      const res = await SaveBrands(BrandData, token)
      const {data: {message, payload, success}} = res
      setIsLoading(false)
        if(success){
          notifySuccess(message)
          setIsModalOpen(false)
          fetchBrands()
          clearFields()
        }else{
          notifyError(message) 
        }
    }else{
      setIsLoading(true)
      const res = await UpdateBrand(BrandID, BrandData, token)
      const {data: {message, payload, success}} = res
      setIsLoading(false)
      if(success){
        notifySuccess(message)
        setIsModalOpen(false)
        fetchBrands()
        clearFields()
      }else{
        notifyError(message) 
      }
    }
    
    } catch (err) {
      const validationErrors = {};
      err.inner.forEach(error => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
    }
  };

  useEffect(()=>{
    clearFields()
      if(BrandID !== 0){ // update
        setDisabledDomain(true)
        fetchDataWRTID()
      }else{
        setDisabledDomain(false)
      }
  }, [BrandID])

  const fetchDataWRTID = async()=>{
    setIsLoading(true)
    const res = await GetSingleBrand(BrandID, token)
    const {data:{payload, message, success}} = res
    setIsLoading(false)
    if(success){
      setName(payload.name)
      setDomain(payload.domain)
      setMarginCall(payload.margin_call)
    }else{
      notifyError(message)
    }
  }

  return (
    <Spin spinning={isLoading} size="large">
    <div className='flex flex-col gap-6'>
      <CustomTextField
        label="Name"
        varient="standard"
        type="text"
        value={name}
        onChange={e => handleInputChange('name', e.target.value)}
      />
      {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}

      <CustomTextField
        label="Domain"
        varient="standard"
        type="text"
        disabled={disabledDomain}
        value={domain}
        onChange={e => handleInputChange('domain', e.target.value)}
      />
      {errors.domain && <span style={{ color: 'red' }}>{errors.domain}</span>}

      <CustomTextField
        label="Margin Call"
        varient="standard"
        type="number"
        value={marginCall}
        onChange={e => handleInputChange('marginCall', e.target.value)}
      />
      {errors.marginCall && <span style={{ color: 'red' }}>{errors.marginCall}</span>}

      <div style={footerStyle}>
        <CustomButton
          Text={'Submit'}
          style={submitStyle}
          onClickHandler={handleSubmit}
        />
      </div>
      <ToastContainer />
    </div>
    </Spin>
  );
};

export default BrandModal;
