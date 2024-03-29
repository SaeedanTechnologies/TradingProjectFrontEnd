import { theme } from 'antd';
import React, { useState } from 'react'
import ARROW_BACK_CDN from '../../assets/images/arrow-back.svg';
import { useNavigate } from 'react-router-dom';
import CustomAutocomplete from '../../components/CustomAutocomplete';
import { AutocompleteDummyData } from '../../utils/constants';
import CustomTextField from '../../components/CustomTextField';
import CustomButton from '../../components/CustomButton';


const MDWEntry = () => {
  const {
    token: { colorBG, TableHeaderColor, colorPrimary  },
  } = theme.useToken();
  const [OperationList, setOperationList] = useState(AutocompleteDummyData)
  const [SelectedOperation, setSElectedOperation] = useState(null)
  const navigate = useNavigate()

  const Controls = [
    { 
      id:1, 
      control: 'CustomAutocomplete',
      name:'Operation',   
      label:'Operation', 
      varient: 'standard',
      options:OperationList,
      getOptionLabel:(option) => option.title ? option.title : "",
      onChange:(e,value) =>{
        if(value){
            setSElectedOperation(value)
        }
        else{
            setSElectedOperation(null)
        } 
      } 
   },
    {
      id:2, 
      control: 'CustomTextField', 
      label:'Amount', 
      varient: 'standard' 
    },
    {
      id:3, 
      control: 'CustomTextField', 
      label:'Comment', 
      varient: 'outlined', 
      multiline: true,
      rows: 4 
    } 
  
  ]
  const ComponentMap = {
    CustomTextField: CustomTextField,
    CustomAutocomplete: CustomAutocomplete,
  };
  return (
    <div className='p-8' style={{backgroundColor: colorBG}}>
     <div className='flex gap-3'>
     <img 
        src={ARROW_BACK_CDN} 
        alt='back icon' 
        className='cursor-pointer'
        onClick={() => navigate(-1)}
        />
       
        <h1 className='text-3xl font-bold'>Mass Deposit/Withdraw</h1>
     </div>
     <div className='border rounded-lg p-8'>
  {Controls.map(val => {
    const ComponentToRender = ComponentMap[val.control];
    return (
      <div className="mt-4" key={val.id}>
        {/* Render dropdown and textbox in the first row */}
        <div className='grid grid-cols-1 sm:grid-cols-2'>
        {val.control === 'CustomAutocomplete' || val.control === 'CustomTextField' && !val.multiline ? (
            <ComponentToRender
              name={val.name && val.name}
              variant={val.varient && val.varient}
              label={val.label && val.label}
              options={val.options && val.options}
              getOptionLabel={(option) => val.getOptionLabel(option)}
              onChange={(e, value) => val.onChange(e, value)}
            />
        ) : null}
          </div>
        {/* Render comment box spanning full width */}
        {val.control === 'CustomTextField' && val.multiline ? (
         
            <ComponentToRender
              name={val.name && val.name}
              variant={val.varient && val.varient}
              label={val.label && val.label}
              multiline={val.multiline && val.multiline}
              rows={val.rows && val.rows}
            />
        ) : null}
      </div>
    );
  })}

<div className='grid grid-cols-1 sm:grid-cols-2 gap-8 mt-4'>
      <CustomButton
        Text={'Withdraw'}
        style={{
        backgroundColor: '#D52B1E',
        borderColor: '#D52B1E',
        height: '48px',
        borderRadius: '8px',
        }}
      />
      <CustomButton
        Text={'Deposit'}
        style={{
          height: '48px',
          borderRadius: '8px',
          }}
      />
     </div>
     </div>
    

    </div>
  )
}

export default MDWEntry