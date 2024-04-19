import React,{useState,useEffect} from 'react'
import { Space, theme,Spin } from 'antd';
import { DeleteOutlined} from '@ant-design/icons';
import CustomTable from '../../components/CustomTable';
import { useSelector } from 'react-redux';
import moment from 'moment';
import Swal from 'sweetalert2';
import { Delete_Trade_Order, Get_Trade_Order } from '../../utils/_TradingAPICalls';



const CloseOrder = () => {
  const token = useSelector(({user})=> user?.user?.token )
  const {token: { colorBG, TableHeaderColor, colorPrimary  },} = theme.useToken();
  const [isLoading,setIsLoading] = useState(false)
    const [closeOrders,setCloseOrders] = useState([])
    const trading_account_id = useSelector((state)=> state?.trade?.trading_account_id )
  const columns = [
    {
      title: 'Open Time',
      dataIndex: 'open_time',
      key: '1',
    },
    {
      title: 'Order No',
      dataIndex: 'order_no',
      key: '2',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: '3',
    },
    {
      title: 'Volume',
      dataIndex: 'volume',
      key: '4',
    },
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: '5',
    },
    {
      title: 'Open Price',
      dataIndex: 'open_price',
      key: '6',
    },
    {
      title: 'SL',
      dataIndex: 'stopLoss',
      key: '7',
    },
    {
      title: 'TP',
      dataIndex: 'takeProfit',
      key: '8',
    },
    {
      title: 'Close Time',
      dataIndex: 'close_time',
      key: '9',
    },
    {
      title: 'Close Price',
      dataIndex: 'close_price',
      key: '10',
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: '11',
    },
    {
      title: 'Swap',
      dataIndex: 'swap',
      key: '12',
    },
    {
      title: 'Profit',
      dataIndex: 'profit',
      key: '13',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: '14',
      render: (_, record) => (
        <Space size="middle" className='cursor-pointer'>
         <DeleteOutlined style={{fontSize:"24px", color: colorPrimary }} onClick={()=>DeleteHandler(record.id)} />
        </Space>
      ),
    },
  ];
  
  
  
  const headerStyle = {
    background: TableHeaderColor, 
    color: 'black', 
  };

 


    const fetchCloseOrder = async () => {

      setIsLoading(true)
      const params ={trading_account_id,OrderTypes:['close'],token}
      const mData = await Get_Trade_Order(params)
      const {data:{message, payload, success}} = mData
      
      const orders = payload?.data?.map((order)=>({
        id:order.id,
        open_time:moment(order.open_time).format('L'),
        order_no:order.id,
        type:order.type,
        volume:order.volume,
        symbol:order.symbol,
        open_price:order.open_price,
        stopLoss:order.stopLoss,
        takeProfit:order.takeProfit,
        close_time: order.close_time? moment(order.close_time).format('L'):'...',
        close_price:order.close_price ? order.close_price :'...',
        reason:order.reason ? order.reason : '...' ,
        swap:order.swap ? order.swap : '...',
        profit:order.profit ? order.profit :'...'


      }))
       setIsLoading(false)
      if(success){
      
      setCloseOrders(orders)
    }
    
  }


  const DeleteHandler = async (id)=>{
  setIsLoading(true)
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#1CAC70",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then(async(result) => {
    if (result.isConfirmed) {
      const res = await Delete_Trade_Order(id, token)
      const {data:{success, message, payload}} = res
      setIsLoading(false)
      if(success){
        Swal.fire({
          title: "Deleted!",
          text: message,
          icon: "success"
        });
        fetchCloseOrder()
      }else{
        Swal.fire({
          title: "Opps!",
          text: {message},
          icon: "error"
        });
      }
     
    }
  });
 
  setIsLoading(false)
 
}

  useEffect(()=>{
    fetchCloseOrder()
  },[])

  return (
    <Spin spinning={isLoading} size="large">
      <div className='p-8' style={{backgroundColor: colorBG}}>
        <CustomTable
          columns={columns} 
          data={closeOrders} 
          headerStyle={headerStyle} 
        />
      </div>
    </Spin>
  )
}

export default CloseOrder