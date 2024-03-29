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
import { Breadcrumb, Layout, Menu, Space, Switch, theme } from 'antd';

import './style.css';
import LOGOUT_CDN from '../../assets/images/logout.svg';
import LOGO_CDN from '../../assets/images/logo.png';
import SubMenu from "antd/es/menu/SubMenu";
import { useNavigate } from "react-router-dom";
import { siderMenuStyle, siderStyle, subMenuTitleStyle } from "./style";

const { Sider } = Layout;



const Sidebar = ({ collapsed }) => {
  const [selectedKey, setSelectedKey] = useState('1');
  const { token: { sidebarColor, darkGray, colorTransparentPrimary, Gray2, colorPrimary } } = theme.useToken();
  const navigate = useNavigate();
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
        { key: '2', label: 'Brand List' },
        { key: '3', label: 'Brand Settings' }
      ],
      label: 'Brands'
    },
    {
      key: 'sub3',
      icon: <UserOutlined />,
      children: [
        { key: '4', label: 'Trading Account List' },
        { key: '5', label: 'Trading Account Group' },
        { key: '13', label: 'Active Account Group' },
        { key: '14', label: 'Margin Call Trading Account' },
      ],
      label: 'Trading Account'
    },
    {
      key: 'sub2',
      icon: <FileDoneOutlined />,
      children: [
        { key: '6', label: 'Live Orders' },
        { key: '7', label: 'Close Orders' }
      ],
      label: 'Trading Orders'
    },
    {
      key: '8',
      icon: <AntDesignOutlined />,
      children: [],
      label: 'Transaction Orders'
    },
    {
      key: 'sub4',
      icon: <AntDesignOutlined />,
      children: [
        { key: '15', label: 'Symbol Group' },
        { key: '16', label: 'Symbol Settings' },
        { key: '17', label: 'Data Feeds' },
        { key: '18', label: 'Tickets & Charts' },
        { key: '19', label: '1 Minute Charts' },
      ],
      label: 'Symbol'

    },
    {
      key: '10',
      icon: <SettingOutlined />,
      children: [],
      label: 'Settings'
    },
  ];

  const handleMenuSelect = ({ key }) => {
    setSelectedKey(key);
    switch (key) {
      case "1":
        navigate("/");
        break;
      case "2":
        navigate("/brand");
        break;
      case "3":
        navigate("/brand-settings");
        break;
      case "4":
        navigate("/trading-accounts");
        break;
        case "5":
        navigate("/trading-group");
        break;
      case "6":
        navigate("/live-orders");
        break;
      case "7":
        navigate("/close-orders");
        break;
      case "8":
        navigate("/transaction-orders");
        break;
      case "13":
        navigate("/active-accounts");
        break;
      case "14":
        navigate("/margin-calls");
        break;
      case "15":
        navigate("/symbol-groups");
        break;
      case "16":
        navigate("/symbol-settings");
        break;
      case "17":
        navigate("/data-feed");
        break;
      case "18":
        navigate("/ticket-charts");
        break;
      case "19":
        navigate("/min-charts");
        break;
      case "10":
        navigate("/settings");
        break;
    }
  };
  return (
    <div style={{ backgroundColor: sidebarColor }}>
      <Sider
        collapsible
        collapsed={collapsed}
        width={250}
        style={{ backgroundColor: sidebarColor,...siderStyle}}
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
            selectedKeys={[selectedKey]}
            onClick={(e) => { handleMenuSelect(e) }}
            style={siderMenuStyle}
          >
            {items.map(item => (
              item.children.length > 0 && item.children ? (
                <SubMenu
                  key={item.key}
                  icon={<span style={{ color: Gray2, marginTop: "20px" }}>{item.icon}</span>}
                  title={<span style={{ color: Gray2, ...subMenuTitleStyle }}>{item.label}</span>}
                >
                  {item.children.map(child => (
                    <Menu.Item
                      key={child.key}
                      style={{ color: selectedKey === child.key ? colorPrimary : Gray2, marginTop: "20px", fontWeight: "600" }}
                    >
                      {child.label}
                    </Menu.Item>
                  ))}
                </SubMenu>
              ) : (
                <Menu.Item
                  key={item.key}
                  icon={item.icon}
                  style={{ color: selectedKey === item.key ? colorPrimary : Gray2, marginTop: "20px", fontWeight: "600" }}
                >
                  {item.label}
                </Menu.Item>
              )
            ))}
          </Menu>

          <div className="w-full fixed gap-4 bottom-12  left-0 ">
            <div className="flex items-center justify-between w-[250px] px-4 py-1 bg-white">
              <div className={`flex gap-3 bg-white `} >
                <MoonFilled style={{ fontSize: `24px`, color: darkGray }} />
                {!collapsed && <span style={{ color: darkGray }}>Dark Mode</span>}
              </div>
              {!collapsed && <Switch checkedChildren="ON" unCheckedChildren="OFF" />}
            </div>
          </div>
        </div>
      </Sider>
    </div>

  );
};

export default Sidebar;
