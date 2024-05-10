import React, { useEffect,useState } from 'react';
import { Tabs, theme } from 'antd';
import LiveOrders from './LiveOrders';
import { Decimal } from 'decimal.js';
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
import { CheckBrandPermission, calculateLotSize, calculateMargin, calculateProfitLoss, getOpenPrice, getOpenPriceFromAPI, numberFormat } from "../../utils/helpers";
import { LeverageList } from '../../utils/constants';


const TradingAccountDetails = () => {

  const [liveOrders, setLiveOrders] = useState([])
  const [CurrentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [grandProfit, setGrandProfit] = useState(0)
  const [grandVolumn, setGrandVolumn] = useState(0) 
  const [grandMargin, setGrandMargin] = useState(0)
  const [totalRecords, setTotalRecords] = useState(0)
  const token = useSelector(({user})=> user?.user?.token )
  const userRole = useSelector((state)=>state?.user?.user?.user?.roles[0]?.name)
  const userPermissions = useSelector((state)=>state?.user?.user?.user?.permissions)
   
  const { token: { colorBG, TableHeaderColor, colorPrimary  },} = theme.useToken();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const {tradeId} = useParams();
  const { TabPane } = Tabs;

  const [activeTab, setActiveTab] = useState('1');
   const [tradeOrder,setTradeOrder] = useState([])
   const [isLoading, setIsLoading] = useState(false)
   const trading_account_id = useSelector((state)=> state?.trade?.trading_account_id)
   const {leverage} = useSelector(({tradingAccountGroup})=> tradingAccountGroup.tradingAccountGroupData )
   const {value: accountLeverage} = LeverageList.find(x=> x.title === leverage)

const fetchLiveOrder = async (page) => {

      setIsLoading(true)
      const params ={trading_account_id,OrderTypes:['market','pending'],token,page}
      const mData = await Get_Trade_Order(params)
      const {data:{message, payload, success}} = mData
       setIsLoading(false)
      if(success){
        let totalProfit = 0
        let totalVolumn = 0
        let totalMargin = 0
        const updatedData = await Promise.all(payload.data.map(async (x) => {
          const {askPrice, bidPrice} = await getOpenPriceFromAPI(x.symbol, x.feed_name);
          const pipVal = x?.symbol_setting?.pip ? x?.symbol_setting?.pip : 5;
          const profit = calculateProfitLoss(x.type === "sell"? askPrice : bidPrice, parseFloat(x.open_price), x.type, parseFloat(x.volume), parseInt(pipVal));
          totalProfit+= parseFloat(profit).toFixed(2)
          const res = calculateLotSize(parseFloat(x.volume))
          const margin = calculateMargin(res, accountLeverage)
          totalMargin+= parseFloat(margin)
          totalVolumn+= parseFloat(res)
          return { ...x, profit };
        }));
      setGrandProfit(totalProfit)
      setGrandVolumn(totalVolumn)
      setGrandMargin(totalMargin)
      setTradeOrder( updatedData)
      setCurrentPage(payload.current_page)
      setLastPage(payload.last_page)
      setTotalRecords(payload.total)
    }
    
  }
  

  const items = [
  {
    key: '1',
    label: 'Live Orders',
    children: <LiveOrders fetchLiveOrder={fetchLiveOrder} tradeOrder={tradeOrder} grandProfit={grandProfit} 
    lotSize={grandVolumn}  isLoading={isLoading} setIsLoading={setIsLoading} 
    CurrentPage={CurrentPage} lastPage={lastPage} totalRecords={totalRecords}
    margin = {grandMargin}
    />,
    path: '/single-trading-accounts/details/live-order',
    display:  CheckBrandPermission(userPermissions,userRole,'live_orders_read') ? 'show' : 'hide' 
  },
  {
    key: '2',
    label: 'Trade',
    children: <Trade fetchLiveOrder = {fetchLiveOrder} CurrentPage={CurrentPage}  />,
    path: '/single-trading-accounts/details/symbol',
    display:  CheckBrandPermission(userPermissions,userRole,'live_orders_create') ? 'show' : 'hide' 
  },
  {
    key: '3',
    label: 'Close Order',
    children: <CloseOrder />,
    path: "/single-trading-accounts/details/close-order",
    display:  CheckBrandPermission(userPermissions,userRole,'close_orders_read') ? 'show' : 'hide' 
  },
  {
    key: '4',
    label: 'Personal Data',
    children: <PersonalData />,
    path: "/single-trading-accounts/details/personal-data",
    display:  'show' 
  },
  {
    key: '5',
    label: 'Account and Security',
    children: <Account />,
    path: "/single-trading-accounts/details/account-security",
    display:   'show' 
  },
  {
    key: '6',
    label: 'Transaction Orders',
    children: <TransactionOrder />,
    path: "/single-trading-accounts/details/transaction-order",
    display:  CheckBrandPermission(userPermissions,userRole,'transaction_orders_read') ? 'show' : 'hide' 
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
          (item.display === 'show' ?
         ( <TabPane tab={item.label} key={item.key}>
          {item.children}
        </TabPane>)
          : null)
         
        ))}
      </Tabs>
      </div>
      
    )
}

  
export default TradingAccountDetails;