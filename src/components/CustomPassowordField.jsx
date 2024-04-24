import React from 'react'
import { FormControl, IconButton, Input, InputAdornment, InputLabel,Stack } from '@mui/material'
import { EyeInvisibleOutlined, EyeOutlined,EditOutlined  } from '@ant-design/icons';



const CustomPassowordField = ({ label, name, onChange,value,showClickable =false,showModal,readOnly=false }) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <FormControl variant={"standard"}>
      <InputLabel htmlFor="standard-adornment-password">{label}</InputLabel>
      <Input
        id="standard-adornment-password"
        name = {name}
        type={showPassword ? 'text' : 'password'}
        onChange={onChange}
        fullWidth
        value ={value}
        readOnly ={readOnly}
        endAdornment={
          <InputAdornment position="end">
            <Stack direction="row" justifyContent={'center'} alignItems={'center'} gap={0.4}>
            {showClickable && 
            <IconButton onClick={showModal}>
              <EditOutlined />
            </IconButton>
            }

            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
            >
              {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              
            </IconButton>
            </Stack>
          </InputAdornment>
        }
       
      />
    </FormControl>
  )
}

export default CustomPassowordField