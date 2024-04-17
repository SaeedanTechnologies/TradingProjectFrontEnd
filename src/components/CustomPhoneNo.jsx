import React from 'react'
import { MuiTelInput } from 'mui-tel-input'

const CustomPhoneNo = ({value,onChange,...props}) => {
 
  return <MuiTelInput
    value={value}
    defaultCountry="PK"
    onChange={onChange}
    variant= 'standard'
    style={{
    marginTop: '15px',
    }}
    {...props}
    />
}
export default CustomPhoneNo