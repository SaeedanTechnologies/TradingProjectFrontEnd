import React from 'react'
import { Layout, Button, theme, Avatar } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  MoonFilled
} from '@ant-design/icons';
import PROFILE_CDN from '../../assets/images/profile.png'
import DOWNARR_CDN from '../../assets/images/down-arrow.svg'


const { Header } = Layout;
const Appbar = ({collapsed, setCollapsed}) => {
  const {
    token: { colorPrimary, colorBgContainer, colorTransparentPrimary },
  } = theme.useToken();
  return (
    <Header
    style={{
      padding: 0,
      background: colorBgContainer,
      borderBottom: "1px solid #f1f1f1",
      zIndex: "9999"
    }}
    className="sticky top-0 flex items-center justify-between"
  >
     <div>
        <Button
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: "16px",
            width: 60,
            height: 60,
            color: colorPrimary,
            boxShadow:  "none",
            outline: "none",
            border: "none",
          }}
          
        />
      </div>
      <div className='flex gap-4 px-6'>
      <div className="flex items-center justify-center h-[34px] w-[34px] rounded-full cursor-pointer" style={{ backgroundColor: colorTransparentPrimary }}>
        <MoonFilled style={{ color: colorPrimary, fontSize: '24px' }} />
      </div>
         <Avatar src={PROFILE_CDN} />
         <img src={DOWNARR_CDN} alt='icon' className='cursor-pointer' />
      </div>
  </Header>
  )
}

export default Appbar