import React from 'react'


import BITCOINGRAPH_CDN from '../../assets/images/bitcoin-graph.svg'
import { theme } from 'antd';

const CoinCard = ({title,subtitle, value, subvalue, img_url}) => {
  const {
    token: { colorBG, Gray2, colorPrimary, colorTransparentPrimary },
  } = theme.useToken();
  return (
    <div className='p-[8px] bg-white w-[357px] flex  items-center justify-between py-8 px-4  rounded-2xl border'>
    <div className='flex gap-4'>
    <div className="flex items-center justify-center  rounded-lg cursor-pointer p-4" style={{ backgroundColor: colorTransparentPrimary }}>
      <img src={img_url} alt='icon'  />
    </div>
     <div className='flex flex-col'>
       <span className='text-lg font-medium'>{title}</span>
       <span className='text-sm font-medium' style={{color: Gray2}}>{subtitle}</span>
     </div>
    </div>
   <div  className='flex gap-4'>
   <div className='flex flex-col'>
       <span className='text-sm font-medium' style={{color: Gray2}}>{value}</span>
       <span className='text-sm font-medium' style={{color: colorPrimary}}>{subvalue}</span>
     </div>
       <img src={BITCOINGRAPH_CDN} alt='icon' />
   </div>

    </div>
  )
}

export default CoinCard