import React from 'react'
import { MuiTelInput } from 'mui-tel-input'

const CustomPhoneNo = ({value,onChange,label,...props}) => {
 
  return <MuiTelInput
    value={value}
    defaultCountry="PK"
    label = {label}
    onChange={onChange}
    variant= 'standard'
    style={{
    marginTop: '15px',
    width:"100%"
    }}
    {...props}
    />
}
export default CustomPhoneNo