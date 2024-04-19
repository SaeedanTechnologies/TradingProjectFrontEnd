import React, { useEffect,useState } from 'react';
import { Tabs, theme } from 'antd';
import LiveOrders from './LiveOrders';
import { useNavigate,useLocation,useParams } from 'react-router-dom';


import ARROW_BACK_CDN from '../../assets/images/arrow-back.svg';
import Trade from './Trade';
import CloseOrder from './CloseOrder';
import PersonalData from './PersonalData'; 
import Account from './Account';
import TransactionOrder from './TransactionOrder';
import { Get_Trade_Order } from '../../utils/_TradingAPICalls';
import { useSelector } from 'react-redux';
import moment from 'moment';


const TradingAccountDetails = () => {
   const token = useSelector(({user})=> user?.user?.token )
  const {
    token: { colorBG, TableHeaderColor, colorPrimary  },
  } = theme.useToken();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const {tradeId} = useParams();
const { TabPane } = Tabs;

  const [activeTab, setActiveTab] = useState('1');
   const [tradeOrder,setTradeOrder] = useState([])
   const [isLoading, setIsLoading] = useState(false)
     const trading_account_id = useSelector((state)=> state?.trade?.trading_account_id )


const fetchLiveOrder = async () => {

      setIsLoading(true)
      const params ={trading_account_id,OrderTypes:['market','pending'],token}
      const mData = await Get_Trade_Order(params)
      const {data:{message, payload, success}} = mData
      const liveOrders = payload?.data?.map((order)=>({
        id:order.id,
        symbol: order.symbol,
        time:moment(order.created_at).format('L'),
        type:order.type,
        volume:order.volume,
        stopLoss:order.stopLoss,
        takeProfit:order.takeProfit,
        price:order.price,
        profit:order.profit ? order.profit : '...',
        open_price:order.open_price,
        // close_price:order.close_price ? order.close_price: order.open_price,
        // open_time:order.open_time,
        // close_time:order.close_time ? order.close_time : new Date().toISOString
       
      }))
       setIsLoading(false)
      if(success){
      
      setTradeOrder(liveOrders)
    }
    
  }
  
 

  const items = [
  {
    key: '1',
    label: 'Live Orders',
    children: <LiveOrders fetchLiveOrder={fetchLiveOrder} tradeOrder={tradeOrder} />,
    path: '/single-trading-accounts/details/live-order'
  },
  {
    key: '2',
    label: 'Trade',
    children: <Trade fetchLiveOrder = {fetchLiveOrder} />,
    path: '/single-trading-accounts/details/symbol'
  },
  {
    key: '3',
    label: 'Close Order',
    children: <CloseOrder />,
    path: "/single-trading-accounts/details/close-order"
  },
  {
    key: '4',
    label: 'Personal Data',
    children: <PersonalData />,
    path: "/single-trading-accounts/details/personal-data"
  },
  {
    key: '5',
    label: 'Account and Security',
    children: <Account />,
    path: "/single-trading-accounts/details/account-security"
  },
  {
    key: '6',
    label: 'Transaction Orders',
    children: <TransactionOrder />,
    path: "/single-trading-accounts/details/transaction-order"
  },
];

  useEffect(() => {
    const activeTabItem = items.find(item => item.path === pathname);
    if (activeTabItem) {
      setActiveTab(activeTabItem.key);
    }
  }, [pathname, items]);

const onChange = (key) => {
    // Find the item with the corresponding key
    const selectedItem = items.find(item => item.key === key);
    if (selectedItem && selectedItem.path) {
         navigate(selectedItem.path);
    }
  };

 


  return (
    <div className='p-8' style={{backgroundColor: colorBG}}>
        <div className='flex gap-3'>
          <img 
           src={ARROW_BACK_CDN} 
           alt='back icon' 
           className='cursor-pointer'
           onClick={() => navigate(-1)}
           />
          <h1 className='text-3xl font-bold'>Trading Account</h1>
        </div>
       
        <Tabs
        activeKey={activeTab}
        onChange={onChange}
        tabBarStyle={{ fontSize: "14px", fontWeight: "600", color: "#606B85" }}
      >
        {items.map(item => (
          <TabPane tab={item.label} key={item.key}>
            {item.children}
          </TabPane>
        ))}
      </Tabs>
      </div>
      
    )
}

  
export default TradingAccountDetails;