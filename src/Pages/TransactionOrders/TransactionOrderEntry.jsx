import React, { useState,useEffect } from 'react'
import { theme,Dropdown } from 'antd';
import CustomTextField from '../../components/CustomTextField'
import CustomAutocomplete from '../../components/CustomAutocomplete'
import { AutocompleteDummyData } from '../../utils/constants';
import CustomPhoneNo from '../../components/CustomPhoneNo';
import { TextField } from '@mui/material';
import CustomButton from '../../components/CustomButton';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ARROW_BACK_CDN from '../../assets/images/arrow-back.svg'
import { Trading_Transaction_Order } from '../../utils/_SymbolSettingAPICalls';
import { LeftOutlined, RightOutlined, EllipsisOutlined } from '@ant-design/icons';
import { TransactionOrderValidationSchema } from '../../utils/validations';
import CustomNotification from '../../components/CustomNotification';


const TransactionOrderEntry = () => {
  const {
    token: { colorBG, TableHeaderColor, Gray2  },
  } = theme.useToken();
  const navigate = useNavigate()
  const [GroupList, setGroupList] = useState(AutocompleteDummyData)
  const [SelectedGroup, setSelectedGroup] = useState(null)
  const [CountryList, setCountryList] = useState(AutocompleteDummyData)
  const [SelectedCountry, setSelectedCountry] = useState(null)
  const [TypeList, setTypeList] = useState(AutocompleteDummyData)
  const [setSelectedType, setsetSelectedType] = useState(null)
  const [CurencyList, setCurencyList] = useState(AutocompleteDummyData)
  const [SelectedCurrency, setSelectedCurrency] = useState(null)
  const TransactionOrdersIds = useSelector(({ transactionOrders }) => transactionOrders.selectedRowsIds)
  const TransactionOrdersData = useSelector(({transactionOrders})=> transactionOrders.transactionOrdersData)
  const ArrangedTransactionOrdersData= TransactionOrdersData.slice().sort((a, b) => a.id - b.id);
  const [isDisabled, setIsDisabled] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [transactionData,setTransactionData ] = useState([])


  const Control = [
    {id: 1, control:'CustomTextField',  label:'Name', varient: 'standard'  },
    {id: 2, control:'CustomTextField',  label:'Login ID', varient: 'standard'  },
    {id: 3, control:'CustomTextField',  label:'Order ID', varient: 'standard'  },
    {
       id: 4, 
       control:'CustomAutocomplete',
       name:'Group',   
       label:'Group', 
       varient: 'standard',
       options:GroupList,
       getOptionLabel:(option) => option.title ? option.title : "",
       onChange:(e,value) =>{
         if(value){
             setSelectedGroup(value)
         }
         else{
             setSelectedGroup(null)
         } 
         }   
     },
     {
       id: 5, 
       control:'CustomAutocomplete',
       name:'Country',   
       label:'Country', 
       varient: 'standard',
       options:CountryList,
       getOptionLabel:(option) => option.title ? option.title : "",
       onChange:(e,value) =>{
         if(value){
             setSelectedCountry(value)
         }
         else{
             setSelectedCountry(null)
         } 
         }   
     },
     {
       id: 6, 
       control:'CustomPhoneNo',
     }, 
     {id: 7, control:'CustomTextField',  label:'Email', varient: 'standard'  },
     {id: 8, control:'CustomTextField',  label:'Time', varient: 'standard'  },
     {
      id: 9, 
      control:'CustomAutocomplete',
      name:'Type',   
      label:'Type', 
      varient: 'standard',
      options:TypeList,
      getOptionLabel:(option) => option.title ? option.title : "",
      onChange:(e,value) =>{
        if(value){
            setSelectedType(value)
        }
        else{
            setSelectedType(null)
        } 
        }   
    },
    {id: 10, control:'CustomTextField',  label:'Method', varient: 'standard'  },
    {id: 11, control:'CustomTextField',  label:'Amount', varient: 'standard'  },
    {
      id: 12, 
      control:'CustomAutocomplete',
      name:'Curency',   
      label:'Curency', 
      varient: 'standard',
      options:CurencyList,
      getOptionLabel:(option) => option.title ? option.title : "",
      onChange:(e,value) =>{
        if(value){
            setSelectedCurrency(value)
        }
        else{
            setSelectedCurrency(null)
        } 
        }   
    },
 ]
 const ComponentMap = {
  CustomTextField: CustomTextField,
  CustomAutocomplete: CustomAutocomplete,
  CustomPhoneNo: CustomPhoneNo,
};


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

const fetchTransactionOrder = async (brandId,page) => {

    const res = await Trading_Transaction_Order(token,brandId,page)
    const { data: { message, payload, success } } = res
    if (success) {
        setTransactionData(payload.data)
    }
  }

useEffect(() => {
    if (TransactionOrdersIds.length === 1 && parseInt(TransactionOrdersIds[0]) === 0) { // save
      setIsDisabled(false)
    } else if (TransactionOrdersIds.length === 1 && parseInt(TransactionOrdersIds[0]) !== 0) { // single edit
      const cIndex = ArrangedTransactionOrdersData.findIndex(item => parseInt(item.id) === parseInt(TransactionOrdersIds[0]))
      setCurrentIndex(cIndex)
      setIsDisabled(true)
      fetchTransactionOrder()
    } else { // mass edit
      setIsDisabled(true)
    }
  }, []);

   const setStatesForEditMode = async (payload, success, SymbList, feedlist)=>{
    if (success) {
      setSymbolName(payload.name)
      const selectedGroup = SymbList?.find(x => x?.id === payload.symbel_group_id)
      setSelectedSymbol(selectedGroup)
      const SelectedFeedNameOption = feedlist?.find(x => x?.name === payload.feed_name)
      if (payload.feed_name === 'binance') {
        const res = await GetCryptoData()
        const mData = res?.data?.symbols
        const updatedData = mData.map((item) => {
          return { ...item, id: item.symbol };
        });
        setFeedNameFetchList(updatedData)
        const selectedSymb = updatedData.find(x => x.symbol === payload.feed_fetch_name)
        setSelectedFeedNameFetch(selectedSymb)
      }
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
    if (currentIndex < ArrangedTransactionOrdersData.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
      const payload = ArrangedTransactionOrdersData[currentIndex + 1];
      setIsLoading(true)
      setTimeout(()=>{
        setIsLoading(false)
        // setStatesForEditMode(payload, true,SymbolList, FeedNameList)
      }, 3000)
    }else{
      alert(`no next record found`)
    }
  };

 const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
      const payload = ArrangedTransactionOrdersData[currentIndex - 1];
      setIsLoading(true)
      setTimeout(()=>{
        setIsLoading(false)
        // setStatesForEditMode(payload, true,SymbolList, FeedNameList)
      }, 3000)
      
    }
  };

