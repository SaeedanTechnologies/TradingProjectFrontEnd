import React, {useState,useEffect} from 'react'
import { theme } from 'antd';
import CustomAutocomplete from '../../components/CustomAutocomplete';
import CustomTextField from '../../components/CustomTextField';
import CustomPasswordField from '../../components/CustomPassowordField';
import CustomCheckbox from '../../components/CustomCheckbox';
import CustomButton from '../../components/CustomButton';

const Account = () => {
  const { token: { colorBG,   }} = theme.useToken();
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
  const [leverage,setLeverage] = useState('')
  const [password,setPassword] = useState('')
  const [SelectedLaverage, setSelectedLaverage] = useState(null)
  const ComponentMap = {
    CustomTextField: CustomTextField,
    CustomAutocomplete: CustomAutocomplete,
    CustomPasswordField: CustomPasswordField,
  };
  const Controls = [
    {
      id:1,
      control:'CustomAutocomplete',
      name:'Group', 
      varient: 'standard', 
      label:'Group',
      options: GroupList,
      getOptionLabel:(option) => option.title ? option.title : "",
      onChange: (e,value) =>{
        if(value){
            setSelectedGroup(value)
        }
        else{
            setSelectedGroup(null)
        } 
      }
    },
    {
      id: 2,
      control:'CustomAutocomplete',
      name:'Laverage', 
      varient: 'standard', 
      label:'Laverage',
      options: LeverageList,
      getOptionLabel:(option) => option.title ? option.title : "",
      onChange: (e,value) =>{
        if(value){
            setSelectedLaverage(value)
        }
        else{
            setSelectedLaverage(null)
        } 
      }
    }, 
    {
    id: 3,
    control:'CustomTextField',
    label:'Bank Account',
    varient:'standard',
    }, 
    {
      id: 4,
      control:'CustomPasswordField',
      label:'Change Password',
      varient:'standard',
    },

  ]
const ChkBoxesControl = [
  {
    id:5,
    control:'CustomCheckbox',
    label:'Enable This Account',
  },
  {
    id:6,
    control:'CustomCheckbox',
    label:'Enable Password Change',
  },
  {
    id:7,
    control:'CustomCheckbox',
    label:'Show Change Password',
  },
  {
    id:8,
    control:'CustomCheckbox',
    label:'Enable Investor Trading',
  },
  {
    id:9,
    control:'CustomCheckbox',
    label:'Change Password at Next Login',
  },
]

      useEffect(()=>{
    console.log('in account & security by default')
  },[])

  return (
    <div className='p-8 border border-gray-300 rounded-lg' style={{ backgroundColor: colorBG }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-4">
          {
            Controls.map(item=>{
            const ComponentToRender = ComponentMap[item.control]
            return (
              <ComponentToRender
              key={item.id}
              name={item.name} 
              varient={item.varient} 
              label={item.label}
              options={item.options}
              getOptionLabel={(option)=> item.getOptionLabel(option)}
              onChange={(e,value) => item.onChange(e,value)} 
              />
              )
            })
          }
            <div className='bg-white shadow-md py-6 px-4'>
              {ChkBoxesControl.map(item=><CustomCheckbox key={item.id} label={item.label} /> )}
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
        <div className='p-8 border border-gray-300 rounded-lg' style={{ backgroundColor: colorBG }}>

          {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-4">
            

              <div>
              <CustomTextField
                name='Name'
                type={'text'}
                varient='standard'
                label='Name'
                value={name}
                onChange={e => handleInputChange('name', e.target.value)}
              />
              </div>
              <div>
              <CustomTextField
                name='date'
                type={'date'}
                varient='standard'
                label='Registered Date'
                value={registration_time}
                onChange={e => handleInputChange('registration_time', e.target.value)}
              
              />
              </div>
              <div>
              <CustomTextField
                name='email'
                type={'text'}
                varient='standard'
                label='Email'
                value={email}
                onChange={e => handleInputChange('email', e.target.value)}
                sx={numberInputStyle}
              />
              </div>
              <div>
                <CustomTextField
                name='Phone'
                type={'number'}
                varient='standard'
                label='Phone'
                value={phone}
                onChange={e => handleInputChange('phone', e.target.value)}
                sx={numberInputStyle}
              />
              </div>

              <div>
              <CustomTextField
                name='Country'
                type={'text'}
                varient='standard'
                label='Country'
                value={country}
                onChange={e => handleInputChange('country', e.target.value)}
                sx={numberInputStyle}
              />
              </div>

                
          </div>
          <div className='flex justify-end'>
          <CustomButton
                    Text={'Save Changes'}
                    style={PDataSaveBtnStyle}
                    onClickHandler={handleSubmit}
                  />
          </div> */}
   
        </div>
    </div>
  )
}

export default Account