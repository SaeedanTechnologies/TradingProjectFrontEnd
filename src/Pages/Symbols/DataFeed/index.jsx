import { theme } from 'antd';
import React from 'react'
import FeedCard from './FeedCard';

const Index = () => {
  const {
    token: { colorBG, TableHeaderColor, Gray2, colorPrimary  },
  } = theme.useToken();
  return (
    <div className='p-8' style={{ backgroundColor: colorBG }}>
      <h1 className='text-2xl font-semibold'>Data Feed</h1>
      <div className='grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6'>
           {
           Array.from({length: 12}).map(val=>  <FeedCard />)
           }
      </div>
    </div>
  )
}

export default Index