const deleteHandler = ()=>{
    const Params = {
      table_name:'symbel_settings',
      table_ids: [ArrangedSymbolSettingsData[currentIndex].id]
    }
    
    CustomBulkDeleteHandler(Params,token,GenericDelete, setIsLoading )
    dispatch(deleteSymbolSettingsById(ArrangedSymbolSettingsData[currentIndex].id))
    if(ArrangedSymbolSettingsData.length === 0 || ArrangedSymbolSettingsData === undefined || ArrangedSymbolSettingsData === null){
       navigate("/symbol-settings")
    }else{
      if(currentIndex < ArrangedSymbolSettingsData.length)
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

const handleSubmit = async () => {
    try {
      if (SymbolSettingIds.length < 2) {
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
      if (SymbolSettingIds.length === 1 && parseInt(SymbolSettingIds[0]) === 0) { // save 
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

      } else if (SymbolSettingIds.length >= 2) {
        setIsLoading(true)
        const Params = {
          table_name: 'symbel_settings',
          table_ids: SymbolSettingIds,
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
            navigate('/symbol-settings')
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
        const res = await UpdateSymbolSettings(SymbolSettingIds[0], SymbolGroupData, token);
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

  return (
    <div className='p-8' style={{backgroundColor: colorBG}}>
      
      <div className='flex justify-between'>
          <div className='flex gap-3 items-center'>
            <img
              src={ARROW_BACK_CDN}
              alt='back icon'
              className='cursor-pointer'
              onClick={() => navigate("/transaction-orders")}
            />
            {
              isDisabled ? <h1 className='text-2xl font-semibold'>Transaction Order</h1> :
                <h1 className='text-2xl font-semibold'>{TransactionOrdersIds.length === 1 && parseInt(TransactionOrdersIds[0]) === 0 ? 'Add Transaction Order' : 'Edit Transaction Order'}</h1>
            }
          </div>
          {/* toolbar */}
          {(isDisabled && TransactionOrdersIds.length > 1) && <EditOutlined className='cursor-pointer' onClick={()=> setIsDisabled(false)} />}
          {(TransactionOrdersIds.length === 1 && parseInt(TransactionOrdersIds[0]) !== 0)  &&
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


      <div className='bg-white border rounded-lg mt-6 p-4'>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {
            Control.map(val=> {
              const ComponentToRender = ComponentMap[val.control]
           return  val.control ===  'CustomAutocomplete' ?
              (
                <ComponentToRender
                name={val.name} 
                variant={val.varient} 
                label={val.label}
                options={val.options}
                getOptionLabel={(option) => val.getOptionLabel(option)}
                onChange={(e,value) => val.onChange(e,value)} 
                />
                ):(
                  <ComponentToRender
                name={val.name} 
                varient={val.varient} 
                label={val.label}
                options={val.options}
                getOptionLabel={(option) => val.getOptionLabel(option)}
                onChange={(e,value) => val.onChange(e,value)} 
                />
                )
            })
          }
            
        </div>
        <div className="grid grid-cols-1 gap-8 mt-8">
            <CustomTextField 
              label={"Comments"}
              varient={"outlined"}
              multiline={true}
              rows={4}
              />
        </div>
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
            Text={ TransactionOrdersIds.length === 1 && parseInt(TransactionOrdersIds[0]) === 0 ? 'Submit' : 'Update'}
            style={{
              padding: '16px',
              height: '48px',
              width: '200px',
              borderRadius: '8px',

            }}
            disabled={isDisabled}
            onClickHandler={handleSubmit}
          />

        </div>
      </div>
    </div>
  )
}

export default TransactionOrderEntry