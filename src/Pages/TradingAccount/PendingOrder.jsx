import React,{useState,useEffect} from 'react'
import { Space, theme,Spin } from 'antd';
import { DeleteOutlined} from '@ant-design/icons';
import CustomTable from '../../components/CustomTable';
import { useSelector } from 'react-redux';
import moment from 'moment';
import Swal from 'sweetalert2';
import { Delete_Trade_Order, Get_Trade_Order } from '../../utils/_TradingAPICalls';
import { CustomDeleteDeleteHandler } from '../../utils/helpers';


const PendingOrder = () => {
  

  const token = useSelector(({user})=> user?.user?.token )
  const {token: { colorBG, TableHeaderColor, colorPrimary  },} = theme.useToken();
  const [isLoading,setIsLoading] = useState(false)
  const [pendingOrder,setPendingOrder] = useState([])
  const trading_account_id = useSelector((state)=> state?.trade?.trading_account_id )

  const [CurrentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)

    const fetchPendingOrder = async (page) => {
      setIsLoading(true)
      const params ={trading_account_id,OrderTypes:['pending'],token,page}
      const mData = await Get_Trade_Order(params)
      const {data:{message, payload, success}} = mData
      
      const orders = payload?.data?.map((order)=>({
        id:order.id,
        open_time: moment(order.open_time).format('MM/DD/YYYY HH:mm') ,
        order_no:order.id,
        type:order.type,
        volume:order.volume,
        symbol:order.symbol,
        open_price:order.open_price,
        stopLoss:order.stopLoss,
        takeProfit:order.takeProfit,
        close_time: moment(order.close_time).format('MM/DD/YYYY HH:mm') ,
        close_price:order.close_price,
        reason:order.reason ? order.reason : '...' ,
        swap:order.swap ? order.swap : '...',
        profit:order.profit ? order.profit :'...'


      }))
       setIsLoading(false)
      if(success){
      
      setCurrentPage(payload.current_page)
      setLastPage(payload.last_page)
      setTotalRecords(payload.total)

      setPendingOrder(orders)
    }
    
  }


  const onPageChange = (page) =>{
     fetchPendingOrder(page)  
    }
  const columns = [
    {
      title:<span className="dragHandler">Symbol</span>,
      dataIndex: 'symbol',
      key: '5',
      sorter: (a, b) => a.symbol.length - b.symbol.length,
      sortDirections: ['ascend'],

    },
    {
      title:<span className="dragHandler">Time</span>,
      dataIndex: 'open_time',
      key: '1',
      sorter: (a, b) => a.open_time.length - b.open_time.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">Type</span>,
      dataIndex: 'type',
      key: '3',
      sorter: (a, b) => a.type.length - b.type.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">Volume</span>,
      dataIndex: 'volume',
      key: '4',
      sorter: (a, b) => a.volume.length - b.volume.length,
      sortDirections: ['ascend'],

    },
    {
      title:<span className="dragHandler">SL</span>,
      dataIndex: 'stopLoss',
      key: '7',
      sorter: (a, b) => a.stopLoss.length - b.stopLoss.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">TP</span>,
      dataIndex: 'takeProfit',
      key: '8',
      sorter: (a, b) => a.takeProfit.length - b.takeProfit.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">Open Price</span>,
      dataIndex: 'open_price',
      key: '6',
      sorter: (a, b) => a.open_price.length - b.open_price.length,
      sortDirections: ['ascend'],
    }
  ];
  
  const headerStyle = {
    background: TableHeaderColor, 
    color: 'black', 
  };

 



  useEffect(()=>{

         fetchPendingOrder(CurrentPage)
  
  },[])

  return (
    <Spin spinning={isLoading} size="large">
      <div className='p-8' style={{backgroundColor: colorBG}}>
        <CustomTable
            direction="/single-trading-accounts/details/Pending-order"
            formName = "Pending Orders" 
            columns={columns}
            data={pendingOrder} 
            headerStyle={headerStyle}
            total={totalRecords}
            onPageChange = {onPageChange}
            current_page={CurrentPage}
            token = {token}
          />
      </div>
    </Spin>
  )
}

export default PendingOrder