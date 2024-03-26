import React, { useState } from 'react'
import { theme } from 'antd';
import CustomTextField from '../../components/CustomTextField'
import CustomAutocomplete from '../../components/CustomAutocomplete'

import { AutocompleteDummyData } from '../../utils/constants';
import CustomPhoneNo from '../../components/CustomPhoneNo';

const TransactionOrderEntry = () => {
  const {
    token: { colorBG, TableHeaderColor, Gray2  },
  } = theme.useToken();
  const [GroupList, setGroupList] = useState(AutocompleteDummyData)
  const [SelectedGroup, setSelectedGroup] = useState(null)
  const [CountryList, setCountryList] = useState(AutocompleteDummyData)
  const [SelectedCountry, setSelectedCountry] = useState(null)
  const [TypeList, setTypeList] = useState(AutocompleteDummyData)
  const [setSelectedType, setsetSelectedType] = useState(null)
  const [CurencyList, setCurencyList] = useState(AutocompleteDummyData)
  const [SelectedCurrency, setSelectedCurrency] = useState(null)

  return (
    <div className='p-8' style={{backgroundColor: colorBG}}>
      <div className='flex flex-col sm:flex-row items-center gap-2 justify-between'>
        <h1 className='text-2xl font-semibold'>Transaction Order</h1>
      </div>
      <div className='bg-white border rounded-lg mt-6 p-4'>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <CustomTextField label={'Name'} varient={'standard'} />
        <CustomTextField label={'Login ID'} varient={'standard'} />
        <CustomTextField label={'Order ID'} varient={'standard'} />
        <CustomAutocomplete
            name={'Group'} 
            varient={'standard'} 
            label={'Group'}
            options={GroupList}
            getOptionLabel={(option) => option.title ? option.title : ""}
            onChange={(e,value) =>{
                if(value){
                    setSelectedGroup(value)
                }
                else{
                    setSelectedGroup(null)
                } 
            }} 
            />
             <CustomAutocomplete
            name={'Country'} 
            varient={'standard'} 
            label={'Country'}
            options={CountryList}
            getOptionLabel={(option) => option.title ? option.title : ""}
            onChange={(e,value) =>{
                if(value){
                    setSelectedCountry(value)
                }
                else{
                    setSelectedCountry(null)
                } 
            }} 
            />
           <CustomPhoneNo />
           <CustomTextField label={'Email'} varient={'standard'} />
           <CustomTextField label={'Time'} varient={'standard'} />
           <CustomAutocomplete
                  name={'Type'} 
                  varient={'standard'} 
                  label={'Type'}
                  options={TypeList}
                  getOptionLabel={(option) => option.title ? option.title : ""}
                  onChange={(e,value) =>{
                      if(value){
                          setSelectedType(value)
                      }
                      else{
                        setSelectedType(null)
                      } 
                  }} 
              />
               <CustomTextField label={'Method'} varient={'standard'} />
               <CustomTextField label={'Amount'} varient={'standard'} />
               <CustomAutocomplete
            name={'Currency'} 
            varient={'standard'} 
            label={'Currency'}
            options={CurencyList}
            getOptionLabel={(option) => option.title ? option.title : ""}
            onChange={(e,value) =>{
                if(value){
                    setSelectedCurrency(value)
                }
                else{
                    setSelectedCurrency(null)
                } 
            }} 
            />
        </div>
      </div>
    </div>
  )
}

export default TransactionOrderEntry