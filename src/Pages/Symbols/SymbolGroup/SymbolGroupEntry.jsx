import { Spin, theme } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';

import ARROW_BACK_CDN from '../../../assets/images/arrow-back.svg';
import CustomTextField from '../../../components/CustomTextField';
import CustomAutocomplete from '../../../components/CustomAutocomplete';
import {LeverageList} from '../../../utils/constants';
import CustomButton from '../../../components/CustomButton';
import {SaveSymbolGroups, SelectSymbolWRTID, UpdateSymbolGroups} from '../../../utils/_SymbolGroupAPI';
import { useSelector } from 'react-redux';


const SymbolGroupEntry = () => {
  const {
    token: { colorBG, TableHeaderColor, Gray2, colorPrimary  },
  } = theme.useToken();
  const token = useSelector(({user})=> user?.user?.token )
  const {id} = useParams()
  const navigate = useNavigate()

  const [symbolGroupName, setSymbolGroupName] = useState('')
  const [SelectedLeverage, setSelectedLeverage] = useState(null)
  const [Swap, setSwap] = useState('')
  const [LotSize, setLotSize] = useState('')
  const [LotStep, setLotStep] = useState('')
  const [VolMin, setVolMin] = useState('')
  const [VolMax, setVolMax] = useState('')
  const [TradingInterval, setTradingInterval] = useState('')
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false)

  const validationSchema = Yup.object().shape({
      symbolGroupName: Yup.string().required('Name is required'),
      Leverage: Yup.object().required('Leverage is required'),
      Swap: Yup.string().required('Swap is required'),
      LotSize: Yup.string().required('Lot Size is required'),
      LotStep: Yup.string().required('Lot Step is required'),
      VolMin: Yup.string().required('Vol Min is required'),
      VolMax: Yup.string().required('Vol Max is required'),
      TradingInterval: Yup.string().required('Trading Interval is required'),
  });
  const handleInputChange = (fieldName, value) => {
    setErrors(prevErrors => ({ ...prevErrors, [fieldName]: '' }));
    switch (fieldName) {
      case 'symbolGroupName':
        setSymbolGroupName(value);
        break;
      case 'Swap':
        setSwap(value);
        break;
      case 'LotSize':
        setLotSize(value);
        break;
      case 'LotStep':
        setLotStep(value);
        break;
      case 'VolMin':
        setVolMin(value);
        break;
      case 'VolMax':
        setVolMax(value);
        break;
      case 'TradingInterval':
        setTradingInterval(value);
        break;
      default:
        break;
    }
  };
  const clearFields = () =>{
    setSymbolGroupName('');
    setSelectedLeverage(null)
    setSwap('');
    setLotSize('');
    setLotStep('');
    setVolMin('');
    setVolMax('');
    setTradingInterval('')
  }
  const handleSubmit = async()=> {
    try{
      await validationSchema.validate({
        symbolGroupName,
        Leverage : SelectedLeverage,
        Swap,
        LotSize,
        LotStep,
        VolMin,
        VolMax,
        TradingInterval
      }, { abortEarly: false });

      setErrors({});
      const SymbolGroupData = {
        name : symbolGroupName,
        leverage: SelectedLeverage.value,
        lot_size: LotSize,
        lot_step: LotStep,
        vol_min: VolMin,
        vol_max: VolMax,
        trading_interval: TradingInterval,
        swap: Swap
      }
      if(parseInt(id) === 0){
       setIsLoading(true)
       const res = await SaveSymbolGroups(SymbolGroupData, token)
       const {data: {message, payload, success}} = res
       setIsLoading(false)
       if(success){
        alert(message)
        clearFields()
        navigate('/symbol-groups')
      }else{
        alert(message) 
      }
       
      }else{ //update case 
        setIsLoading(true)
        const res = await UpdateSymbolGroups(id,SymbolGroupData, token)
        const {data: {message, payload, success}} = res
        setIsLoading(false)
        if(success){
          alert(message)
          clearFields()
          navigate('/symbol-groups')
        }else{
          alert(message) 
        }
      }
    
    }catch(err){
      const validationErrors = {};
      err.inner.forEach(error => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
    }
  }
  useEffect(()=>{
      if(parseInt(id) !== 0){ // update case
        fetchSymbolGroupWRTID()
      }
  },[id])
  const fetchSymbolGroupWRTID = async()=>{
    if(id !== 0){
      setIsLoading(true)
      const res = await SelectSymbolWRTID(id, token)
      const {data: {message, payload, success}} = res
      setIsLoading(false)
      if(success){
        const selectedOption = LeverageList.find(x=> x.title === payload.leverage)
        setSelectedLeverage(selectedOption)
        setSymbolGroupName(payload.name)
        setLotSize(payload.lot_size);
        setLotStep(payload.lot_step);
        setVolMin(payload.vol_min);
        setVolMax(payload.vol_max);
        setTradingInterval(payload.trading_interval);
         setSwap(payload.swap);
      }

    }
   
  }
  return (
    <Spin spinning={isLoading} size="large">
    <div className='p-8' style={{ backgroundColor: colorBG }}>
     <div className='flex gap-3 items-center'>
     <img 
        src={ARROW_BACK_CDN} 
        alt='back icon' 
        className='cursor-pointer'
        onClick={()=> navigate(-1)}
        />
      <h1 className='text-2xl font-semibold'>{parseInt(id) === 0 ? 'Add Symbol Group' : 'Edit Symbol Group'}</h1>
    </div>
    <div className='border rounded-lg p-4'>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
        <div>
    
         <CustomTextField
          name='symbolGroupName'
          varient='standard'
          label='Name'
          type={'text'}
          value={symbolGroupName}
          onChange={e => handleInputChange('symbolGroupName', e.target.value)}
        />
         {errors.symbolGroupName && <span style={{ color: 'red' }}>{errors.symbolGroupName}</span>}
         </div>
        <div>
        <CustomAutocomplete
            name='Leverage'
            variant='standard'
            label='Select Leverage'
            options={LeverageList}
            getOptionLabel={(option) => option.title ? option.title : ""}
            value={ SelectedLeverage} 
            onChange={(e, value) => {
              if (value) {
                setSelectedLeverage(value);
                setErrors(prevErrors => ({ ...prevErrors, Leverage: '' }));
              } else {
                setSelectedLeverage(null);
                setErrors(prevErrors => ({ ...prevErrors, Leverage: 'Leverage is Requried' }));
              }
            }}
          />
         {errors.Leverage && <span style={{ color: 'red' }}>{errors.Leverage}</span>}
         </div>
         <div>
         <CustomTextField
          name='Swap'
          type={'number'}
          varient='standard'
          label='Swap'
          value={Swap}
          onChange={e => handleInputChange('Swap', e.target.value)}
        />
        {errors.Swap && <span style={{ color: 'red' }}>{errors.Swap}</span>}
         </div>
         <div>
         <CustomTextField
          name='LotSize'
          type={'number'}
          varient='standard'
          label='Lot Size'
          value={LotSize}
          onChange={e => handleInputChange('LotSize', e.target.value)}
        />
          {errors.LotSize && <span style={{ color: 'red' }}>{errors.LotSize}</span>}
         </div>
       <div>
       <CustomTextField
          name='LotStep'
          type={'number'}
          varient='standard'
          label='Lot Step'
          value={LotStep}
          onChange={e => handleInputChange('LotStep', e.target.value)}
        />
        {errors.LotStep && <span style={{ color: 'red' }}>{errors.LotStep}</span>}
       </div>
       <div>
       <CustomTextField
          name='VolMin'
          type={'number'}
          varient='standard'
          label='Vol Min'
          value={VolMin}
          onChange={e => handleInputChange('VolMin', e.target.value)}
        />
        {errors.VolMin && <span style={{ color: 'red' }}>{errors.VolMin}</span>}
       </div>
        <div>
        <CustomTextField
          name='VolMax'
          type={'number'}
          varient='standard'
          label='Vol Max'
          value={VolMax}
          onChange={e => handleInputChange('VolMax', e.target.value)}
        />
        {errors.VolMax && <span style={{ color: 'red' }}>{errors.VolMax}</span>}
        </div>
        <div>
        <CustomTextField
          name='TradingInterval'
          type={'number'}
          varient='standard'
          label='Trading Interval'
          value={TradingInterval}
          onChange={e => handleInputChange('TradingInterval', e.target.value)}
        />
         {errors.TradingInterval && <span style={{ color: 'red' }}>{errors.TradingInterval}</span>}
        </div>
       
      </div>
      <div className='flex justify-center sm:justify-end flex-wrap items-center gap-4 mt-6'>
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
            onClickHandler={()=> navigate(-1)}
          />
          <CustomButton
            Text={parseInt(id) === 0 ? 'Submit' : 'Update' }
            style={{
              padding: '16px',
              height: '48px',
              width: '200px',
              borderRadius: '8px',
            }}
            onClickHandler={handleSubmit}
          />

        </div>
    </div>
    </div>
    </Spin>
  )
}

export default SymbolGroupEntry