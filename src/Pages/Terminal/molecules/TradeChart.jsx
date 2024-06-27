import { Box } from '@mui/material'
import React, { useEffect, useRef, memo } from 'react';
import { Stack } from 'react-bootstrap'


const TradeChart = () => {

  const container = useRef();

  useEffect(
    () => {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "width": "700",
          "height": "350",
          "symbol": "NASDAQ:AAPL",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "light",
          "style": "1",
          "locale": "en",
          "withdateranges": true,
          "hide_side_toolbar": false,
          "allow_symbol_change": true,
          "details": true,
          "hotlist": true,
          "calendar": false,
          "support_host": "https://www.tradingview.com"
        }`;
      container.current.appendChild(script);
    },
    []
  );

  return (
    <Stack sx={{ direction:"column" }}>
        <Box sx={{display:"flex",width:'100%'}}>
           <div className="tradingview-widget-container" ref={container}>
            <div className="tradingview-widget-container__widget"></div>
            {/* <div className="tradingview-widget-copyright"><a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span className="blue-text">Track all markets on TradingView</span></a></div> */}
          </div>
        </Box> 
       </Stack>
  )
}


export default memo(TradeChart);
