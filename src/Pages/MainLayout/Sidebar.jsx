import React, { useState } from "react";
import {
  SettingOutlined,
  LineChartOutlined,
  AntDesignOutlined,
  DingdingOutlined,
  AppstoreFilled,
  FileDoneOutlined,
  UserOutlined,
  MenuFoldOutlined ,
  MoonFilled
} from '@ant-design/icons';
import {  Layout,Button, Menu,  Switch, theme } from 'antd';
import { colaspedBtnStyle, } from './style';
import './style.css';
import LOGOUT_CDN from '../../assets/images/logout.svg';
import LOGO_CDN from '../../assets/images/logo.png';
import SubMenu from "antd/es/menu/SubMenu";
import { useNavigate } from "react-router-dom";
import { siderMenuStyle, siderStyle, subMenuTitleStyle } from "./style";
import { useSelector,useDispatch } from "react-redux";
import { CheckBrandPermission } from "../../utils/helpers";
import { logoutUser } from "../../store/UserSlice";
import CustomNotification from "../../components/CustomNotification";


const { Sider } = Layout;



const Sidebar = ({ collapsed, setCollapsed }) => {
    const token = useSelector(({ user }) => user?.user?.token)
  const [selectedKey, setSelectedKey] = useState('1');
  const userRole = useSelector((state)=>state?.user?.user?.user?.roles[0]?.name)
  const userPermissions = useSelector((state)=>state?.user?.user?.user?.permissions)

  const { token: { sidebarColor, darkGray, colorTransparentPrimary, Gray2, colorPrimary } } = theme.useToken();
  const navigate = useNavigate();
  const dispatch = useDispatch();
     
  const Logout_Handler = async () => {
    try{
       const res = await dispatch(logoutUser(token));
    const { payload,message,success } = res;
    if (payload[2]) {
      CustomNotification({
        type: 'success',
        title: 'Logout',
        description: payload[1],
        key: 1
      });
      navigate('/');
    } else {
      CustomNotification({
        type: 'error',
        title: 'Invalid',
        description: payload[1],
        key: 2
      });
    }
    }catch(error){
       CustomNotification({
        type: 'error',
        title: 'Invalid',
        description: error.message,
        key: 2
      });
    }
   
  };

  const items = [
    {
      key: '1',
      icon: <AppstoreFilled />,
      children: [],
      label: 'Dashboard',
      display: 'show' 
    },
    // {
    //   key: 'sub1',
    //   icon: <DingdingOutlined />,
    //   children: [
    //     { key: '2', label: 'Brand List' },
    //     //{ key: '3', label: 'Brand Settings' }
    //   ],
    //   label: 'Brands'
    // },
    {
      key: '2',
      icon: <DingdingOutlined />,
      children: [],
      label: 'Brands',
      display: userRole === 'admin' ? 'show' : 'hide'
    },
    {
      key: 'sub3',
      icon: <UserOutlined />,
      children: [
        { key: '4', label: 'Trading Account List',  display:  CheckBrandPermission(userPermissions,userRole,'trading_account_list_read') ? 'show' : 'hide'  },
        { key: '5', label: 'Trading Account Group',  display: CheckBrandPermission(userPermissions,userRole,'trading_account_group_read') ? 'show' : 'hide' },
        { key: '13', label: 'Active Account Group',  display: CheckBrandPermission(userPermissions,userRole,'active_account_group_read') ? 'show' : 'hide' },
        { key: '14', label: 'Margin Call Trading Account', display: CheckBrandPermission(userPermissions,userRole,'margin_call_trading_account_read') ? 'show' : 'hide' },
      ],
      label: 'Trading Account',
         display: 'show' 
    },
    {
      key: 'sub2',
      icon: <FileDoneOutlined />,
      children: [
        { key: '6', label: 'Live Orders', display: CheckBrandPermission(userPermissions,userRole,'live_orders_read') ? 'show' : 'hide'  },
        { key: '7', label: 'Close Orders',display: CheckBrandPermission(userPermissions,userRole,'close_orders_read') ? 'show' : 'hide'  }
      ],
      label: 'Trading Orders',
         display: 'show' 
    },
    {
      key: '8',
      icon: <AntDesignOutlined />,
      children: [],
      label: 'Transaction Orders',
         display: CheckBrandPermission(userPermissions,userRole,'transaction_orders_read') ? 'show' : 'hide'   
    },
    {
      key: 'sub4',
      icon: <AntDesignOutlined />,
      children: [
        { key: '15', label: 'Symbol Group',display: userRole === 'admin' ? 'show' : 'hide'  },
        { key: '16', label: 'Symbol Settings',display: userRole === 'admin' ? 'show' : 'hide'  },
        { key: '17', label: 'Data Feeds',display: userRole === 'admin' ? 'show' : 'hide'  },
        { key: '18', label: 'Tickets & Charts',display: userRole === 'admin' ? 'show' : 'hide'  },
        { key: '19', label: '1 Minute Charts',display: userRole === 'admin' ? 'show' : 'hide'  },
      ],
      label: 'Symbol',
      display: userRole ==='admin' ? 'show' : 'hide'

    },
    {
      key: '10',
      icon: <SettingOutlined />,
      children: [],
      label: 'Settings',
      display: 'show' 
    },
  ];
  const handleMenuSelect = ({ key }) => {
    setSelectedKey(key);
    switch (key) {
      case "1":
        navigate("/dashboard");
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
        style={{ backgroundColor: sidebarColor, ...siderStyle }}
        trigger={
          <>
            <div style={{ backgroundColor: sidebarColor }}>
              <div className={`flex px-3 py-1`} style={{ backgroundColor: colorTransparentPrimary }} onClick={Logout_Handler}>
                <img alt="icon" src={LOGOUT_CDN} />
                {!collapsed && <span style={{ color: darkGray }}>Logout</span>}
              </div>
            </div>
          </>
        }
      >
        <div className="h-screen">
          <div className="flex flex-1 justify-end">
          <MenuFoldOutlined style={{fontSize: "24px"}} onClick={()=> setCollapsed(!collapsed)}/>
          </div>
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
              (
                item.display === 'show'  ?
               item.children.length > 0 && item.children ? (
                <SubMenu
                  key={item.key}
                  icon={<span style={{ color: Gray2, marginTop: "20px" }}>{item.icon}</span>}
                  title={<span style={{ color: Gray2, ...subMenuTitleStyle }}>{item.label}</span>}
                >
                  {item.children.map(child => (
                    ( child.display === 'show'? (

                    <Menu.Item
                      key={child.key}
                      style={{ color: selectedKey === child.key ? colorPrimary : Gray2, marginTop: "20px", fontWeight: "600" }}
                    >
                      {child.label}
                    </Menu.Item>
                    )   : 
                    "")
                   
                  ))}
                </SubMenu>
              ) :   (
                
                <Menu.Item
                  key={item.key}
                  icon={item.icon}
                  style={{ color: selectedKey === item.key ? colorPrimary : Gray2, marginTop: "20px", fontWeight: "600" }}
                >
                  {item.label}
                </Menu.Item>
              ) 
            :"")
             
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
