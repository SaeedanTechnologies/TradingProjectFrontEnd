import React from 'react'
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { DatePicker, Space } from 'antd';
import moment from 'moment';
import CustomSelect from './CustomSelect'
import { BarChartConfig } from '../utils/constants'
import CandleStickChart from './CandleStickChart'
import CustomButton from './CustomButton'
import FILTER_CDN from '../../src/assets/images/filter-white.svg'

const AreaChartConfig = {
  chart: {
    type: 'area'
  },
  title: {
    text: ''
  },
  xAxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  yAxis: {
    title: {
      text: ''
    },
    labels: {
      formatter: function () {
        return '$' + this.value;
      }
    }
  },
  series: [{
    name: 'Series Name',
    data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
  }]
};

const options = {
  chart: {
    type: 'candlestick'
  },
  title: {
    text: ''
  },
  yAxis: {
    opposite: false,
    title: {
      text: ''
    },
    labels: {
      formatter: function () {
        return '$' + this.value;
      }
    }
  },
  xAxis: {
    type: 'datetime',
    opposite: false,
    labels: {
      align: 'left',
      step: 1,
      formatter: function () {
        const date = new Date(this.value);
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
      }
    }
  },
  plotOptions: {
    candlestick: {
      color: 'pink',
      lineColor: 'red',
      upColor: '#FF7F7F',
      upLineColor: 'green'
    }
  },
  rangeSelector: {
    inputDateFormat: '',
    buttons: [],
    selected: 0
  },
  series: [{
    type: 'candlestick',
    name: 'USD to EUR',
    data: [
      [1546300800000, 100, 120, 80, 115],
      [1546387200000, 115, 125, 105, 120],
      [1546473600000, 120, 130, 110, 125],
      [1546560000000, 125, 135, 115, 130],
    ],
  }]
};


const { RangePicker } = DatePicker;

const dateFormat = 'YYYY-MM-DD';

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
    <>
      <div className="grid w-full lg:grid-cols-4 gap-4 p-[8px] md:grid-cols-1">
        <div className="lg:col-span-3 md:col-span-2 bg-white border rounded-lg p-4">
          <div className='flex flex-col sm:flex-row items-center justify-between '>
            <h1 className='text-lg font-bold p-2'>Account Growth</h1>

            <div className='flex gap-2 items-center'>
              <div>
                <span className='text-lg font-semibold p-2'>Date Range:</span>
                <Space direction="vertical" size={12} style={{ width: '200px' }}>
                  <RangePicker

                    defaultValue={[moment('2019-09-03', dateFormat), moment('2019-11-22', dateFormat)]}
                    disabled={[false, true]}
                  />
                </Space>
              </div>
              <div>
                <span className='text-lg font-semibold p-2'>Filter Options:</span>
                <CustomSelect width={'150px'} />
              </div>

            </div>

          </div>
          <div className="w-full">
            {/* <CandleStickChart /> */}
            <HighchartsReact
              highcharts={Highcharts}
              constructorType={'stockChart'}
              options={options}
            />

            {/* <HighchartsReact
          highcharts={Highcharts}
          options={BarChartConfig}
          containerProps={{ style: { height: '400px', maxWidth: '100%' } }}
          
        /> */}
          </div>
        </div>
        <div className="w-full flex-grow lg:col-span-1 md:col-span-2 bg-white border rounded-lg p-4">
          <div className="flex flex-col justify-between w-full">
            <h3 className='text-lg font-bold p-2'>Deposit</h3>
            <div className='flex flex-row gap-1'>
              <div>
                <span className='text-lg font-semibold p-2'>Date Range:</span>
                <Space direction="vertical" size={12} style={{ width: '100px' }}>
                  <RangePicker

                    defaultValue={[moment('2019-09-03', dateFormat), moment('2019-11-22', dateFormat)]}
                    disabled={[false, true]}
                  />
                </Space>
              </div>
            </div>
          </div>
          <div className="w-full">
            <HighchartsReact
              highcharts={Highcharts}
              options={AreaChartConfig}
              containerProps={{ style: { height: '400px', maxWidth: '100%' } }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0px' }}>
        <h1 className='text-2xl font-semibold mt-4'>Trading Orders</h1>
        <CustomButton
          Text={'Filters'}
          icon={<img src={FILTER_CDN} alt='icon' />}
          style={{ height: '48px', borderRadius: '8px' }}
          onClickHandler={() => setIsShowFilter(!IsShowFilter)}
        />
      </div>
      <div className="grid w-full lg:grid-cols-4 gap-4 p-[8px] md:grid-cols-1">
        <div className="lg:col-span-2 md:col-span-2 bg-white border rounded-lg p-4">
          <div className='flex flex-col sm:flex-row items-center justify-between '>
            <h1 className='text-lg font-bold p-2'>Trading Order By Numbers</h1>

            <div className='flex gap-2 items-center'>
              <div>
                <span className='text-lg font-semibold p-2'>Date Range:</span>
                <Space direction="vertical" size={12} style={{ width: '100px' }}>
                  <RangePicker

                    defaultValue={[moment('2019-09-03', dateFormat), moment('2019-11-22', dateFormat)]}
                    disabled={[false, true]}
                  />
                </Space>
              </div>
            </div>

          </div>

          <div className="w-full">
            <HighchartsReact
              highcharts={Highcharts}
              options={BarChartConfig}
            // containerProps={{ style: { height: '400px', maxWidth: '100%' } }}
            />
            {/* <HighchartsReact
          highcharts={Highcharts}
          options={BarChartConfig}
          containerProps={{ style: { height: '400px', maxWidth: '100%' } }}
          
        /> */}
          </div>
        </div>
        <div className="w-full flex-grow lg:col-span-2 md:col-span-2 bg-white border rounded-lg p-4">
          <div className='flex flex-col sm:flex-row items-center justify-between '>
            <h1 className='text-lg font-bold p-2'>Trading Volume By Lots</h1>

            <div className='flex gap-2 items-center'>
              <div>
                <span className='text-lg font-semibold p-2'>Date Range:</span>
                <Space direction="vertical" size={12} style={{ width: '100px' }}>
                  <RangePicker

                    defaultValue={[moment('2019-09-03', dateFormat), moment('2019-11-22', dateFormat)]}
                    disabled={[false, true]}
                  />
                </Space>
              </div>
            </div>

          </div>
          <div className="w-full">
            <HighchartsReact
              highcharts={Highcharts}
              options={BarChartConfig}
            // containerProps={{ style: { height: '400px', maxWidth: '100%' } }}
            />
          </div>

        </div>
        {/* <div>
        <div className='grid'>
          <div>
            <h1 className='text-2xl font-semibold mt-4'>Reports</h1>
          </div>
          <div>
            <CustomButton
              Text={'Filters'}
              icon={<img src={FILTER_CDN} alt='icon' />}
              style={{ height: '48px', borderRadius: '8px' }}
              onClickHandler={() => setIsShowFilter(!IsShowFilter)}
            />
          </div>

        </div>
      </div> */}

      </div>
    </>
  )
}

export default CandleChart




