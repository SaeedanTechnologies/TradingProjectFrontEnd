import { theme } from 'antd';
import React from 'react'
import FILTER_CDN from '../../assets/images/filter-white.svg';
import ARROW_BACK_CDN from '../../assets/images/arrow-back.svg';
import {  useNavigate } from 'react-router-dom';
import CustomButton from '../../components/CustomButton';
import CustomTextField from '../../components/CustomTextField';
import CustomPassowordField from '../../components/CustomPassowordField';

const ChangePassword = () => {
  const { token: { colorBG, TableHeaderColor, colorPrimary } } = theme.useToken();
  const navigate = useNavigate()

  return (
    <div className='p-8' style={{ backgroundColor: colorBG }}>
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-3'>
      <img 
        src={ARROW_BACK_CDN} 
        alt='back icon' 
        className='cursor-pointer'
        onClick={()=> navigate(-1)}
        />
        <h1 className='text-2xl font-bold'>Change Password</h1>
      </div>
 
       {/* <CustomButton
          Text={'Filters'}
          icon={<img src={FILTER_CDN} alt='icon' />}
          style={{ height: '48px', borderRadius: '8px' }}
        />*/}
      </div>
    <div className='border mt-6 rounded-lg p-8 flex flex-col gap-6'>
      <CustomPassowordField 
        label={'Old Password'}
        varient={'standard'}
      />
       <CustomPassowordField 
        label={'New Password'}
        varient={'standard'}
      />
      <CustomPassowordField 
        label={'Confirm Password'}
        varient={'standard'}
      />
       <div className='flex justify-center sm:justify-end flex-wrap items-center gap-4 mt-6'>
          <CustomButton
            Text='Cancel'
            style={{
              padding: '16px',
              height: '48px',
              width: '200px',
              borderRadius: '8px',
              backgroundColor: '#c5c5c5',
              borderColor: '#c5c5c5',
              color: '#fff'
            }}
            onClickHandler={()=> navigate(-1)}
          />
          <CustomButton
            Text='Update'
            style={{
              padding: '16px',
              height: '48px',
              width: '200px',
              borderRadius: '8px',
            }}
          />

        </div>
    </div>
    </div>
  )
}

export default ChangePassword