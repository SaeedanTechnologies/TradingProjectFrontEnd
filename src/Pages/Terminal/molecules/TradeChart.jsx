import { Box } from '@mui/material'
import React, { useState } from 'react'
import { Stack } from 'react-bootstrap'
import TablesTabs from './TablesTabs'


const TradeChart = () => {
  return (
    <Stack sx={{ direction:"column",gap:4 }}>
        <Box sx={{display:"flex",width:'100%'}}>
        <img src="/src/assets/images/Terminal-Chart.svg" alt="chart" style={{width:'100%',objectFit:"cover"}} />
        </Box> 
       </Stack>
  )
}

export default TradeChart