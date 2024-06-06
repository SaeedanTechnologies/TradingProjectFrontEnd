import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';

const CandleStickChart = ({ symbol, connected, pricing }) => {
  const [askPrice, setAskPrice] = useState([]);
  const [bidPrice, setBidPrice] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.binance.com/api/v3/klines', {
          params: {
            symbol: symbol ? symbol : "",
            interval: '1d',
            limit: 500,
          }
        });
        const data = response.data;
        const askList = data.map(item => parseFloat(item[1])); // Extract ask price
        const bidList = data.map(item => parseFloat(item[4])); // Extract bid price
        setAskPrice(askList);
        setBidPrice(bidList);
      } catch (err) {
        console.log(err);
      }
    };
    
    fetchData();
  }, [symbol]);
  useEffect(() => {
    setAskPrice(prevAskPrice => [...prevAskPrice, pricing.askPrice]);
    setBidPrice(prevBidPrice => [...prevBidPrice, pricing.bidPrice]);
  }, [pricing.askPrice, pricing.bidPrice]);
  const options = {
    title: {
      text: 'Ask Price vs Bid Price'
    },
    series: [
      {
        name: 'Ask Price',
        data: askPrice,
        type: 'line',
        color: '#FF7F7F'
      },
      {
        name: 'Bid Price',
        data: bidPrice,
        type: 'line',
        color: '#90EE90'
      }
    ],
    xAxis: {
      type: 'datetime',
    },
    yAxis: {
      title: {
        text: 'Price'
      }
    }
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default CandleStickChart;
