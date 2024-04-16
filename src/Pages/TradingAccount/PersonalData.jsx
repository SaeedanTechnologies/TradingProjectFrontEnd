import { theme } from 'antd';
import React, { useState,useEffect } from 'react'
import { GetCurrentDate } from '../../utils/constants';
import CustomAvatar from '../../components/CustomAvatar';
import CustomButton from '../../components/CustomButton';
import CustomTextField from '../../components/CustomTextField';
import CustomPhoneNo from '../../components/CustomPhoneNo';
import { AutocompleteDummyData } from '../../utils/constants';
import CustomAutocomplete from '../../components/CustomAutocomplete';
import { PDataSaveBtnStyle } from './style';

const PersonalData = () => {
  const { token: { colorBG,  }} = theme.useToken();
  const [CountryList, setCountryList] = useState(AutocompleteDummyData)
  const [SelectedCountry, setSelectedCountry] = useState(null)
  const [RegisterdDate, setRegisterdDate] = useState(GetCurrentDate())

  const Controls = [
    {id:1, control: 'CustomTextField', label:'Login ID', varient:'standard' },
    {id:2, control: 'CustomTextField', label:'Name', varient:'standard' },
    {id:3, control: 'CustomTextField', label:'Registerd Date', varient:'standard', value:RegisterdDate, type:'date' },
    {id:4, control: 'CustomTextField', label:'Email', varient:'standard' },
    {id:5, control: 'CustomPhoneNo' },
    {
      id:6, 
      control: 'CustomAutocomplete',
      name:'Country',  
      label:'Country', 
      varient:'standard', 
      options:CountryList,
      getOptionLabel:(option) => option.title ? option.title : "", 
      onChange: (e,value) =>{
        if(value){
            setSelectedCountry(value)
        }
        else{
            setSelectedCountry(null)
        } 
      }
     },
  ]
  
  const ComponentMap = {
    CustomTextField: CustomTextField,
    CustomAutocomplete: CustomAutocomplete,
    CustomPhoneNo: CustomPhoneNo,
  };

    useEffect(()=>{
    console.log('in personal data by default')
  },[])

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
      {
        Controls.map(val=>{
          const ComponentToRender = ComponentMap[val.control]
          return (
            <ComponentToRender
            name={val.name} 
            varient={val.varient} 
            label={val.label}
            options={val.options}
            value={val.value}
            getOptionLabel={(option) => val.getOptionLabel(option)}
            onChange={(e,value) =>val.onChange(e, value)} 
            />
          )
        })
      }
          
    </div>
    <div className='flex justify-end'>
    <CustomButton
              Text={'Save Changes'}
              style={PDataSaveBtnStyle}
            />
    </div>
   
  </div>
  

  )
}

export default PersonalData