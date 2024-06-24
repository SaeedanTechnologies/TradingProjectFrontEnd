import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography, Tab, Tabs,Grid } from '@mui/material';
import CustomButton from '../../../components/CustomButton';
import Information from './Information';
import TablesTabs from './TablesTabs';
import TradeChart from './TradeChart';
import TradingHours from './TradingHours'
import { useSelector } from 'react-redux';
import BinanceBidAsk from '../../../websockets/BinanceBidAsk';
import { ALL_Symbol_Group_List } from '../../../utils/_SymbolSettingAPICalls';
import axios from 'axios';
import BuySellModal from './BuySellModal';
import CustomModal from '../../../components/CustomModal';


const TradingInformation = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [connected, setConnected] = useState(true);
  const [pricing, setPricing] = useState({ openPrice: '', askPrice: '' });
  const selectedWatchMarket= useSelector(({terminal})=>terminal?.selectedWatchMarket)
  const [open_price,setOpen_price] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

  const token = useSelector(({ terminal }) => terminal?.user?.token)


  const trading_account = useSelector(({terminal})=>terminal?.user?.trading_account)

   const fetchBinanceData = async (symbol, pip) => {
    try {
      const endPoint= `https://api.binance.com/api/v3/ticker/bookTicker?symbol=${symbol}`
        const response = await axios.get(endPoint);
        const data = response?.data;
       
        setPricing({
          openPrice: parseFloat(data?.bidPrice).toFixed(pip),
          askPrice: parseFloat(data?.askPrice).toFixed(pip)
        })
        console.log(parseFloat(data?.askPrice).toFixed(pip), "INSIDE SOCKET HELO")
        setOpen_price(parseFloat(data?.askPrice).toFixed(pip))
        return data;
      
     
    } catch (error) {
      console.error(error);
    }
  };
  const fetchFcsapiData = async (symbol, key, pip) => {
    try {
      const endPoint1= `https://fcsapi.com/api-v3/${key}/latest?id=${symbol?.toLowerCase()}&access_key=lg8vMu3Zi5mq8YOMQiXYgV`

        const response = await axios.get(endPoint1);
        const data = response?.data;

        setPricing({
          // ...pricing,
          openPrice: parseFloat(data?.response[0]?.o).toFixed(pip),
          askPrice: parseFloat(data?.response[0]?.c).toFixed(pip)
        })
        setOpen_price(parseFloat(data?.response[0]?.c).toFixed(pip))
     
    } catch (error) {
      // setError('Error fetching data');
      console.error(error);
    }
  };

  const fetchData = (symbol, connected, pip) => {
      const onError = (error) => {
        console.error('WebSocket error:', error);
      };
  
      const onClose = () => {
        console.log('Previous WebSocket connection closed');
      };

      const binanceStream = BinanceBidAsk(symbol, connected);
  
      if (binanceStream) {
        const onDataReceived = (data) => {
          if(!data?.bidPrice){
            if(symbol?.feed_name === 'binance'){
              fetchBinanceData(symbol?.feed_fetch_name, pip)
            }
            else{

              fetchFcsapiData(symbol?.feed_fetch_name, symbol?.feed_fetch_key, pip)
            }
          }
          else {
          if(symbol?.feed_name === 'binance'){
            setPricing({
            // ...pricing,
            openPrice: parseFloat(data?.bidPrice).toFixed(pip),
            askPrice: parseFloat(data?.askPrice).toFixed(pip)
          })
          }
          else {
            console.log('Fcsapi Data here')
          }
          }
        };
  
        binanceStream.start(onDataReceived, onError, onClose);
        // Optionally, stop the WebSocket connection when it's no longer needed  
        // binanceStream.stop();
      };
    
  }

  useEffect(()=>{
  
    fetchData(selectedWatchMarket, connected, selectedWatchMarket?.pip)
  
  },[selectedWatchMarket])


   const handleOk = () => {
    setIsModalOpen(false);
  };


  const handleCancel = () => {
    setIsModalOpen(false);
  };


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
    { label: 'Balance:', value: trading_account?.balance },
    { label: 'Credit:', value: trading_account?.credit },
    { label: 'Profit:', value: trading_account?.profit },
    { label: 'Equity:', value: trading_account?.equity },
    { label: 'Free Margin:', value: trading_account?.free_margin },
    { label: 'Leverage:', value: trading_account?.leverage }
  ];

  return (
    <>
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
              Text={`Sell ${pricing.askPrice ? `(${pricing.askPrice})` : ''}`}
              style={{ height: '48px', display: "flex", flexDirection: "column", borderRadius: '8px', backgroundColor: "#B22E0C", color: "#fff", border: "none" }}
              onClickHandler={() => setIsModalOpen(true)}
           />

            <CustomButton
              Text={`Buy ${pricing.openPrice ? `(${pricing.openPrice})` : ''}`}
              style={{ height: '48px', display: "flex", flexDirection: "column", borderRadius: '8px', backgroundColor: "#1CAC70", color: "#fff" }}
              onClickHandler={() => setIsModalOpen(true)}
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
     <CustomModal
          isModalOpen={isModalOpen}
          handleOk={handleOk}
          handleCancel={handleCancel}
          title={''}
          width={800}
          footer={null}
        >
          <BuySellModal 
          setIsModalOpen={setIsModalOpen}
          pricing={pricing}
          setPricing={setPricing}
          fetchData={fetchData}
          trade_type="single"
        />
        </CustomModal>
    
    </>
);
};

export default TradingInformation;
