import React from 'react'
import { FormControl, IconButton, Input, InputAdornment, InputLabel } from '@mui/material'
import {EyeInvisibleOutlined, EyeOutlined} from '@ant-design/icons';



const CustomPassowordField = () => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <FormControl  variant="standard">
    <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
    <Input
      id="standard-adornment-password"
      type={showPassword ? 'text' : 'password'}
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            onClick={handleClickShowPassword}
            onMouseDown={handleMouseDownPassword}
          >
            {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
          </IconButton>
        </InputAdornment>
      }
      fullWidth
    />
  </FormControl>
  )
}

export default CustomPassowordField