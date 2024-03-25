import React, {useState} from 'react'
import { theme } from 'antd';
import CustomAutocomplete from '../../components/CustomAutocomplete';
import CustomTextField from '../../components/CustomTextField';
import CustomPasswordField from '../../components/CustomPassowordField';
import CustomCheckbox from '../../components/CustomCheckbox';
import CustomButton from '../../components/CustomButton';

const Account = () => {
  const {
    token: { colorBG, TableHeaderColor, colorPrimary  },
  } = theme.useToken();
  const [GroupList, setGroupList] = useState([
    {  id: 1,title: 'rea.848.USDT' },
    {  id: 2,title: 'rea.849.USDT' },
    {  id: 3,title: 'rea.850.USDT' },
    {  id: 4,title: 'rea.851.USDT' }
  ])
  const [SelectedGroup, setSelectedGroup] = useState(null)

  const [LeverageList, setLeverageList] = useState([
    {  id: 1,title: '1: 200' },
    {  id: 2,title: '1: 300' },
    {  id: 3,title: '1: 400' },
    {  id: 4,title: '1: 500' }
  ])
  const [SelectedLaverage, setSelectedLaverage] = useState(null)


  return (
    <div className='p-8 border border-gray-300 rounded-lg' style={{ backgroundColor: colorBG }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-4">
        <CustomAutocomplete
            name={'Group'} 
            varient={'standard'} 
            label={'Group'}
            options={GroupList}
            getOptionLabel={(option) => option.title ? option.title : ""}
            onChange={(e,value) =>{
                if(value){
                    setSelectedGroup(value)
                }
                else{
                    setSelectedGroup(null)
                } 
            }} 
            />
            <CustomAutocomplete
            name={'Laverage'} 
            varient={'standard'} 
            label={'Laverage'}
            options={LeverageList}
            getOptionLabel={(option) => option.title ? option.title : ""}
            onChange={(e,value) =>{
                if(value){
                    setSelectedLaverage(value)
                }
                else{
                    setSelectedLaverage(null)
                } 
            }} 
            />
            <CustomTextField
                label={'Bank Account'}
                varient={'standard'} 
            />
            <CustomPasswordField
                label={'Change Password'}
                varient={'standard'} 
            />
            <div className='bg-white shadow-md py-6 px-4'>
              <CustomCheckbox label={'Enable This Account'} />
              <CustomCheckbox label={'Enable Password Change'} />
              <CustomCheckbox label={'Show Change Password'} />
              <CustomCheckbox label={'Enable Investor Trading'} />
              <CustomCheckbox label={'Change Password at Next Login'} />
              
            </div>
            <div className='flex justify-end items-end'>
            <CustomButton
              Text={'Save Changes'}
              style={{
              width: '180px',
              height: '50px',
              marginTop: '50px',
              borderRadius: '8px',
              }}
            />
            </div>
            
        </div>
    </div>
  )
}

export default Account