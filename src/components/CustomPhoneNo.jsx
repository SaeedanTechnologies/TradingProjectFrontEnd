import React from 'react'
import { MuiTelInput } from 'mui-tel-input'

const CustomPhoneNo = () => {
  const [value, setValue] = React.useState('')

  const handleChange = (newValue) => {
    setValue(newValue)
  }
  return <MuiTelInput
    value={value}
    defaultCountry="PK"
    onChange={handleChange}
    variant= 'standard'
    style={{
    marginTop: '15px',
    }}
    />
}
export default CustomPhoneNo