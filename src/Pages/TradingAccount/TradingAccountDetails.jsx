import React from 'react';
import { Tabs, theme } from 'antd';
import LiveOrders from './LiveOrders';
import { useNavigate } from 'react-router-dom';

import ARROW_BACK_CDN from '../../assets/images/arrow-back.svg';
import Trade from './Trade';
import CloseOrder from './CloseOrder';
import PersonalData from './PersonalData'; 
import Account from './Account';
import TransactionOrder from './TransactionOrder';

const onChange = (key) => {
  console.log(key);
};
const items = [
  {
    key: '1',
    label: 'Live Orders',
    children: <LiveOrders />,
  },
  {
    key: '2',
    label: 'Trade',
    children: <Trade />,
  },
  {
    key: '3',
    label: 'Close Order',
    children: <CloseOrder />,
  },
  {
    key: '4',
    label: 'Personal Data',
    children: <PersonalData />,
  },
  {
    key: '5',
    label: 'Account and Security',
    children: <Account />,
  },
  {
    key: '6',
    label: 'Transaction Orders',
    children: <TransactionOrder />,
  },
];
const TradingAccountDetails = () => {
  const {
    token: { colorBG, TableHeaderColor, colorPrimary  },
  } = theme.useToken();
  const navigate = useNavigate()
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
          defaultActiveKey="1" 
          items={items} onChange={onChange}
          tabBarStyle={{fontSize:"14px", fontWeight:"600", color: "#606B85"}}
          />
      </div>
      
    )
}

  
export default TradingAccountDetails;