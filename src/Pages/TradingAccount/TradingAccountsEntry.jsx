import { theme, Spin, Dropdown } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { LeftOutlined, RightOutlined, EllipsisOutlined } from '@ant-design/icons';

import * as Yup from 'yup';
import ARROW_BACK_CDN from '../../assets/images/arrow-back.svg'
import CustomTextField from '../../components/CustomTextField';
import CustomAutocomplete from '../../components/CustomAutocomplete';
import CustomPhoneNo from '../../components/CustomPhoneNo';
import { LeverageList } from '../../utils/constants';
import CustomButton from '../../components/CustomButton';
import { Feed_Data_List, SelectSymbolSettingsWRTID, SymbolSettingPost, Symbol_Group_List, UpdateSymbolSettings } from '../../utils/_SymbolSettingAPICalls';
import { GetAskBidData, GetCryptoData, GetFasciData } from '../../utils/_ExchangeAPI'
import { useDispatch, useSelector } from 'react-redux';
import CustomNotification from '../../components/CustomNotification';
import { Autocomplete, TextField } from '@mui/material'
import { GenericEdit, GenericDelete } from '../../utils/_APICalls';
import { CustomBulkDeleteHandler, CustomDeleteDeleteHandler } from '../../utils/helpers';
import { deleteSymbolSettingsById } from '../../store/symbolSettingsSlice';
import { EditOutlined } from '@mui/icons-material';
import { CurrenciesList } from '../../utils/constants';
import { Get_Single_Trading_Account } from '../../utils/_TradingAPICalls';

const FeedData = [
  { feed_name: "First", server: 'First server' },
  { feed_name: "Second", server: 'Second server' },
  { feed_name: "Third", server: 'Third server' },
]


