import React from 'react'
import { Typography ,Stack} from '@mui/material';
import { Spin } from 'antd';

const SymbolSettingModal = ({setIsModalOpen}) => {
  return (
    <Spin spinning={isLoading} size="large">
        <div className='flex flex-col gap-6'>

              <Typography sx={{fontSize:"24px",fontWeight:600}}>Select Leverage For Symbol Settings</Typography>

              

             

          

              <div style={footerStyle}>
                <CustomButton
                  Text={'Ok'}
                  style={submitStyle}
                  onClickHandler={handleChangePassword}
                />
                
              </div>

        </div>
      </Spin>
  )
}

export default SymbolSettingModal