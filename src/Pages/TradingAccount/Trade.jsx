import { theme } from 'antd';
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

const Trade = () => {
  const {
    token: { colorBG, TableHeaderColor, colorPrimary, colorTransparentPrimary },
  } = theme.useToken();
  const navigate = useNavigate();
  const [SymbolList, setSymbolList] = useState(SymbolAutocompleteDummyData);
  const [SelectedSymbol, setSelectedSymbol] = useState(null);
  const [order_type, setOrder_type] = useState({});
  const [type,setType] = useState('');
  const [volume,setVolume] = useState('');
  const [comment,setComment] = useState('');
  const [errors, setErrors] = useState({});

 
  //  useEffect(()=>{
  //   console.log('in trade by default')
  // },[])

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
      default:
        break;
    }
  };


  return (
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
      varient={'outlined'}
      sx={{width: '300px'}}
      />
     </div>
    <div className='flex'>
      <div className="flex-1 mr-2 ">
        <div className="mb-4 grid grid-cols-1 gap-4">
          <CustomAutocomplete
            name={'Symbol'}
            varient={'standard'}
            label={'Symbol'}
            options={SymbolList}
            getOptionLabel={(option) => option.label ? option.label : ""}
            onChange={(e, value) => {
              if (value) {
                setSelectedSymbol(value.value)
              }
              else {
                setSelectedSymbol(null)
              }
            }}
          />
          <CustomAutocomplete
            name={'Type'}
            varient={'standard'}
            label={'Type'}
            options={TradeOrderTypes}
            getOptionLabel={(option) => option.label ? option.label : ""}
            onChange={(e, value) => {
              console.log('order type value',value)
              if (value) {
                setOrder_type(value.value)
              }
              
            }}
          />
        </div>
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomAutocomplete
            name={'Type'}
            varient={'standard'}
            label={'Type'}
            options={order_type === 'pending' ? PendingOrderTypes :  MarketOrderTypes}
            getOptionLabel={(option) => option.label ? option.label : ""}
            onChange={(e, value) => {
              if (value) {
                setType(value.value)
              }
            }}
          />
          <CustomTextField label={'Volume'} varient={'standard'} value={volume}  onChange={(e)=>setVolume(e.target.value)} />
        </div>
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <CustomTextField label={'Price'} varient={'standard'} />
            </div>
            <div className="flex gap-2 md:w-1/2 mt-4">
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
          </div>
          <div>
            <CustomTextField label={'Stop Limit Price'} varient={'standard'} />
          </div>
        </div>
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomTextField label={'Stop Loss'} varient={'standard'} />
          <CustomTextField label={'Stop Limit Price'} varient={'standard'} />
        </div>
        <div className="mb-4 grid grid-cols-1 gap-4">
          <CustomTextField label={'Comments'}
           multiline = {true}
          rows={4}/>
        </div>
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomButton
           Text={"Sell at 0.111"} 
           style={{height:"48px", backgroundColor:"#D52B1E", borderColor: "#D52B1E"  }}
           />
          <CustomButton Text={"Buy at 0.111"}
           style={{height:"48px" }}
          />
        </div>
      </div> 
      <div className="flex-1 ml-2 ">
        <div className="mb-4">Chart Section</div>
        {/* Your chart content */}
      </div>
    </div>
    </div>

  )
}

export default Trade