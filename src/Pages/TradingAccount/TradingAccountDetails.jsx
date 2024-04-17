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



const TradingAccountDetails = () => {
  const {
    token: { colorBG, TableHeaderColor, colorPrimary  },
  } = theme.useToken();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const {tradeId} = useParams();
const { TabPane } = Tabs;

  const [activeTab, setActiveTab] = useState('1');
 

  const items = [
  {
    key: '1',
    label: 'Live Orders',
    children: <LiveOrders />,
    path: '/single-trading-accounts/details/live-order'
  },
  {
    key: '2',
    label: 'Symbol',
    children: <Trade />,
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