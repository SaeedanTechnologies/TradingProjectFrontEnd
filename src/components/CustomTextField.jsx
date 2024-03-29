import { TextField } from '@mui/material'
import React from 'react'

const CustomTextField = ({label, varient, multiline, rows, type, value, className, sx}) => {
  return (
    <TextField 
      type={type}
      id="standard-basic" 
      label={label}
      variant={varient}
      multiline= {multiline}
      rows={rows}
      value={value}
      className={className}
      sx={sx}
      fullWidth
      
      />
  )
}

export default CustomTextField