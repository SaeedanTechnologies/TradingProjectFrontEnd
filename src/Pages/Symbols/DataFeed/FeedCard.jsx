import { theme } from 'antd';
import React from 'react'

import FEED_CDN from '../../../assets/images/feed.svg'

const FeedCard = ({id, feedName, feedServer}) => {
  const {
    token: { colorBG, TableHeaderColor, Gray2, colorPrimary, colorTransparentPrimary },
  } = theme.useToken();
  return (
    <div className='bg-white border rounded-lg p-4'>
      <div className='w-[30px] h-[30px] rounded-full relative' style={{ backgroundColor: colorTransparentPrimary }}>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[20px] h-[20px] rounded-full' style={{ backgroundColor: colorPrimary }}></div>
      </div>
      <div className='flex flex-col gap-3 items-center justify-center'>
      <img src={FEED_CDN} alt='icon'  />
      <h1 className='text-xl font-bold text-center'>{feedName}</h1>
      <span className='text-lg font-semibold text-gray-400'>{feedServer}</span>
      </div>
    


    </div>
  )
}

export default FeedCard