import { TextField } from '@mui/material'
import React from 'react'

const CustomTextField = ({ label, required=false, varient, multiline, rows, type, value, className, sx, onChange, disabled, InputProps, shrink=false}) => {
  return (
    <TextField
      type={type}
      id="standard-basic"
      label={label}
      required={required}
      variant={varient}
      multiline={multiline}
      InputProps= {InputProps}
      rows={rows}
      value={value}
      className={className}
      sx={sx}
      disabled={disabled}
      onChange={onChange}
      shrink = {shrink}
      fullWidth
    />
  )
}

export default CustomTextField