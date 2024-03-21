import { TextField } from '@mui/material'
import React from 'react'

const CustomTextField = ({label, varient}) => {
  return (
    <TextField 
      id="standard-basic" 
      label={label}
      variant={varient}
      fullWidth
      
      />
  )
}

export default CustomTextField