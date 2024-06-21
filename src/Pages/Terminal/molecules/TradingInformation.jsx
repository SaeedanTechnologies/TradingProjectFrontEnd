import React, { useState } from 'react';
import { Box, Stack, Typography, Tab, Tabs,Grid } from '@mui/material';
import CustomButton from '../../../components/CustomButton';
import Information from './Information';
import TablesTabs from './TablesTabs';
import TradeChart from './TradeChart';
import TradingHours from './TradingHours'

const TradingInformation = () => {
  const [activeTab, setActiveTab] = useState('1');

  const items = [
    {
      key: '1',
      label: 'Trading Chart',
      component: <TradeChart />
    },
    {
      key: '2',
      label: 'Information',
      component: <Information />,
    },
  ];

  const onChange = (event, key) => {
    const selectedItem = items.find(item => item.key === key);
    if (selectedItem) {
      setActiveTab(key);
    }
  };

  const descriptions = [
    { label: 'Balance:', value: '100' },
    { label: 'Credit:', value: '0.01' },
    { label: 'Profit:', value: '0.01' },
    { label: 'Lose:', value: '0.01' },
    { label: 'Equity:', value: '0.01' },
    { label: 'Free Margin:', value: '0.01' },
    { label: 'Leverage:', value: '200' }
  ];

  return (
    <Grid container columnGap={4} rowGap={4}> 
        <Grid item xs={12} >
            <Tabs
          value={activeTab}
          onChange={onChange}
          TabIndicatorProps={{ style: { backgroundColor: '#1CAC70' } }}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '14px',
              mb: -2,
            },
            '& .Mui-selected': {
              color: '#1CAC70 !important', // Ensure that the selected tab retains the custom color
            },
          }}
          aria-label="tabs example"
        >
          {items.map(item => (
            <Tab
              sx={{ fontSize: "14px", textTransform: "none", mb: -2, fontWeight: 'bold' }}
              label={item.label}
              key={item.key}
              value={item.key}
            />
          ))}
        </Tabs>
        </Grid>
        <Grid item xs={7}>
          {items.find(item => item.key === activeTab)?.component}
        </Grid>
        <Grid item xs={4} >
          <Box sx={{   display: "flex", flexDirection: "column", gap: 2 }}>
          {descriptions.map((description, index) => (
            <Stack key={index} direction="row" justifyContent={"space-between"} sx={{ width: '100%' }}>
              <Typography sx={{ fontSize: "12px", color: "#848E9C" }}>{description.label}</Typography>
              <Typography sx={{ fontWeight: 600, fontSize: "12px", color: "#1CAC70" }}>{description.value}</Typography>
            </Stack>
          ))}
          <Stack direction="row" gap={1}>
            <CustomButton
              Text={'BUY 0.652'}
              style={{ height: '48px', display: "flex", flexDirection: "column", borderRadius: '8px', backgroundColor: "#1CAC70", color: "#fff" }}
            />
            <CustomButton
              Text={'SELL 0.6582'}
              style={{ height: '48px', display: "flex", flexDirection: "column", borderRadius: '8px', backgroundColor: "#B22E0C", color: "#fff", border: "none" }}
            />
          </Stack>
          </Box>
        </Grid>
        
      { activeTab === '1' ?
      ( <Grid item xs={12}>
          <TablesTabs/>
        </Grid>):
        (<Grid item xs={12}>
          <TradingHours/>
        </Grid>)
        
        }
      </Grid>

);
};

export default TradingInformation;
