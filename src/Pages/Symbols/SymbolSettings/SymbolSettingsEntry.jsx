import { theme, Spin, Dropdown } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { LeftOutlined, RightOutlined, EllipsisOutlined } from '@ant-design/icons';

import * as Yup from 'yup';

import ARROW_BACK_CDN from '../../../assets/images/arrow-back.svg';
import CustomTextField from '../../../components/CustomTextField';
import CustomAutocomplete from '../../../components/CustomAutocomplete';
import { LeverageList } from '../../../utils/constants';
import CustomButton from '../../../components/CustomButton';
import { Feed_Data_List, SelectSymbolSettingsWRTID, SymbolSettingPost, Symbol_Group_List, UpdateSymbolSettings } from '../../../utils/_SymbolSettingAPICalls';
import { GetAskBidData, GetCryptoData, GetFasciData } from '../../../utils/_ExchangeAPI'
import { useDispatch, useSelector } from 'react-redux';
import CustomNotification from '../../../components/CustomNotification';
import { Autocomplete, TextField } from '@mui/material'
import { GenericEdit, GenericDelete } from '../../../utils/_APICalls';
import { CustomBulkDeleteHandler, CustomDeleteDeleteHandler } from '../../../utils/helpers';
import { deleteSymbolSettingsById } from '../../../store/symbolSettingsSlice';
import { EditOutlined } from '@mui/icons-material';

const FeedData = [
  { feed_name: "First", server: 'First server' },
  { feed_name: "Second", server: 'Second server' },
  { feed_name: "Third", server: 'Third server' },
]


