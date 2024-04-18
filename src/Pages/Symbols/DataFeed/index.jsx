import { Spin, theme } from 'antd';
import React, { useEffect, useState } from 'react'
import FeedCard from './FeedCard';
import { GetDataFeeds } from '../../../utils/_DataFeedAPI';
import { useSelector } from 'react-redux';

const Index = () => {
  const token = useSelector(({ user }) => user?.user?.token)
  const {
    token: { colorBG, TableHeaderColor, Gray2, colorPrimary  },
  } = theme.useToken();
const [isLoading, setIsLoading] = useState(false)
const [DataFeedList, setDataFeedList]= useState([])

  const fetchData = async ()=>{
    try{
      setIsLoading(true)
      const res = await GetDataFeeds(token)
      const { data: { payload, message, success } } = res
      setIsLoading(false)
      debugger
      if(success){
        setDataFeedList(payload.data)
      }
    }catch(err){
        alert(err.message)
    }
  }
  useEffect(()=>{
    fetchData()
  }, [])
  return (
    <Spin spinning={isLoading} size="large">
    <div className='p-8' style={{ backgroundColor: colorBG }}>
      <h1 className='text-2xl font-semibold'>Data Feed</h1>
      <div className='grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6'>
           {DataFeedList.map(val=>  <FeedCard id={val.id} feedName={val.name} feedServer={val.feed_server} />) }
      </div>
    </div>
    </Spin>
  )
}

export default Index