import { theme } from 'antd';
import React from 'react'
import {PlusCircleOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons';
import CustomButton from '../../components/CustomButton';
import { Link } from 'react-router-dom';

const Index = () => {
  const {
    token: { colorBG, sidebarColor, colorPrimary  },
  } = theme.useToken();
  return (
    <div className='p-8' style={{backgroundColor: colorBG}}>
    <div className='flex flex-col sm:flex-row items-center gap-2 justify-between'>
      <h1 className='text-2xl font-semibold'>Single Trading Account</h1>
     <div className='flex flex-wrap items-center gap-4'>
     <CustomButton
           Text='Live Order History' 
           style={{borderRadius: '8px', padding: '20px', color: colorPrimary}}
           icon={<PlusCircleOutlined />}
           backgroundColor={sidebarColor}
           borderColor={colorPrimary}
           />
          <CustomButton
           Text='Create New Order' 
           style={{borderRadius: '8px', padding: '20px'}}
           icon={<PlusCircleOutlined />}
           />
     </div>
    </div>
  </div>
  )
}

export default Index