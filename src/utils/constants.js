import BITCOIN_CDN from '../assets/images/Bitcoin.svg'
import RIPPLE_CDN from '../assets/images/ripple.svg'
import ETHIRUM_CDN from '../assets/images/ethrieum.svg'
import BITCOINGRAPH_CDN from '../assets/images/bitcoin-graph.svg'
import RIPPLEGRAPH_CDN from '../assets/images/ripple_graph.svg'
import ETHIRUMGRAPH_CDN from '../assets/images/ethrium_graph.svg'

export const DashboardCardData = [
{ 
  id:1, 
  title:"Bitcoin", 
  subtitle:"BTS/UDS", 
  value:"2210", 
  subvalue:"+0.12 %", 
  img_url:BITCOIN_CDN,
  graph_url: BITCOINGRAPH_CDN,
  subvalue_color: "#1CAC70"
}, 
{
  id:2, 
  title:"Ripple", 
  subtitle:"XRP/UDS", 
  value:"2210", 
  subvalue:"+0.12 %", 
  img_url:RIPPLE_CDN,
  graph_url: RIPPLEGRAPH_CDN,
  subvalue_color: "#8C0032"
},
{
  id:3, 
  title:"Etherium", 
  subtitle:"ETS/UDS", 
  value:"2210", 
  subvalue:"+0.12 %", 
  img_url:ETHIRUM_CDN,
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

export const BarChartConfig =  {
  chart: {
      type: 'column'
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