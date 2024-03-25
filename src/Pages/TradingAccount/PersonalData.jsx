import { theme } from 'antd';
import React, { useState } from 'react'
import { GetCurrentDate } from '../../utils/constants';
import CustomAvatar from '../../components/CustomAvatar';
import CustomButton from '../../components/CustomButton';
import CustomTextField from '../../components/CustomTextField';
import CustomPhoneNo from '../../components/CustomPhoneNo';
import { AutocompleteDummyData } from '../../utils/constants';
import CustomAutocomplete from '../../components/CustomAutocomplete';

const PersonalData = () => {
  const {
    token: { colorBG, TableHeaderColor, colorPrimary  },
  } = theme.useToken();
  const [CountryList, setCountryList] = useState(AutocompleteDummyData)
  const [SelectedCountry, setSelectedCountry] = useState(null)
  const [RegisterdDate, setRegisterdDate] = useState(GetCurrentDate())
  return (
    <div className='p-8 border border-gray-300 rounded-lg' style={{ backgroundColor: colorBG }}>
    <div className='flex flex-col gap-3 justify-center items-center'>
      <CustomAvatar />
      <CustomButton 
      Text={'Upload Photo'}
      style={{height:'38px', borderRadius:'8px'}}
      />
    
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-4">
          <CustomTextField  label={'LoginID'} varient={'standard'} />
          <CustomTextField  label={'Name'} varient={'standard'} />
          <CustomTextField  label={'Registerd Date'} value={RegisterdDate} varient={'standard'} type={'date'} />
          <CustomTextField  label={'Email'} varient={'standard'} />
          <CustomPhoneNo />
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
    </div>
    <div className='flex justify-end'>
    <CustomButton
              Text={'Save Changes'}
              style={{
              width: '180px',
              height: '50px',
              marginTop: '50px',
              borderRadius: '8px',
              }}
            />
    </div>
   
  </div>
  

  )
}

export default PersonalData