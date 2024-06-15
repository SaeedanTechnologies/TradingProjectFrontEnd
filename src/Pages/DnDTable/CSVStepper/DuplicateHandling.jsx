
import { IconButton, Stack,Typography } from '@mui/material'
import React, { useState } from 'react'
import { DuplicateRecords } from '../../../utils/constants'
import CustomAutocomplete from '../../../components/CustomAutocomplete'
import CustomCheckbox from '../../../components/CustomCheckbox'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const DuplicateHandling = () => {

    const [selectDuplicateRecord,setSelectedDuplicateRecord] =  useState(null)

    const [enable,setEnable] = useState(0);
    const [enable_password_change,setEnable_password_change] = useState(0);
    const [enable_investor_trading,setEnable_investor_trading] = useState(0);
    const [change_password_at_next_login,setChange_password_at_next_login] = useState(0)



    const ChkBoxesControl = [
  {
    id:5,
    control:'CustomCheckbox',
    label:'Enable This Account',
    value:enable,
    key:'enable',
    left:true,
    right:false
  },
  {
    id:6,
    control:'CustomCheckbox',
    label:'Enable Password Change',
    value:enable_password_change,
    key:'enable_password_change',
    left:true,
    right:false
  },
  {
    id:7,
    control:'CustomCheckbox',
    label:'Enable Investor Trading',
    value:enable_investor_trading,
    key:'enable_investor_trading',
    left:true,
    right:false

  },
  {
    id:8,
    control:'CustomCheckbox',
    label:'Change Password at Next Login',
    value:change_password_at_next_login,
    key:'change_password_at_next_login',
    left:true,
    right:false
  },
  ]

  // console.log('enable',enable)


  const [chkBoxesControl,setChkBoxesControl] = useState(ChkBoxesControl)

  const handleInputChange = (fieldName, value) => {
    debugger;

    switch (fieldName) {
         
          case 'enable':
          setEnable(value) 
          break;
         
          case 'enable_password_change':
          setEnable_password_change(value)
          break;
        
          case 'enable_investor_trading':
          setEnable_investor_trading(value) 
          break;

          case 'change_password_at_next_login':
          setChange_password_at_next_login(value)
          break;

    }
  };

  const handleForward = () => {
    const updatedControlArray = chkBoxesControl.map(x=>({...x,left: value ? false :true,right:value ? true : false }))
    setChkBoxesControl(updatedControlArray);
  
};

 const handleBack = () => {
    
     const updatedControlArray = chkBoxesControl.map(x=>({...x,right: value ? false :true,left:value ? true : false }))
    setChkBoxesControl(updatedControlArray);
  
};

    
  return (
    
        <Stack sx={{py:3}}>
           <Typography sx={{fontWeight:"500",fontSize:"24px",fontFamily:"poppins", color:"#616365",borderBottom:"2px solid #b2b4b3",pb:0.5}}>Duplicating Record Handling</Typography>

            <Stack direction={'column'} sx={{gap:8,py:4 }} >
                    <CustomAutocomplete
                      name="duplicate_record"
                      label="Select how duplicate records should be handled"
                      variant="standard"
                      options={DuplicateRecords}
                      value={selectDuplicateRecord}
                      getOptionLabel={(option) => option.label ? option.label : ""}
                      onChange={(event, value) => {
                        if(value)
                            {
                              setSelectedDuplicateRecord(value)
                            }
                          else
                            setSelectedDuplicateRecord(null)                                                        
                      }}
                    /> 
                <Stack sx={{gap:4}}>
                    <Typography sx={{fontSize:"18px",fontFamily:"poppins", color:"#616365"}}>Select the matching fields to find duplicate records </Typography>
                    
                    <Stack direction="row" justifyContent={"space-between"} sx={{width:"70%"}}>
                        <div className='bg-white shadow-md w-[300px] py-6 px-4'>
                            {chkBoxesControl?.map(item=> item.left && <CustomCheckbox key={item?.id} label={item?.label} 
                            checked={item?.value} onChange={(event)=> handleInputChange(item?.key, event.target.checked)}
                            /> )}
                        </div>
                        
                        <Stack alignItems={'center'} justifyContent='center'>
                          
                          
                            <IconButton onClick={handleForward}>
                                <ArrowForwardIcon/>
                            </IconButton>

                          <IconButton onClick={handleBack}>
                                <ArrowBackIcon/>
                            </IconButton>

                        </Stack>

                        <div className='bg-white shadow-md w-[300px]  py-6 px-4'>
                            {chkBoxesControl?.map(item=> item.right && <CustomCheckbox key={item?.id} label={item?.label} 
                            checked={item?.value} onChange={(event)=> handleInputChange(item?.key, event.target.checked)}
                            /> )}

                        </div>
                    </Stack>                  
                </Stack> 
            </Stack>
             
        </Stack> 


  )
  
}

export default DuplicateHandling