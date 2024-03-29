import React, { useState } from 'react'
import { theme } from 'antd';
import CustomTextField from '../../components/CustomTextField'
import CustomAutocomplete from '../../components/CustomAutocomplete'

import { AutocompleteDummyData } from '../../utils/constants';
import CustomPhoneNo from '../../components/CustomPhoneNo';
import { TextField } from '@mui/material';
import CustomButton from '../../components/CustomButton';
import { useNavigate } from 'react-router-dom';

const TransactionOrderEntry = () => {
  const {
    token: { colorBG, TableHeaderColor, Gray2  },
  } = theme.useToken();
  const navigate = useNavigate()
  const [GroupList, setGroupList] = useState(AutocompleteDummyData)
  const [SelectedGroup, setSelectedGroup] = useState(null)
  const [CountryList, setCountryList] = useState(AutocompleteDummyData)
  const [SelectedCountry, setSelectedCountry] = useState(null)
  const [TypeList, setTypeList] = useState(AutocompleteDummyData)
  const [setSelectedType, setsetSelectedType] = useState(null)
  const [CurencyList, setCurencyList] = useState(AutocompleteDummyData)
  const [SelectedCurrency, setSelectedCurrency] = useState(null)

  const Control = [
    {id: 1, control:'CustomTextField',  label:'Name', varient: 'standard'  },
    {id: 2, control:'CustomTextField',  label:'Login ID', varient: 'standard'  },
    {id: 3, control:'CustomTextField',  label:'Order ID', varient: 'standard'  },
    {
       id: 4, 
       control:'CustomAutocomplete',
       name:'Group',   
       label:'Group', 
       varient: 'standard',
       options:GroupList,
       getOptionLabel:(option) => option.title ? option.title : "",
       onChange:(e,value) =>{
         if(value){
             setSelectedGroup(value)
         }
         else{
             setSelectedGroup(null)
         } 
         }   
     },
     {
       id: 5, 
       control:'CustomAutocomplete',
       name:'Country',   
       label:'Country', 
       varient: 'standard',
       options:CountryList,
       getOptionLabel:(option) => option.title ? option.title : "",
       onChange:(e,value) =>{
         if(value){
             setSelectedCountry(value)
         }
         else{
             setSelectedCountry(null)
         } 
         }   
     },
     {
       id: 6, 
       control:'CustomPhoneNo',
     }, 
     {id: 7, control:'CustomTextField',  label:'Email', varient: 'standard'  },
     {id: 8, control:'CustomTextField',  label:'Time', varient: 'standard'  },
     {
      id: 9, 
      control:'CustomAutocomplete',
      name:'Type',   
      label:'Type', 
      varient: 'standard',
      options:TypeList,
      getOptionLabel:(option) => option.title ? option.title : "",
      onChange:(e,value) =>{
        if(value){
            setSelectedType(value)
        }
        else{
            setSelectedType(null)
        } 
        }   
    },
    {id: 10, control:'CustomTextField',  label:'Method', varient: 'standard'  },
    {id: 11, control:'CustomTextField',  label:'Amount', varient: 'standard'  },
    {
      id: 12, 
      control:'CustomAutocomplete',
      name:'Curency',   
      label:'Curency', 
      varient: 'standard',
      options:CurencyList,
      getOptionLabel:(option) => option.title ? option.title : "",
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
  return (
    <div className='p-8' style={{backgroundColor: colorBG}}>
      <div className='flex flex-col sm:flex-row items-center gap-2 justify-between'>
        <h1 className='text-2xl font-semibold'>Transaction Order</h1>
      </div>
      <div className='bg-white border rounded-lg mt-6 p-4'>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {
            Control.map(val=> {
              const ComponentToRender = ComponentMap[val.control]
              return (
                <ComponentToRender
                name={val.name} 
                varient={val.varient} 
                label={val.label}
                options={val.options}
                getOptionLabel={(option) => val.getOptionLabel(option)}
                onChange={(e,value) => val.onChange(e,value)} 
                />
                )
            })
          }
            
        </div>
        <div class="grid grid-cols-1 gap-8 mt-8">
            <CustomTextField 
              label={"Comments"}
              varient={"outlined"}
              multiline={true}
              rows={4}
              />
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
            Text='Update'
            style={{
              padding: '16px',
              height: '48px',
              width: '200px',
              borderRadius: '8px',
            }}
          />

        </div>
      </div>
    </div>
  )
}

export default TransactionOrderEntry