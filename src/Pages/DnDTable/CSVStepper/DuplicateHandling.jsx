
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
    const [forwardArrowToggle,setForwardArrowToggle] = useState(true)
    const [backArrowToggle,setBackArrowToggle] = useState(false)


 const ChkBoxesControlLeft = [
  {
    id:5,
    control:'CustomCheckbox',
    label:'Enable This Account',
    value:enable,
    key:'enable'
  },
  {
    id:6,
    control:'CustomCheckbox',
    label:'Enable Password Change',
    value:enable_password_change,
    key:'enable_password_change'
  },
  {
    id:7,
    control:'CustomCheckbox',
    label:'Enable Investor Trading',
    value:enable_investor_trading,
    key:'enable_investor_trading'

  },
  {
    id:8,
    control:'CustomCheckbox',
    label:'Change Password at Next Login',
    value:change_password_at_next_login,
    key:'change_password_at_next_login'
  },
    ]

    const [chkBoxesControlLeft,setChkBoxesControlLeft] = useState(ChkBoxesControlLeft)
    const [chkBoxesControlRight,setChkBoxesControlRight] = useState([])


   

  const handleInputChange = (fieldName, value) => {

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
    const checkedLeftItems = chkBoxesControlLeft.filter(item => item.value);
  const updatedLeftArray = chkBoxesControlLeft.filter(item => !item.value);
  const updatedRightArray = [...chkBoxesControlRight, ...checkedLeftItems];

  setChkBoxesControlLeft(updatedLeftArray);
  setChkBoxesControlRight(updatedRightArray);
};

 const handleBack = () => {
    
 const checkedRightItems = chkBoxesControlRight.filter(item => item.value);
  const updatedRightArray = chkBoxesControlRight.filter(item => !item.value);
  const updatedLeftArray = [...chkBoxesControlLeft, ...checkedRightItems];

  setChkBoxesControlLeft(updatedLeftArray);
  setChkBoxesControlRight(updatedRightArray); 

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
                            {chkBoxesControlLeft?.map(item=><CustomCheckbox key={item?.id} label={item?.label} 
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
                            {chkBoxesControlRight?.map(item=>  <CustomCheckbox key={item?.id} label={item?.label} 
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