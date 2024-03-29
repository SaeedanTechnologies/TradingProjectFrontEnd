import React from 'react';
import { Divider, List, Typography } from 'antd';
import {RightOutlined} from '@ant-design/icons';
import { Link } from 'react-router-dom';
const data = [
  {id:1, title:'FireWall (IP Restriction)', path:'/firewall'},
 { id:2, title:'Margin Call Levels', path:'/margin-levels'},
  {id:3, title:'Change Password', path:'/change-password'},
];
const SettingsMenu = () => (
  <>
    <List
      bordered
      dataSource={data}
      renderItem={(item) => (
        <List.Item className='text-xl font-semibold cursor-pointer'> 
          <Link to={item.path}> <span>{item.title} </span>  </Link> 
          <Link to={item.path}>  <RightOutlined /> </Link>
        </List.Item>
      )}
    />
    
  </>
);
export default SettingsMenu;