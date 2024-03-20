import React from 'react'
import { theme } from 'antd';

import CoinCard from './CoinCard';
import BITCOIN_CDN from '../../assets/images/Bitcoin.svg'
import RIPPLE_CDN from '../../assets/images/ripple.svg'
import ETHIRUM_CDN from '../../assets/images/ethrieum.svg'

const index = () => {
  const {
    token: { colorBG, Gray2, colorPrimary },
  } = theme.useToken();
  return (
    <div className='p-[12px]' style={{backgroundColor: colorBG}}>
       <h1 className='text-2xl font-semibold'>Dashboard</h1>
       <div className="grid gap-4 p-4 sm:grid-cols-1 md:grid-cols-3">
       <CoinCard title={"Bitcoin"} subtitle={"BTS/UDS"} value={"2210"} subvalue={"+0.12 %"} img_url={BITCOIN_CDN}   />
       <CoinCard title={"Bitcoin"} subtitle={"BTS/UDS"} value={"2210"} subvalue={"+0.12 %"} img_url={RIPPLE_CDN}  />
       <CoinCard title={"Bitcoin"} subtitle={"BTS/UDS"} value={"2210"} subvalue={"+0.12 %"} img_url={ETHIRUM_CDN}  />
       </div>
       
    </div>
  )
}

export default index