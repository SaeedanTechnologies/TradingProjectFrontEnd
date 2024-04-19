import BITCOIN_CDN from '../assets/images/Bitcoin.svg'
import RIPPLE_CDN from '../assets/images/ripple.svg'
import ETHIRUM_CDN from '../assets/images/ethrieum.svg'
import BITCOINGRAPH_CDN from '../assets/images/bitcoin-graph.svg'
import RIPPLEGRAPH_CDN from '../assets/images/ripple_graph.svg'
import ETHIRUMGRAPH_CDN from '../assets/images/ethrium_graph.svg'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const notifySuccess = (msg) => toast.success(msg);
export const notifyError = (msg) => toast.error(msg);

export const DashboardCardData = [
  {
    id: 1,
    title: "Bitcoin",
    subtitle: "BTS/UDS",
    value: "2210",
    subvalue: "+0.12 %",
    img_url: BITCOIN_CDN,
    graph_url: BITCOINGRAPH_CDN,
    subvalue_color: "#1CAC70"
  },
  {
    id: 2,
    title: "Ripple",
    subtitle: "XRP/UDS",
    value: "2210",
    subvalue: "+0.12 %",
    img_url: RIPPLE_CDN,
    graph_url: RIPPLEGRAPH_CDN,
    subvalue_color: "#8C0032"
  },
  {
    id: 3,
    title: "Etherium",
    subtitle: "ETS/UDS",
    value: "2210",
    subvalue: "+0.12 %",
    img_url: ETHIRUM_CDN,
    graph_url: ETHIRUMGRAPH_CDN,
    subvalue_color: "#04BFDA"
  },


]

export const GrowthChartFilter = [
  {
    value: '1',
    label: 'Today',
  },
  {
    value: '2',
    label: 'Yesterday',
  },
  {
    value: '3',
    label: 'This Week',
  },
  {
    value: '4',
    label: 'Last Week',
  },
  {
    value: '5',
    label: 'Last 7 Days',
  },
  {
    value: '6',
    label: 'This Month',
  },
  {
    value: '7',
    label: 'Last Month',
  },
  {
    value: '8',
    label: 'Last 6 Months',
  },
  {
    value: '9',
    label: 'Custom Time frame',
  },
]

export const BarChartConfig = {
  chart: {
    type: 'column',
  },
  responsive: {
    rules: [{
      condition: {
        maxWidth: 500
      },
      chartOptions: {
        legend: {
          enabled: false
        }
      }
    }]
  },
  title: {
    text: '',
    align: 'left'
  },
  // subtitle: {
  //     text:
  //         'Source: <a target="_blank" ' +
  //         'href="https://www.indexmundi.com/agriculture/?commodity=corn">indexmundi</a>',
  //     align: 'left'
  // },
  xAxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    crosshair: true,
    accessibility: {
      description: 'Countries'
    }
  },
  yAxis: {
    min: 0,
    title: {
      text: '1000 metric tons (MT)'
    }
  },
  tooltip: {
    valueSuffix: ' (1000 MT)'
  },
  plotOptions: {
    column: {
      pointPadding: 0.2,
      borderWidth: 0
    }
  },
  series: [
    {
      name: 'Jan',
      data: [406292, 260000, 107000, 68300, 27500, 14500]
    },
    {
      name: 'Feb',
      data: [51086, 136000, 5500, 141000, 107180, 77000]
    }
  ]
}

export const columns = [
  {
    title: 'Column 1',
    dataIndex: 'address',
    key: '1',
  },
  {
    title: 'Column 2',
    dataIndex: 'address',
    key: '2',
  },
  {
    title: 'Column 3',
    dataIndex: 'address',
    key: '3',
  },
  {
    title: 'Column 4',
    dataIndex: 'address',
    key: '4',
  },
  {
    title: 'Column 5',
    dataIndex: 'address',
    key: '5',
  },
  {
    title: 'Column 6',
    dataIndex: 'address',
    key: '6',
  },
  {
    title: 'Column 7',
    dataIndex: 'address',
    key: '7',
  },
  {
    title: 'Column 8',
    dataIndex: 'address',
    key: '8',
  },
];


export const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 40,
    address: 'London Park',
  },
];

export const AutocompleteDummyData = [
  { title: 'The Shawshank Redemption', id: 1994 },
  { title: 'The Godfather', id: 1972 },
  { title: 'The Godfather: Part II', id: 1974 }
]

export const SymbolAutocompleteDummyData = [
  { label: 'The Godfather', value: 'The Godfather' },
  { label: 'The Godfather: Part II', value: 'The Godfather: Part II' },

]

export const TradingAutocompleteDummyData = [
  { label: 1, value: "1" },
  { label: 2, value: "2" },
  { label: 3, value: "3" }

]

export const BrandIdAutocompleteDummyData = [
  { label: 6, value: "6" },
  { label: 7, value: "7" },
  { label: 8, value: "8" }

]

export const TradeOrderTypes = [

  { label: 'Pending Order', value: "pending" },
  { label: 'Market Order', value: "market" },

]

export const PendingOrderTypes = [
  { label: 'Buy Limit', value: 'Buy Limit' },
  { label: 'Sell Limit', value: 'Sell Limit' },
  { label: 'Buy Stop', value: 'Buy Stop' },
  { label: 'Sell Stop', value: 'Sell Stop' },
  { label: 'Buy Sell Limit', value: 'Buy Sell Limit' },
  { label: 'Sell Stop Limit', value: 'Sell Stop Limit' },
]



export const MarketOrderTypes = [
  { label: 'Buy', value: 'Buy' },
  { label: 'Sell', value: 'Sell' },
]

export const GetCurrentDate = () => {
  var date = new Date();
  return `${date.getFullYear()}-${((date.getMonth()) + 1) <= 9 ? '0' + ((date.getMonth()) + 1).toString() : (date.getMonth()) + 1}-${date.getDate() <= 9 ? '0' + (date.getDate()).toString() : date.getDate()}`
}

export const LeverageList = [
  { value: '100', title: '1:1' },
  { value: '50', title: '2:1' },
  { value: '33', title: '3:1' },
  { value: '25', title: '4:1' },
  { value: '20', title: '5:1' },
  { value: '10', title: '10:1' },
  { value: '5', title: '20:1' },
  { value: '3.33', title: '30:1' },
  { value: '2', title: '50:1' },
  { value: '1', title: '100:1' },
  { value: '0.25', title: '400:1' },
  { value: '0.10', title: '1000:1' },

]