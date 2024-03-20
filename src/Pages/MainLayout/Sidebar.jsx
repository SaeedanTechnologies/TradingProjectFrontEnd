import React, { useState } from "react";
import {
  SettingOutlined,
  LineChartOutlined,
  AntDesignOutlined,
  DingdingOutlined,
  AppstoreFilled,
  FileDoneOutlined,
  UserOutlined,
  MoonFilled
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, Switch, theme } from 'antd';

import './style.css';
import LOGOUT_CDN from '../../assets/images/logout.svg';
import LOGO_CDN from '../../assets/images/logo.png';
import SubMenu from "antd/es/menu/SubMenu";

const { Sider } = Layout;



const Sidebar = ({ collapsed }) => {
  const [selectedKey, setSelectedKey] = useState('1');
  const {
    token: { sidebarColor, darkGray, colorTransparentPrimary, Gray2, colorPrimary },
  } = theme.useToken();
  const items = [
    {
      key: '1',
      icon: <AppstoreFilled />,
      children: [],
      label: 'Dashboard'
    },
    {
      key: 'sub1',
      icon: <DingdingOutlined />,
      children: [
        { key: '2', label: 'Tom' },
        { key: '3', label: 'Bill' },
        { key: '4', label: 'Alex' }
      ],
      label: 'Brands'
    },
    {
      key: '3',
      icon: <UserOutlined   />,
      children: [],
      label: 'Trading Account'
    },
    {
      key: 'sub2',
      icon: <FileDoneOutlined   />,
      children: [
        { key: '2', label: 'Tom' },
        { key: '3', label: 'Bill' },
        { key: '4', label: 'Alex' }
      ],
      label: 'Trading Orders'
    },
    {
      key: '3',
      icon: <AntDesignOutlined />,
      children: [],
      label: 'Symbol Group'
    },
    {
      key: '3',
      icon: <LineChartOutlined />,
      children: [],
      label: 'Data Feed'
    },
    {
      key: '3',
      icon: <SettingOutlined />,
      children: [],
      label: 'Settings'
    },
  ];

  const handleMenuSelect = ({ key }) => {
    setSelectedKey(key);
  };
  return (
    <Sider
      className="h-screen"
      collapsible
      collapsed={collapsed}
      width={250}
      style={{
        backgroundColor: sidebarColor,
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
      }}
      trigger={
        <>
          <div style={{ backgroundColor: sidebarColor }}>
            <div className={`flex px-3 py-1`} style={{ backgroundColor: colorTransparentPrimary }}>
              <img alt="icon" src={LOGOUT_CDN} />
              {!collapsed && <span style={{ color: darkGray }}>Logout</span>}
            </div>
           
          </div>
        </>
      }
    >
      <div className="h-screen">
      <div className="flex flex-1 items-center justify-center py-2">
        <img alt="logo" src={LOGO_CDN} className="w-[166px] h-[50px]" />
      </div>
      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={['4']}
        selectedKeys={[selectedKey]} // Pass the selectedKey as selectedKeys
        onClick={(e) => { handleMenuSelect(e) }} // Handle menu item selection
      >
        {items.map(item => (
          item.children.length > 0 && item.children ? (
            <SubMenu key={item.key} icon={<span style={{ color: Gray2 }}>{item.icon}</span>} title={<span style={{
              color: Gray2, fontSize: "14px",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
            }}>{item.label}</span>}>
              {item.children.map(child => (
                <Menu.Item key={child.key} style={{ color: selectedKey === child.key ? colorPrimary : Gray2 }}>
                  {child.label}
                </Menu.Item>
              ))}
            </SubMenu>
          ) : (
            <Menu.Item key={item.key} icon={item.icon} style={{ color: selectedKey === item.key ? colorPrimary : Gray2 }}>
              {item.label}
            </Menu.Item>
          )
        ))}
        {/*items.map(item => (
          <Menu.Item  key={item.key} icon={item.icon} style={{color:selectedKey === item.key ? colorPrimary :Gray2}} >
          {item.label}
          </Menu.Item>
        ))*/}
      </Menu>
      <div className="flex items-center justify-between fixed gap-4 bottom-14 left-0 w-[250px] px-4 py-1">
      <div className={`flex gap-3 `} >
          <MoonFilled style={{fontSize:`24px`,color: darkGray}}/>
              {!collapsed && <span style={{ color: darkGray }}>Dark Mode</span>}
             
            </div>
            <Switch checkedChildren="ON" unCheckedChildren="OFF" />
      </div>
      </div>
     
    
    </Sider>
  );
};

export default Sidebar;
