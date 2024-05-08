import { theme } from 'antd';
import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import ARROW_BACK_CDN from '../../assets/images/arrow-back.svg';
import CustomButton from '../../components/CustomButton';
import { PlusCircleOutlined } from '@ant-design/icons';

const TradingGroupEntry = () => {
  const { token: { colorBG, TableHeaderColor,colorPrimary } } = theme.useToken();
  const navigate = useNavigate()
  return (
    <div className='p-8' style={{ backgroundColor: colorBG }}>
       <div className='flex gap-3 justify-between'>
     <div className='flex gap-3'>
     <img 
        src={ARROW_BACK_CDN} 
        alt='back icon' 
        className='cursor-pointer'
        onClick={() => navigate(-1)}
        />
       
        <h1 className='text-3xl font-bold'>Trading Account Group</h1>
     </div>
     <Link to={'/trading-group-entry'}>
       <CustomButton
         Text='Add Trading Group'
         style={{
         padding: '16px',
         height: '48px',
         borderRadius: '8px',
         }}
         icon={<PlusCircleOutlined />}
       />
      </Link>
     </div>
    </div>
  )
}

export default TradingGroupEntry