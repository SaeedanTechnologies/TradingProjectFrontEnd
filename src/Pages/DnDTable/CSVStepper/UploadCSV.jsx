import { Button, FormControlLabel, Radio, RadioGroup, Stack,Typography } from '@mui/material'
import React, { useRef } from 'react'
import Computer_Icon from '../../../assets/images/computer.svg';


const UploadCSV = () => {
    const csvRef =  useRef(null)

  return (
        <Stack sx={{py:3}}>
           <Typography sx={{fontWeight:"500",fontSize:"24px",fontFamily:"poppins", color:"#616365",borderBottom:"2px solid #b2b4b3",pb:0.5}}>Import from CSV File</Typography>

            <Stack sx={{width:"50%"}}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{py:5}}>
                    <Typography sx={{fontSize:"18px",fontFamily:"poppins", color:"#616365"}}>Select CSV File</Typography>
                    <input type="file" hidden />
                    <Button variant="contained" 
                    sx={{
                        backgroundColor:"#1CAC70",
                        "&:hover":{
                        backgroundColor:"#0fb600"
                        }}
                    }>Select from Computer</Button>
                </Stack> 
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{py:5}}>
                    <Typography sx={{fontSize:"18px",fontFamily:"poppins", color:"#616365"}}>Delimiter</Typography>

                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                    >
                        <FormControlLabel value="," control={<Radio />} label="comma" />
                        <FormControlLabel value=";" control={<Radio />} label="semicolon" />
                        <FormControlLabel value="|" control={<Radio />} label="pipe" />
                        <FormControlLabel value="^" control={<Radio />} label="caret" />

                        
                    </RadioGroup>
                </Stack> 

            </Stack>
             


        </Stack> 


  )
}

export default UploadCSV