const TradingAccountsEntry = () => {
  const userRole = useSelector((state)=>state?.user?.user?.user?.roles[0]?.name);
  const userBrand = useSelector((state)=> state?.user?.user?.brand)
  const token = useSelector(({ user }) => user?.user?.token)
  const TradingAccountsIds = useSelector(({ trade }) => trade.selectedRowsIds)
  const TradingAccountsData = useSelector(({trade})=> trade.tradingAccountsData)
  const ArrangedTradingAccountsData = TradingAccountsData.slice().sort((a, b) => a?.id - b?.id);
  const [brandList,setBrandList] = useState([])


  const initialValues= {
    country:"",
    phone:"",
    email:"",
    balance:"",
    leverage:"",
    swap:"",
    currency:"",
    brand_id:"",
    status:"active"
  }

  
  const [tradingAccount,setTradingAccount] = useState(initialValues) 
  const [errors, setErrors] = useState({}); 
  const [isLoading, setIsLoading] = useState(false)

   const Control = [
    
      {
        id: 14, 
        control:'CustomAutocomplete',
        name:'Brands',   
        label:'Brands', 
        varient: 'standard',
        display: userRole === 'admin' ? 'show' : 'hide',
        options:brandList,
        value:tradingAccount.brand_id,
        getOptionLabel:(option) => option.name ? option.name : "",
        onChange:(e,value) =>{
          if(value){

            setErrors(prevErrors => ({ ...prevErrors, brand_id: "" }))
               setTradingAccount(prevData => ({
                    ...prevData,
                    brand_id: value.public_key
                }))
          } 
          }   
      },
      {
        id: 14, 
        control:'CustomAutocomplete',
        display: 'show' ,
        name:'Leverage',   
        label:'Leverage', 
        varient: 'standard',
        options:LeverageList,
        value: tradingAccount.leverage,
        getOptionLabel:(option) =>  option.title ? option.title : "",
        onChange:(e,value) =>{
          if(value){
            setErrors(prevErrors => ({ ...prevErrors, leverage: "" }))
               setTradingAccount(prevData => ({

                    ...prevData,
                    leverage: value.value
                }))
          } 
          }   
      },
   
      {id: 5, control:'CustomTextField',   display: 'show' , label:'Email', varient: 'standard',  value:tradingAccount.email, onChange:(e) =>{
               setTradingAccount(prevData => ({
                    ...prevData,
                    email: e.target.value
                }));
           
          }   
      },
       {
        id: 12, 
        control:'CustomTextField',
        display: 'show' ,
        name:'Phone',   
        label:'Phone', 
        varient: 'standard',
        value:tradingAccount.phone,
        onChange:(e) =>{
   
               setTradingAccount(prevData => ({
                    ...prevData,
                    phone: e.target.value
                }));
          }   
      },
      {
        id: 3, 
        control:'CustomTextField',
        display: 'show' ,
        name:'Country',   
        label:'Country', 
        varient: 'standard',
        value:tradingAccount.country,
        onChange:(e) =>{
   
               setTradingAccount(prevData => ({
                    ...prevData,
                    country: e.target.value
                }));
          }   
      },
     
      {id: 7, control:'CustomTextField',    display: 'show' , label:'Balance', varient: 'standard',value:tradingAccount.balance,onChange:(e) =>{
               setTradingAccount(prevData => ({
                    ...prevData,
                    balance: e.target.value
                }))
    
     
      }},
      {id: 12, control:'CustomTextField',   display: 'show' ,  label:'Swap', varient: 'standard',value:tradingAccount.swap,onChange:(e) =>{
               setTradingAccount(prevData => ({
                    ...prevData,
                    swap: e.target.value
                }))
          }  },
      {
        id: 13, 
        control:'CustomAutocomplete',
        name:'Currency',   
        display: 'show' ,
        label:'Currency', 
        varient: 'standard',
        options:CurrenciesList,
        value:tradingAccount.currency,
        getOptionLabel:(option) => option.label ? option.label : "",
        onChange:(e,value) =>{
         if(value){
               setTradingAccount(prevData => ({
                    ...prevData,
                    currency: value.value
                }))
          }  
          } 
      },
   
    
  ]

   const ComponentMap = {
    CustomTextField: CustomTextField,
    CustomAutocomplete: CustomAutocomplete,
    CustomPhoneNo: CustomPhoneNo,
  };



  const {
    token: { colorBG },} = theme.useToken();
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [feedNameFetchList, setFeedNameFetchList] = useState([])
  const [selectedFeedNameFetch, setSelectedFeedNameFetch] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const [symbolName, setSymbolName] = useState('')
  const [SelectedLeverage, setSelectedLeverage] = useState(null)
 
  const [SymbolList, setSymbolList] = useState([])
  const [FeedNameList, setFeedNameList] = useState([])
  const [selectedFeedName, setSelectedFeedName] = useState(null)
  const [SelectedSymbol, setSelectedSymbol] = useState(null)
  const [selectedGroup, setSelectedGroup] = useState([]);
  const [leverage, setLeverage] = useState('')
  const [swap, setSwap] = useState('')
  const [lotSize, setLotSize] = useState('')
  const [lotSteps, setLotSteps] = useState('')
  const [volMin, setVolMin] = useState('')
  const [volMax, setVolMax] = useState('')
  const [commission, setCommission] = useState('')
  const [EnabledList] = useState([
    { id: 1, title: 'Yes' },
    { id: 2, title: 'No' },
  ])
  const [Selectedenable, setSelectedEnable] = useState(null)
  const [askValue, setAskValue] = useState('')
  const [bidValue, setBidValue] = useState('')
  const [isDisabled, setIsDisabled] = useState(false)





  const validationSchema = Yup.object().shape({
    SymbolGroup: Yup.array().required('Symbol Group is required'),
    symbolName: Yup.string().required('Symbol Group Name is required'),
    feed_name: Yup.object().required('Symbol Feed Name is required'),
    feed_name_fetch: Yup.object().required('Symbol Feed Name Fetch is required'),
    Leverage: Yup.object().required('Leverage is required'),
    swap: Yup.string().required('Symbol Swap is required'),
    lotSize: Yup.string().required('Lot Size is required'),
    lotSteps: Yup.string().required('Lot Steps is required'),
    volMin: Yup.string().required('Value Minimum is required'),
    volMax: Yup.string().required('Value Maximum is required'),
    commission: Yup.string().required('Commision is required'),
    enabled: Yup.object().required('Enabled is required'),
  });


  const clearFields = () => {
    setSelectedEnable(null);
    setErrors({});
    setSymbolList([]);
    setSelectedSymbol(null);
    setFeedValues(FeedData);
    setSelectedGroup([]);
    setSelectedFeedName('');
    setSelectedFeedNameFetch(null)
    setSelectedLeverage(null);
    setSwap('');
    setLotSize('');
    setLotSteps('');
    setVolMin('');
    setVolMax('');
    setCommission('');
  };

  const handleInputChange = (fieldName, value) => {
    setErrors(prevErrors => ({ ...prevErrors, [fieldName]: '' }));
    switch (fieldName) {
      case 'symbolName':
        setSymbolName(value);
        break;
      case 'swap':
        setSwap(value);
        break;
      case 'lotSize':
        setLotSize(value);
        break;
      case 'lotSteps':
        setLotSteps(value);
        break;
      case 'volMin':
        setVolMin(value);
        break;
      case 'volMax':
        setVolMax(value);
        break;
      case 'commission':
        setCommission(value);
        break;
      default:
        break;
    }
  };


  const fetchSingleTradingAccount = async () => {
    setIsLoading(true)
      debugger;
    const res = await Get_Single_Trading_Account(TradingAccountsIds[0], token)
    const { data: { message, payload, success } } = res

    setIsLoading(false)
    setStatesForEditMode(payload, success,)
  }
  const setStatesForEditMode = async (payload, success)=>{
    if (success) {
      setSymbolName(payload.name)
      
     
      const selectedLeverageOpt = LeverageList.find(x => x.title === payload.leverage)
      setSelectedLeverage(selectedLeverageOpt)
      setSelectedFeedName(SelectedFeedNameOption)
      const selectedEnab = EnabledList.find(item => item.id === (parseFloat(payload.enabled) ? 1 : 2));
      setSelectedEnable(selectedEnab)
      setLeverage(parseFloat(payload.leverage))
      setLotSize(payload.lot_size);
      setLotSteps(payload.lot_step);
      setVolMin(payload.vol_min);
      setVolMax(payload.vol_max);
      setSwap(payload.swap);
      setCommission(payload.commission);
    }
  }

 
  const handleNext = () => {
    if (currentIndex < ArrangedTradingAccountsData.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
      const payload = ArrangedTradingAccountsData[currentIndex + 1];
      setIsLoading(true)
      setTimeout(()=>{
        setIsLoading(false)
        setStatesForEditMode(payload, true,SymbolList, FeedNameList)
      }, 3000)
    }else{
      alert(`no next record found`)
    }
  };
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
      const payload = ArrangedTradingAccountsData[currentIndex - 1];
      setIsLoading(true)
      setTimeout(()=>{
        setIsLoading(false)
        setStatesForEditMode(payload, true,SymbolList, FeedNameList)
      }, 3000)
      
    }
  };

  useEffect(() => {
    if (TradingAccountsIds.length === 1 && parseInt(TradingAccountsIds[0]) === 0) { // save
      setIsDisabled(false)
    } else if (TradingAccountsIds.length === 1 && parseInt(TradingAccountsIds[0]) !== 0) { // single edit
      const cIndex = ArrangedTradingAccountsData.findIndex(item => parseInt(item?.id) === parseInt(TradingAccountsIds[0]))
      setCurrentIndex(cIndex)
      setIsDisabled(true)
      fetchSingleTradingAccount()
    } else { // mass edit
      setIsDisabled(true)
    }
  }, []);
  const handleSubmit = async () => {
    try {
      if (TradingAccountsIds.length < 2) {
        await validationSchema.validate({
          SymbolGroup: selectedGroup,
          symbolName: symbolName,
          feed_name: selectedFeedName,
          feed_name_fetch: selectedFeedNameFetch,
          Leverage: SelectedLeverage,
          swap: swap,
          lotSize: lotSize,
          lotSteps: lotSteps,
          volMin: volMin,
          volMax: volMax,
          commission: commission,
          enabled: Selectedenable
        }, { abortEarly: false });

        setErrors({});
      }

     const SymbolGroupData = { // passing 0 to all fields if thers no need to validtion for mass editcase pass 0 so backend skip update which records have 0
        name: symbolName ? symbolName : '',
        symbel_group_id: SelectedSymbol ? SelectedSymbol.id : '',
        feed_fetch_name: selectedFeedNameFetch ? selectedFeedNameFetch.id : '',
        speed_max: 'abc',
        lot_size: lotSize ? lotSize : '',
        lot_step: lotSteps ? lotSteps : '',
        commission: commission ? commission : '',
        enabled: Selectedenable ? Selectedenable.title = 'Yes' ? 1 : 0 : 0,
        leverage: SelectedLeverage ? SelectedLeverage.value : '',
        feed_name: selectedFeedName ? selectedFeedName.module : '',
        feed_server: selectedFeedName ? selectedFeedName.feed_server : '',
        swap: swap ? swap : '',
        vol_min: volMin ? volMin : '',
        vol_max: volMax ? volMax : '',
      };
      if (TradingAccountsIds.length === 1 && parseInt(TradingAccountsIds[0]) === 0) { // save 
        setIsLoading(true)
        const res = await SymbolSettingPost(SymbolGroupData, token);
        const { data: { message, success, payload } } = res;
        setIsLoading(false)
        if (success) {
          clearFields();
          CustomNotification({
            type: 'success',
            title: 'success',
            description: 'Symbol Setting Created Successfully',
            key: 2
          })
          // navigate('/symbol-settings')
        } else {
          setIsLoading(false)
          if (payload) {
            const { feed_fetch_name } = payload
            Selectedenable.title = 'Yes' ? 'Yes' : 'No',
              CustomNotification({
                type: 'error',
                title: message,
                description: feed_fetch_name[0],
                key: 1
              })
          } else {
            CustomNotification({
              type: 'Opsss...',
              title: message,
              description: message,
              key: 2
            })
          }
        }

      } else if (TradingAccountsIds.length >= 2) {
        setIsLoading(true)
        const Params = {
          table_name: 'symbel_settings',
          table_ids: TradingAccountsIds,
          ...SymbolGroupData
        }
        const res = await GenericEdit(Params, token)
        const { data: { message, success, payload } } = res;
        setIsLoading(false)
        if (res !== undefined) {
          if (success) {
            clearFields();
            CustomNotification({
              type: 'success',
              title: 'success',
              description: 'Symbol Setting Updated Successfully',
              key: 2
            })
            navigate('/trading-accounts')
          } else {
            setIsLoading(false)
            CustomNotification({
              type: 'error',
              title: 'error',
              description: message,
              key: `abc`
            })
          }
        }

      }
      else {
        setIsLoading(true)
        const res = await UpdateSymbolSettings(TradingAccountsIds[0], SymbolGroupData, token);
        const { data: { message, success, payload } } = res;
        setIsLoading(false)
        if (success) {
          clearFields();
          CustomNotification({
            type: 'success',
            title: 'success',
            description: 'Symbol Setting Updated Successfully',
            key: 2
          })
          // navigate('/symbol-settings')
           setIsDisabled(true)
        } else {
          setIsLoading(false)
          CustomNotification({
            type: 'error',
            title: 'error',
            description: message,
            key: `abc`
          })
        }

      }

    } catch (err) {
      const validationErrors = {};
      err.inner?.forEach(error => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
    }
  };
  const GetSymbolData = async (direction, access_key) => {
    if (direction === 'binance') {
      const res = await GetCryptoData()
      const mData = res?.data?.symbols
      const updatedData = mData.map((item) => {
        return { ...item, id: item.symbol };
      });
      setFeedNameFetchList(updatedData)
    } else if (direction === 'fcsapi') {
      const res = await GetFasciData(access_key)

      // setFoxiTypesLists(res)
      setFeedNameFetchList(res)
    }

  }
  const GetAskBid = async (symbol) => {
    const res = await GetAskBidData(symbol)
    const { data: { askPrice, bidPrice } } = res
    setAskValue(askPrice)
    setBidValue(bidPrice)
  }
  const deleteHandler = ()=>{
    const Params = {
      table_name:'symbel_settings',
      table_ids: [ArrangedTradingAccountsData[currentIndex].id]
    }
    
    CustomBulkDeleteHandler(Params,token,GenericDelete, setIsLoading )
    dispatch(deleteSymbolSettingsById(ArrangedTradingAccountsData[currentIndex].id))
    if(ArrangedTradingAccountsData.length === 0 || ArrangedTradingAccountsData === undefined || ArrangedTradingAccountsData === null){
       navigate("/symbol-settings")
    }else{
      if(currentIndex < ArrangedTradingAccountsData.length)
      handleNext()
      else
      handlePrevious()
    }
    

  }
  const items = [
    
    {
      key: '1',
      label: (
        <button rel="noopener noreferrer" onClick={()=>{
          setIsDisabled(false)
        }}>   Edit </button>
      ),
    },
    {
      key: '2',
      label: (
        <button  rel="noopener noreferrer" onClick={deleteHandler} >   Delete  </button>
      ),
    },
   
  ];
  const cancleHandler= ()=>{
    if(isDisabled){
      navigate('/trading-accounts')

    }else{
      setIsDisabled(true)
    }
  }
  return (
    <Spin spinning={isLoading} size="large">
      <div className='p-8' style={{ backgroundColor: colorBG }}>
        <div className='flex justify-between'>
          <div className='flex gap-3 items-center'>
            <img
              src={ARROW_BACK_CDN}
              alt='back icon'
              className='cursor-pointer'
              onClick={() => navigate("/symbol-settings")}
            />
            {
              isDisabled ? <h1 className='text-2xl font-semibold'>Preview Trading Accounts List</h1> :
                <h1 className='text-2xl font-semibold'>{TradingAccountsIds.length === 1 && parseInt(TradingAccountsIds[0]) === 0 ? 'Add Trading Account' : 'Edit Trading Setting'}</h1>
            }
          </div>
          {/* toolbar */}
          {(isDisabled && TradingAccountsIds.length > 1) && <EditOutlined className='cursor-pointer' onClick={()=> setIsDisabled(false)} />}
          {(TradingAccountsIds.length === 1 && parseInt(TradingAccountsIds[0]) !== 0)  &&
            <div className='flex gap-4 bg-gray-100 py-2 px-4 rounded-md mb-4' >
          {isDisabled && <LeftOutlined className='text-[24px] cursor-pointer' onClick={handlePrevious} />}
            {isDisabled && <RightOutlined className='text-[24px] cursor-pointer' onClick={handleNext} />}
            <Dropdown
              menu={{
                items,
              }}
              placement="bottom"
              arrow
              trigger={['click']}
              
            >
              <div className='bg-gray-200 p-2 px-4 rounded-md cursor-pointer'> <EllipsisOutlined /> </div>
          </Dropdown>
          </div>
          }
        
        </div>
        <div className='border rounded-lg p-4'>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
           
             { Control.map(val=>{
            const ComponentToRender = ComponentMap[val.control]
             const shouldDisplay =
            val.display === 'show' &&
            (userRole === 'admin' || (userRole === 'brand' && val.name !== 'brand'));

         return  shouldDisplay && (
              val.control === 'CustomAutocomplete'  ?(
            <div key={val.id}>
              <ComponentToRender
              name={val.name} 
              variant={val.varient} 
              label={val.label}
              options={val.options}
              getOptionLabel={(option) => val.getOptionLabel(option)}
              onChange={(e,value) => val.onChange(e,value)} 
              />
              {errors.marginCall && <span style={{ color: 'red' }}>{errors.marginCall}</span>}
            </div>)

            :
              ( 
              <div key={val.id}>
              <ComponentToRender
              name={val.name} 
              varient={val.varient} 
              label={val.label}
              options={val.options}
              getOptionLabel={(option) => val.getOptionLabel(option)}
              onChange={(e,value) => val.onChange(e,value)} 
              />
              {errors.symbol && <span style={{ color: 'red' }}>{errors.symbol}</span>}
            </div>
              )
            )})
          }


          </div>
          {
            !isDisabled &&  <div className='flex justify-center items-center sm:justify-end flex-wrap gap-4 mt-6'>
            <CustomButton
              Text={ TradingAccountsIds.length === 1 && parseInt(TradingAccountsIds[0]) === 0 ? 'Submit' : 'Update'}
              style={{
                padding: '16px',
                height: '48px',
                width: '200px',
                borderRadius: '8px',
                zIndex: '100'
              }}
              disabled={isDisabled}
              onClickHandler={handleSubmit}
            />
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
              onClickHandler={cancleHandler}
            />
          </div>
          }
         
        </div>
      </div>
    </Spin>
  )
}

export default TradingAccountsEntry