const SymbolSettingsEntry = () => {
  const token = useSelector(({ user }) => user?.user?.token)
  const SymbolSettingIds = useSelector(({ symbolSettings }) => symbolSettings.selectedRowsIds)
  const SymbolSettingsData = useSelector(({symbolSettings})=> symbolSettings.symbolSettingsData)
  const ArrangedSymbolSettingsData = SymbolSettingsData.slice().sort((a, b) => a.id - b.id);
  
  const {
    token: { colorBG },} = theme.useToken();
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [feedNameFetchList, setFeedNameFetchList] = useState([])
  const [selectedFeedNameFetch, setSelectedFeedNameFetch] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const [symbolName, setSymbolName] = useState('')
  const [SelectedLeverage, setSelectedLeverage] = useState(null)
  const [errors, setErrors] = useState({});
  const [SymbolList, setSymbolList] = useState([])
  const [FeedNameList, setFeedNameList] = useState([])
  const [selectedFeedName, setSelectedFeedName] = useState(null)
  const [SelectedSymbol, setSelectedSymbol] = useState(null)
  const [feedValues, setFeedValues] = useState(FeedData)
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
  const [isLoading, setIsLoading] = useState(false)
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

  const fetchFeedData = async () => {
    try {
      const res = await Feed_Data_List(token);
      const { data: { message, success, payload } } = res
      setFeedNameList(payload.data);
      if (SymbolSettingIds.length === 1 && parseInt(SymbolSettingIds[0]) !== 0) {
        fetchSymbolSettingsWRTID(SymbolList, payload.data)
      }

    } catch (error) {
      console.error('Error fetching symbol groups:', error);
    }
  }
  const fetchSymbolSettingsWRTID = async (SymbList, feedlist) => {
    setIsLoading(true)
    const res = await SelectSymbolSettingsWRTID(SymbolSettingIds[0], token)
    const { data: { message, payload, success } } = res
    setIsLoading(false)
    setStatesForEditMode(payload, success, SymbList, feedlist)
  }
  const setStatesForEditMode = async (payload, success, SymbList, feedlist)=>{
    if (success) {
      setSymbolName(payload.name)
      const selectedGroup = SymbList.find(x => x.id === payload.symbel_group_id)
      setSelectedSymbol(selectedGroup)
      const SelectedFeedNameOption = feedlist.find(x => x.name === payload.feed_name)
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

  const fetchSymbolGroups = async () => {
    try {
      const res = await Symbol_Group_List(token);
      const { data: { message, success, payload } } = res
      setSymbolList(payload.data);
      if (SymbolSettingIds.length === 1 && parseInt(SymbolSettingIds[0]) !== 0) {
        fetchSymbolSettingsWRTID(payload.data)
      }
    } catch (error) {
      console.error('Error fetching symbol groups:', error);
    }
  };
  const handleNext = () => {
    if (currentIndex < ArrangedSymbolSettingsData.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
      const payload = ArrangedSymbolSettingsData[currentIndex + 1];
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
      const payload = ArrangedSymbolSettingsData[currentIndex - 1];
      setIsLoading(true)
      setTimeout(()=>{
        setIsLoading(false)
        setStatesForEditMode(payload, true,SymbolList, FeedNameList)
      }, 3000)
      
    }
  };

  useEffect(() => {
    fetchSymbolGroups();
    fetchFeedData();
    if (SymbolSettingIds.length === 1 && parseInt(SymbolSettingIds[0]) === 0) { // save
      setIsDisabled(false)
    } else if (SymbolSettingIds.length === 1 && parseInt(SymbolSettingIds[0]) !== 0) { // single edit
      const cIndex = ArrangedSymbolSettingsData.findIndex(item => parseInt(item.id) === parseInt(SymbolSettingIds[0]))
      setCurrentIndex(cIndex)
      setIsDisabled(true)
      fetchSymbolSettingsWRTID()
    } else { // mass edit
      setIsDisabled(true)
    }
  }, []);
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
          navigate('/symbol-settings')
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
          CustomNotification({
            type: 'success',
            title: 'success',
            description: 'Symbol Setting Updated Successfully',
            key: 2
          })
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
  const cancleHandler= ()=>{
    if(isDisabled){
      navigate('/symbol-settings')

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
              isDisabled ? <h1 className='text-2xl font-semibold'>Preview Symbol Setting</h1> :
                <h1 className='text-2xl font-semibold'>{SymbolSettingIds.length === 1 && parseInt(SymbolSettingIds[0]) === 0 ? 'Add Symbol Setting' : 'Edit Symbol Setting'}</h1>
            }
          </div>
          {/* toolbar */}
          {(isDisabled && SymbolSettingIds.length > 1) && <EditOutlined className='cursor-pointer' onClick={()=> setIsDisabled(false)} />}
          {(SymbolSettingIds.length === 1 && parseInt(SymbolSettingIds[0]) !== 0)  &&
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
            <div>
              <CustomAutocomplete
                name="SymbolGroup"
                label="Select Group"
                variant="standard"
                options={SymbolList}
                value={SelectedSymbol}
                disabled={isDisabled}
                getOptionLabel={(option) => option.name ? option.name : ""}
                onChange={(event, value) => {
                  if (value) {
                    setSelectedSymbol(value);
                    setErrors(prevErrors => ({ ...prevErrors, SymbolGroup: "" }))
                  } else {
                    setSelectedSymbol(null);
                    setErrors(prevErrors => ({ ...prevErrors, SymbolGroup: "Symbol Group is Requried" }))
                  }
                }}
              />


              {errors.SymbolGroup && <span style={{ color: 'red' }}>{errors.SymbolGroup}</span>}
            </div>
            <div>
              <CustomTextField
                key={4}
                name={"symbolName"}
                label="Name"
                varient="standard"
                value={symbolName}
                disabled={isDisabled}
                onChange={(e) => handleInputChange("symbolName", e.target.value)}
              />
              {errors.symbolName && <span style={{ color: 'red' }}>{errors.symbolName}</span>}

            </div>
            <div>
              <CustomAutocomplete
                key={3}
                name={'feed_name'}
                label="Select Feed Name"
                variant="standard"
                disabled={isDisabled}
                options={FeedNameList}
                value={selectedFeedName}
                getOptionLabel={(option) => option.name ? option.name : ""}
                onChange={(event, value) => {
                  if (value) {
                    setSelectedFeedNameFetch(null);
                    setSelectedFeedName(value);
                    GetSymbolData(value.module, value.feed_login)
                    setErrors(prevErrors => ({ ...prevErrors, feed_name: "" }))
                  } else {
                    setSelectedFeedName(null);
                    setSelectedFeedNameFetch(null);
                  }

                }}

              />

              {errors.feed_name && <span style={{ color: 'red' }}>{errors.feed_name}</span>}
            </div>


            <>
              {selectedFeedName?.module === 'fcsapi' ? (
                <div>
                  <Autocomplete
                    id="grouped-demo"
                    fullWidth
                    variant="standard"
                    options={feedNameFetchList}
                    groupBy={(option) => option.group}
                    getOptionLabel={(option) => option.name}
                    value={selectedFeedNameFetch}
                    renderInput={(params) => <TextField {...params} variant="standard" label="Foxi Types" />}
                    onChange={(event, value) => {
                      if (value) {
                        setSelectedFeedNameFetch(value);
                        GetSymbolData(value.module, value.feed_login);
                      } else {
                        setSelectedFeedNameFetch(null);
                      }
                    }}
                  />
                  {errors.feed_name_fetch && <span style={{ color: 'red' }}>{errors.feed_name_fetch}</span>}
                </div>
              ) : (
                <div>
                  <CustomAutocomplete
                    key={3}
                    name={'feed_name_fetch'}
                    label="Select Symbols"
                    variant="standard"
                    disabled={isDisabled}
                    options={feedNameFetchList}
                    value={selectedFeedNameFetch}
                    getOptionLabel={(option) => option.symbol ? option.symbol : ""}
                    onChange={(event, value) => {
                      if (value) {
                        setSelectedFeedNameFetch(value);
                        GetAskBid(value.symbol);
                      } else {
                        setSelectedFeedNameFetch(null);
                      }
                    }}
                  />
                  {errors.feed_name_fetch && <span style={{ color: 'red' }}>{errors.feed_name_fetch}</span>}
                </div>
              )}
            </>

            <div>
              <CustomAutocomplete
                name='Leverage'
                variant='standard'
                label='Select Leverage'
                disabled={isDisabled}
                options={LeverageList}
                getOptionLabel={(option) => option.title ? option.title : ""}
                value={SelectedLeverage}
                onChange={(e, value) => {
                  if (value) {
                    setSelectedLeverage(value);
                    setErrors(prevErrors => ({ ...prevErrors, Leverage: '' }));
                  } else {
                    setSelectedLeverage(null);
                    setErrors(prevErrors => ({ ...prevErrors, Leverage: 'Leverage is Requried' }));
                  }
                }}
              />
              {errors.Leverage && <span style={{ color: 'red' }}>{errors.Leverage}</span>}
            </div>
            <div>
              <CustomTextField
                name={'swap'}
                key={6}
                label="Swap"
                disabled={isDisabled}
                type={'number'}
                value={swap}
                varient="standard"
                onChange={(e) => handleInputChange("swap", e.target.value)}
              />
              {errors.swap && <span style={{ color: 'red' }}>{errors.swap}</span>}
            </div>

            <div>
              <CustomTextField
                name={'lotSize'}
                key={7}
                label="Lot Size"
                type={'number'}
                disabled={isDisabled}
                value={lotSize}
                varient="standard"
                onChange={(e) => handleInputChange("lotSize", e.target.value)}
              />
              {errors.lot_size && <span style={{ color: 'red' }}>{errors.lot_size}</span>}
            </div>
            <div>
              <CustomTextField
                name={'lotSteps'}
                key={8}
                label="Lot Steps"
                disabled={isDisabled}
                value={lotSteps}
                type={'number'}
                varient="standard"
                onChange={(e) => handleInputChange("lotSteps", e.target.value)}
              />
              {errors.lot_step && <span style={{ color: 'red' }}>{errors.lot_step}</span>}
            </div>

            <div>
              <CustomTextField
                name={'volMin'}
                key={9}
                label="Vol Minimum"
                disabled={isDisabled}
                value={volMin}
                type={'number'}
                varient="standard"
                onChange={(e) => handleInputChange("volMin", e.target.value)}
              />
              {errors.vol_min && <span style={{ color: 'red' }}>{errors.vol_min}</span>}
            </div>
            <div>
              <CustomTextField
                name={'volMax'}
                key={10}
                label="Vol Maximum"
                disabled={isDisabled}
                value={volMax}
                type={'number'}
                varient="standard"
                onChange={(e) => handleInputChange("volMax", e.target.value)}
              />
              {errors.vol_max && <span style={{ color: 'red' }}>{errors.vol_max}</span>}
            </div>

            <div>
              <CustomTextField
                name={'commission'}
                label="Commision"
                disabled={isDisabled}
                value={commission}
                type={'number'}
                varient="standard"
                onChange={(e) => handleInputChange("commission", e.target.value)}
              />
              {errors.commission && <span style={{ color: 'red' }}>{errors.commission}</span>}
            </div>
            <div>
              <CustomAutocomplete
                label="Enabled"
                variant="standard"
                disabled={isDisabled}
                options={EnabledList}
                value={Selectedenable}
                getOptionLabel={(option) => option.title ? option.title : ""}
                onChange={(event, value) => {
                  setSelectedEnable(value);
                  setErrors(prevErrors => ({ ...prevErrors, enabled: "" }))
                }}

              />
              {errors.enabled && <span style={{ color: 'red' }}>{errors.enabled}</span>}
            </div>
            {askValue > 0 && <span className='text-sm text-green-500 font-semibold'>Ask Price is {askValue} and Bid Price is {bidValue}</span>}


          </div>
          {
            !isDisabled &&  <div className='flex justify-center items-center sm:justify-end flex-wrap gap-4 mt-6'>
            <CustomButton
              Text={ SymbolSettingIds.length === 1 && parseInt(SymbolSettingIds[0]) === 0 ? 'Submit' : 'Update'}
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

export default SymbolSettingsEntry
