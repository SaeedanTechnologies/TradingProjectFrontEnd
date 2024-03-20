import React from 'react'
import { theme } from 'antd';
import {PlusCircleOutlined} from '@ant-design/icons';
import CustomTable from '../../components/CustomTable'

const BrandList = () => {
  const {
    token: { colorBG },
  } = theme.useToken();
  return (
    <div className='p-8' style={{backgroundColor: colorBG}}>
        <CustomTable 
          title={'Brand List'}  
          isHideColumns={false} 
          isAddButton={true} 
          BtnText={'Add new Brand'} 
          BtnIcon={<PlusCircleOutlined />}
          BtnStyle={{borderRadius: '8px', padding: '14px, 20px, 14px, 20px'}}
          />
    </div>
  )
}

export default BrandList