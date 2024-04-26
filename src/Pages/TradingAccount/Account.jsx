import React, {useState,useEffect} from 'react'
import { Spin, theme } from 'antd';
import CustomAutocomplete from '../../components/CustomAutocomplete';
import CustomPasswordField from '../../components/CustomPassowordField';
import CustomCheckbox from '../../components/CustomCheckbox';
import CustomButton from '../../components/CustomButton';
import { ALL_Trading_Account_Group_List } from '../../utils/_TradingAccountGroupAPI';
import { useSelector } from 'react-redux';
import { LeverageList } from '../../utils/constants';
import { Get_Single_Trading_Account,  Update_Trading_Account } from '../../utils/_TradingAPICalls';
import CustomNotification from '../../components/CustomNotification';
import ChangePasswordModal from './ChangePasswordModal';
import CustomModal from '../../components/CustomModal';






const Account = () => {
    
  const token = useSelector(({user})=> user?.user?.token )
  const trading_account_id = useSelector((state)=> state?.trade?.trading_account_id )
  const { token: { colorBG,   }} = theme.useToken();
  const [isModalOpen, setIsModalOpen] = useState(false);
  //
  const [tradingAccountGroupList,setTradingAccountGroupList] = useState([])
  const [selectedTradingAccountGroup,setSelectedTradingAccountGroup] = useState(null)
  const [selectedLeverage,setSelectedLeverage] = useState(null)
  const [password,setPassword] =  useState('')
 
  const [enable,setEnable] = useState(0);
  const [enable_password_change,setEnable_password_change] = useState(0);
  const [enable_investor_trading,setEnable_investor_trading] = useState(0);
  const [change_password_at_next_login,setChange_password_at_next_login] = useState(0)
   const [isLoading,setIsLoading ] = useState(false)


const ChkBoxesControl = [
  {
    id:5,
    control:'CustomCheckbox',
    label:'Enable This Account',
    value:enable,
    key:'enable'
  },
  {
    id:6,
    control:'CustomCheckbox',
    label:'Enable Password Change',
    value:enable_password_change,
    key:'enable_password_change'
  },
 
  {
    id:7,
    control:'CustomCheckbox',
    label:'Enable Investor Trading',
    value:enable_investor_trading,
    key:'enable_investor_trading'

  },
  {
    id:8,
    control:'CustomCheckbox',
    label:'Change Password at Next Login',
    value:change_password_at_next_login,
    key:'change_password_at_next_login'
  },
]


 const fetchTradingAccountGroups = async()=>{
    setIsLoading(true)
    const group_response = await ALL_Trading_Account_Group_List(token)
    const {data: { payload, success}} = group_response
    setIsLoading(false)
    if(success){
      setTradingAccountGroupList(payload)
      if(parseInt(trading_account_id) !== 0){
        fetchSingleAccount(payload)
      }
      
    }

  }

 const fetchSingleAccount= async(GroupsList)=>{
    setIsLoading(true)
      const res = await Get_Single_Trading_Account(trading_account_id, token)
      const {data: {message, payload, success}} = res
      if(success){
          // debugger;
        const selectedGroup =  GroupsList?.find(x=> x.id === payload.trading_group_id)
        const selectedLeverage = LeverageList.find(x=>x.value === payload.leverage) 
        setSelectedTradingAccountGroup(selectedGroup)
        setSelectedLeverage(selectedLeverage)
        setPassword(payload.password)
        payload.enable ? setEnable(true) : setEnable(false) ;
        payload.enable_password_change ? setEnable_password_change(true) : setEnable_password_change(false);
        payload.enable_investor_trading ? setEnable_investor_trading(true) : setEnable_investor_trading(false);
        payload.change_password_at_next_login ? setChange_password_at_next_login( true ) : setChange_password_at_next_login( false) 
        setIsLoading(false)
      
      

    }
   
  } 

  const handleInputChange = (fieldName, value) => {
    switch (fieldName) {
      case 'enable':
       setEnable(value) 
        break;
        case 'enable_password_change':
         setEnable_password_change(value)
         break;
        case 'enable_investor_trading':
         setEnable_investor_trading(value) 
        break;
        case 'change_password_at_next_login':
        setChange_password_at_next_login(value)
        break;

    }
  };

  const handleSubmit = async()=> {

    try{
        setIsLoading(true)
       const tradingAccountData ={
        trading_group_id: selectedTradingAccountGroup?.id,
        leverage: selectedLeverage?.value,
        password:password,
        enable :  enable ? 1 : 0,
        enable_password_change :  enable_password_change ? 1 : 0,
        enable_investor_trading :  enable_investor_trading ? 1 : 0 ,
        change_password_at_next_login : change_password_at_next_login ? 1 :0
      }
      
      const res = await  Update_Trading_Account(trading_account_id, tradingAccountData, token)
       const {data: {message, payload, success}} = res
       if(success)
    {
      CustomNotification({ type:"success", title:"Security Account", description:message, key:1 })
      setIsLoading(false)
    }   
    else{
      CustomNotification({ type:"error", title:"Security Account", description:message, key:1 })

      setIsLoading(false)
    }    
    
    }catch(err){
      CustomNotification({ type:"error", title:"Security Account", description:err.message, key:1 })
    }
  }


  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };


  useEffect(()=>{
    fetchTradingAccountGroups()
  
  },[])
 

  return (
      <Spin spinning={isLoading} size="large">
        <div className='p-8 border border-gray-300 rounded-lg' style={{ backgroundColor: colorBG }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-4">
              <div>
                 <CustomAutocomplete
                      name="Group"
                      label="Select Group"
                      variant="standard"
                      options={tradingAccountGroupList}
                      value={selectedTradingAccountGroup}

                      getOptionLabel={(option) => option.name ? option.name : ""}
                      onChange={(event, value) => {
                        if(value)
                            {
                              setSelectedTradingAccountGroup(value)
                            }
                          else
                            setSelectedTradingAccountGroup(null)                                                        
                            }}
                    />   
              </div>

              <div>
                 <CustomAutocomplete
                      name="Leverage"
                      label="Select Leverage"
                      variant="standard"
                      options={LeverageList}
                      value={selectedLeverage}
                      getOptionLabel={(option) => option.title ? option.title : ""}
                      onChange={(event, value) => {
                        if(value)
                            {
                              setSelectedLeverage(value)
                            }
                          else
                            setSelectedLeverage(null)                                                        
                            }}
                    />   
              </div>

                <div className='bg-white shadow-md py-6 px-4'>
                  {ChkBoxesControl.map(item=><CustomCheckbox key={item.id} label={item.label}
                  checked={item.value} onChange={(event)=> handleInputChange(item.key, event.target.checked)}
                   /> )}
                </div>

                <CustomPasswordField
                  name="password"
                  label="Password"
                  variant="standard"
                  value={password}
                  showClickable={true}
                  showModal={showModal}
                  readOnly={true}
                  onChange={(event)=>setPassword(event.target.value)}
                />  

                <div className='flex justify-start items-center'>
                    
                    <CustomButton
                      Text={'Save Changes'}
                      style={{
                      width: '180px',
                      height: '50px',
                      marginTop: '50px',
                      borderRadius: '8px',
                      }}
                      onClickHandler={handleSubmit}
                    />

                   <CustomModal
                      isModalOpen={isModalOpen}
                      handleOk={handleOk}
                      handleCancel={handleCancel}
                      title={''}
                      width={800}
                      footer={null}
                      
                    >
                      <ChangePasswordModal
                        setIsModalOpen={setIsModalOpen}
                        password={password}
                        setPassword={setPassword}
                      
                        />
                    </CustomModal>
                </div>
                
            </div>
           
        </div>
    </Spin>
  )
}

export default Account