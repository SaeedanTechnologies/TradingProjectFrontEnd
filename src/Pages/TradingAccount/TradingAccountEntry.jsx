import React, { useState } from 'react'
import { theme } from 'antd';
import CustomTextField from '../../components/CustomTextField';
import CustomAutocomplete from '../../components/CustomAutocomplete';
import CustomPhoneNo from '../../components/CustomPhoneNo';
import { AutocompleteDummyData } from '../../utils/constants';
import CustomButton from '../../components/CustomButton';
import { Link } from 'react-router-dom';

const TradingAccountEntry = () => {
  const {
    token: { colorBG, TableHeaderColor, Gray2  },
  } = theme.useToken();
  const [GroupList, setGroupList] = useState(AutocompleteDummyData)
  const [SelectedGroup, setSelectedGroup] = useState(null)
  const [CountryList, setCountryList] = useState(AutocompleteDummyData)
  const [SelectedCountry, setSelectedCountry] = useState(null)
  const [CreditList, setCreditList] = useState(AutocompleteDummyData)
  const [SelectedCredit, setSelectedCredit] = useState(null)
  const [MarginLevel, setMarginLevel] = useState(AutocompleteDummyData)
  const [SelectedMarginLevel, setSelectedMarginLevel] = useState(null)
  const [CurencyList, setCurencyList] = useState(AutocompleteDummyData)
  const [SelectedCurrency, setSelectedCurrency] = useState(null)
  const [CreditAccountGroup, setCreditAccountGroup] = useState(AutocompleteDummyData)
  const [SelectedCreditAccountGroup, setSelectedCreditAccountGroup] = useState(null)

  return (
    <div className='p-8' style={{backgroundColor: colorBG}}>
      <div className='flex flex-col sm:flex-row items-center gap-2 justify-between'>
        <h1 className='text-2xl font-semibold'>Trading Account</h1>
      </div>
        <div className='bg-white border rounded-lg mt-6 p-4'>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <CustomTextField label={'Login ID'} varient={'standard'} />
          <CustomTextField label={'Name'} varient={'standard'} />
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
            <CustomTextField label={'Leverage'} varient={'standard'} />
            <CustomTextField label={'Balance'} varient={'standard'} />
            <CustomAutocomplete
            name={'Credit'} 
            varient={'standard'} 
            label={'Credit'}
            options={CreditList}
            getOptionLabel={(option) => option.title ? option.title : ""}
            onChange={(e,value) =>{
                if(value){
                    setSelectedCredit(value)
                }
                else{
                    setSelectedCredit(null)
                } 
            }} 
            />
              <CustomTextField label={'Equity'} varient={'standard'} />
              <CustomAutocomplete
                  name={'MarginLevel'} 
                  varient={'standard'} 
                  label={'Margin Level %'}
                  options={MarginLevel}
                  getOptionLabel={(option) => option.title ? option.title : ""}
                  onChange={(e,value) =>{
                      if(value){
                          setSelectedMarginLevel(value)
                      }
                      else{
                          setSelectedMarginLevel(null)
                      } 
                  }} 
            />
            <CustomTextField label={'Profit'} varient={'standard'} />
            <CustomTextField label={'Swap'} varient={'standard'} />
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
              <CustomTextField label={'Registration Time'} varient={'standard'} />
              <CustomTextField label={'Last Access Time'} varient={'standard'} />
              <CustomTextField label={'Last Access IP'} varient={'standard'} />
              <CustomAutocomplete
                  name={'CreditAccountGroup'} 
                  varient={'standard'} 
                  label={'Credit Account Group'}
                  options={CreditAccountGroup}
                  getOptionLabel={(option) => option.title ? option.title : ""}
                  onChange={(e,value) =>{
                      if(value){
                          setSelectedCreditAccountGroup(value)
                      }
                      else{
                        setSelectedCreditAccountGroup(null)
                      } 
                  }} 
              />
        </div>
        <div className='flex items-center justify-end gap-8'>
          <Link to='/trading-accounts'>
              <CustomButton
                Text={'Cancle'}
                style={{
                    width: '180px',
                    height: '48px',
                    padding: '8px, 16px, 8px, 16px',
                    radius: '6px',
                    marginTop: '16px',
                }}
                backgroundColor={Gray2}
                borderColor={Gray2}
              />
            </Link>
              <CustomButton
                Text={'Update'}
                style={{
                    width: '180px',
                    height: '48px',
                    padding: '8px, 16px, 8px, 16px',
                    radius: '6px',
                    marginTop: '16px',
                }}
              />
        </div>
      </div>
    </div>
  )
}

export default TradingAccountEntry