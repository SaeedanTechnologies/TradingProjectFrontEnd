import { Spin, theme } from 'antd'
import React, { useEffect, useState } from 'react'
import ARROW_BACK_CDN from '../../assets/images/arrow-back.svg'
import { useNavigate } from 'react-router-dom'
import { Button, TextField } from '@mui/material'
import { useSelector } from 'react-redux'
import { addIp_To_List } from '../../utils/_IPAddress'
import CustomNotification from '../../components/CustomNotification'
const Active_IP_List_Entry = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [ip, setIp] = useState("")
  const token = useSelector(({ user }) => user?.user?.token)
  const navigate = useNavigate()
  const {
      token: { colorBG },} = theme.useToken();
  const handleSubmit = async (e) => {
    e.preventDefault()
    const params = {
        ip_address:ip
    }
    setIsLoading(true)
    const res = await addIp_To_List(params, token)
    setIsLoading(false)
    CustomNotification({ type: "success", title: "Created", description: `${res.data.message}`, key: 1 })
    setIp("")
    navigate("/firewall/active-ip-list")
}
    return (
        <Spin spinning={isLoading} size="large">
        <div className='p-8' style={{ backgroundColor: colorBG }}>
            <div className='flex justify-between'>
            <div className='flex gap-3 items-center'>
            <img
              src={ARROW_BACK_CDN}
              alt='back icon'
              className='cursor-pointer'
              onClick={() => navigate("/firewall/active-ip-list")}
            />
            </div>
            </div>
            <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 mt-10'>
                <TextField size='small'
                label="Add Ip"
                name="ip"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                required  
                />
            </div>
            <div>
                <Button 
                type='submit'
                variant='contained' 
                sx={{mt:4, background:"#1cac70", '&:hover':{background:"#1cac70"}}}>
                    Add
                </Button>
            </div>
                </form>
        </div>
        </Spin>
  )
}

export default Active_IP_List_Entry
