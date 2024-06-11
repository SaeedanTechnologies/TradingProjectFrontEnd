import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';

const CandleStickChart = ({ symbol, connected, pricing, interval = "1m", setLoading }) => {
  const [ohlcData, setOhlcData] = useState([]);
  const tickInterval = getTickInterval(interval);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://api.binance.com/api/v3/klines', {
          params: {
            symbol: symbol ? symbol : "",
            interval: interval,
            limit: 500,
          }
        });
        const data = response.data;
        setLoading(false);

        const ohlcList = data.map(item => [
          item[0], // Timestamp
          parseFloat(item[1]), // Open
          parseFloat(item[2]), // High
          parseFloat(item[3]), // Low
          parseFloat(item[4]), // Close
        ]);
        setOhlcData(ohlcList);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    };

    fetchData();
  }, [symbol, interval]);

  const options = {
    title: {
      text: 'Candlestick Chart'
    },
    series: [
      {
        type: 'candlestick',
        name: symbol,
        data: ohlcData,
      }
    ],
    xAxis: {
      type: 'datetime',
      tickInterval: tickInterval
    },
    yAxis: {
      title: {
        text: 'Price'
      }
    },
    rangeSelector: {
      enabled: false // Disable the date range selector
    },
    navigator: {
      enabled: false
    },
  };

  return <HighchartsReact highcharts={Highcharts} constructorType={'stockChart'} options={options} />;
};

const getTickInterval = (interval) => {
  switch (interval) {
    case "1m":
      return 60 * 1000; 
    case "5m":
      return 5 * 60 * 1000;
    case "30m":
      return 30 * 60 * 1000;
    case "60m":
      return 60 * 60 * 1000;
    default:
      return undefined;
  }
};

export default CandleStickChart;
