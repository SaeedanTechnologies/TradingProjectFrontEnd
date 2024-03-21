import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import CustomSelect from './CustomSelect'
import { BarChartConfig } from '../utils/constants'


const CandleChart = () => {
    // const [chartOptions, setChartOptions] = useState({
    //     title: {
    //       text: 'Dynamic data in Highcharts Stock'
    //     },
    //     xAxis: {
    //       overscroll: 500000,
    //       range: 4 * 200000,
    //       gridLineWidth: 1
    //     },
    //     rangeSelector: {
    //       buttons: [{
    //         type: 'minute',
    //         count: 15,
    //         text: '15m'
    //       }, {
    //         type: 'hour',
    //         count: 1,
    //         text: '1h'
    //       }, {
    //         type: 'all',
    //         count: 1,
    //         text: 'All'
    //       }],
    //       selected: 1,
    //       inputEnabled: false
    //     },
    //     navigator: {
    //       series: {
    //         color: '#000000'
    //       }
    //     },
    //     series: [{
    //       type: 'candlestick',
    //       color: '#FF7F7F',
    //       upColor: '#90EE90',
    //       lastPrice: {
    //         enabled: true,
    //         label: {
    //           enabled: true,
    //           backgroundColor: '#FF7F7F'
    //         }
    //       }
    //     }]
    //   });
    //   useEffect(() => {
    //     // Function to generate new data point
    //     const getNewPoint = (i, data) => {
    //       const lastPoint = data[data.length - 1];
    
    //       if (i === 0 || i % 10 === 0) {
    //         return [
    //           lastPoint[0] + 60000,
    //           lastPoint[4],
    //           lastPoint[4],
    //           lastPoint[4],
    //           lastPoint[4]
    //         ];
    //       }
    //       const updatedLastPoint = data[data.length - 1];
    //       const newClose = Highcharts.correctFloat(
    //         lastPoint[4] + Highcharts.correctFloat(Math.random() - 0.5, 2),
    //         4
    //       );
    
    //       return [
    //         updatedLastPoint[0],
    //         data[data.length - 2][4],
    //         newClose >= updatedLastPoint[2] ? newClose : updatedLastPoint[2],
    //         newClose <= updatedLastPoint[3] ? newClose : updatedLastPoint[3],
    //         newClose
    //       ];
    //     };
    
    //     // On load, start the interval that adds points
    //     const interval = setInterval(() => {
    //       setChartOptions((prevOptions) => {
    //         const series = prevOptions.series[0];
    //         const data = series.data || [];
    
    //         let i = 0;
    //         const newPoint = getNewPoint(i, data);
    //         const lastPoint = data[data.length - 1];
    
    //         // Different x-value, we need to add a new point
    //         if (lastPoint[0] !== newPoint[0]) {
    //           return {
    //             ...prevOptions,
    //             series: [{
    //               ...series,
    //               data: [...data, newPoint]
    //             }]
    //           };
    //         } else {
    //           // Existing point, update it
    //           data[data.length - 1] = newPoint;
    
    //           return {
    //             ...prevOptions,
    //             series: [{
    //               ...series,
    //               data: [...data]
    //             }]
    //           };
    //         }
    //       });
    //     }, 100);
    
    //     // Clear interval on component unmount
    //     return () => clearInterval(interval);
    //   }, []);
  return (
    <div className="grid w-full lg:grid-cols-4 gap-4 p-[8px] md:grid-cols-1">
    <div className="lg:col-span-3 md:col-span-2 bg-white border rounded-lg p-4">
      <div className='flex flex-col sm:flex-row items-center justify-between '>
        <h1 className='text-lg font-bold p-2'>Account Growth</h1>
        <div className='flex gap-2 items-center'>
          <span className='text-lg font-semibold p-2'>Filter Options:</span>
          <CustomSelect width={'150px'} />
        </div>
      </div>
      <div className="w-full">
        <HighchartsReact
          highcharts={Highcharts}
          options={BarChartConfig}
          containerProps={{ style: { height: '400px', maxWidth: '100%' } }}
        />
      </div>
    </div>
    <div className="w-full flex-grow lg:col-span-1 md:col-span-2 bg-white border rounded-lg p-4">
      <div className="flex flex-col justify-between w-full">
        <h3 className='text-lg font-bold p-2'>Growth By Month</h3>
        <div className='flex flex-row gap-1'>
          <span className='text-sm font-medium p-2'>Filter Options:</span>
          <CustomSelect width={'120px'} />
        </div>
      </div>
      <div className="w-full">
        <HighchartsReact
          highcharts={Highcharts}
          options={BarChartConfig}
          containerProps={{ style: { height: '400px', maxWidth: '100%' } }}
        />
      </div>
    </div>
  </div>
  
  )
}

export default CandleChart




