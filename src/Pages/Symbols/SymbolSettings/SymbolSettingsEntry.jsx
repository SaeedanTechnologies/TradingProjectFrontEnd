import { theme, Spin } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';

import ARROW_BACK_CDN from '../../../assets/images/arrow-back.svg';
import CustomTextField from '../../../components/CustomTextField';
import CustomAutocomplete from '../../../components/CustomAutocomplete';
import { AutocompleteDummyData, LeverageList } from '../../../utils/constants';
import CustomButton from '../../../components/CustomButton';
import { Feed_Data_List, SelectSymbolSettingsWRTID, SymbolSettingPost, Symbol_Group_List, UpdateSymbolSettings } from '../../../utils/_SymbolSettingAPICalls';
import { GetAskBidData, GetCryptoData, GetFasciData } from '../../../utils/_ExchangeAPI'
import { useSelector } from 'react-redux';
import CustomNotification from '../../../components/CustomNotification';

const FeedData = [
  { feed_name: "First", server: 'First server' },
  { feed_name: "Second", server: 'Second server' },
  { feed_name: "Third", server: 'Third server' },
]


const SymbolSettingsEntry = () => {
  const token = useSelector(({ user }) => user?.user?.token)
  const { id } = useParams()
  const {
    token: { colorBG, TableHeaderColor, Gray2, colorPrimary },
  } = theme.useToken();
  const navigate = useNavigate()
 
  const [feedNameFetchList, setFeedNameFetchList] = useState([])
  const [selectedFeedNameFetch, setSelectedFeedNameFetch] = useState(null)

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
      if (parseInt(id) !== 0) {
        fetchSymbolSettingsWRTID(SymbolList,payload.data)
  
      }
      
    } catch (error) {
      console.error('Error fetching symbol groups:', error);
    }
  }
  const fetchSymbolSettingsWRTID = async (SymbList, feedlist) => {
    if (id !== 0) {
      setIsLoading(true)
      const res = await SelectSymbolSettingsWRTID(id, token)
      const { data: { message, payload, success } } = res
      setIsLoading(false)
      if (success) {
        setSymbolName(payload.name)
        const selectedGroup = SymbList.find(x => x.id === payload.symbel_group_id)
        setSelectedSymbol(selectedGroup)
        const SelectedFeedNameOption = feedlist.find(x=> x.name === payload.feed_name)
        if (payload.feed_name === 'binance') {
          const res = await GetCryptoData()
          const mData = res?.data?.symbols
          const updatedData = mData.map((item) => {
            return { ...item, id: item.symbol };
          });
          setFeedNameFetchList(updatedData)
          const selectedSymb = mData.find(x=> x.symbol === payload.feed_fetch_name) 
          setSelectedFeedNameFetch(selectedSymb)
        }
        const selectedLeverageOpt = LeverageList.find(x=> x.title === payload.leverage)
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
  }

  const fetchSymbolGroups = async () => {
    try {
      const res = await Symbol_Group_List(token);
      const { data: { message, success, payload } } = res
      setSymbolList(payload.data);
      if (parseInt(id) !== 0) {
        fetchSymbolSettingsWRTID(payload.data)
      }
    } catch (error) {
      console.error('Error fetching symbol groups:', error);
    }
  };
  useEffect(() => {
    fetchSymbolGroups();
    fetchFeedData();
    if (parseInt(id) !== 0) {
      setIsDisabled(true)
      fetchSymbolSettingsWRTID()
    }
  }, [id]);
  const handleSubmit = async () => {
    try {
      await validationSchema.validate({
        SymbolGroup: selectedGroup,
        symbolName: symbolName,
        feed_name: selectedFeedName,
        feed_name_fetch: selectedFeedNameFetch,
        Leverage : SelectedLeverage,
        swap: swap,
        lotSize: lotSize,
        lotSteps: lotSteps,
        volMin: volMin,
        volMax: volMax,
        commission: commission,
        enabled: Selectedenable
      }, { abortEarly: false });

      setErrors({});
      const SymbolGroupData = {
        name: symbolName,
        symbel_group_id: SelectedSymbol.id,
        feed_fetch_name: selectedFeedNameFetch.id,
        speed_max: 'abc',
        lot_size: lotSize,
        lot_step: lotSteps,
        commission: commission,
        enabled: Selectedenable.title = 'Yes' ? 1 : 0,
        leverage: SelectedLeverage.value,
        feed_name: selectedFeedName ? selectedFeedName.module : '',
        feed_server: selectedFeedName ? selectedFeedName.feed_server : '',
        swap: swap,
        vol_min: volMin,
        vol_max: volMax

      };
      if (parseInt(id) === 0) {
        setIsLoading(true)
        const res = await SymbolSettingPost(SymbolGroupData, token);

        const { data: { message, success, payload } } = res;
        setIsLoading(false)
        if (success) {
          clearFields();
          navigate('/symbol-settings')
        } else {
          setIsLoading(false)
          if(payload){
            const {feed_fetch_name} = payload
            Selectedenable.title = 'Yes' ? 'Yes' : 'No',
            CustomNotification({
              type: 'error',
              title: message, 
              description: feed_fetch_name[0], 
              key: 1
            })
          }else{
            CustomNotification({
              type: 'Opsss...',
              title: message, 
              description: message, 
              key: 2
            })
          }
        }

      } else {
        setIsLoading(true)
        const res = await UpdateSymbolSettings(id, SymbolGroupData, token);

        const { data: { message, success, payload } } = res;
        setIsLoading(false)
        if (success) {
          clearFields();
          navigate('/symbol-settings')
        } else {
          setIsLoading(false)
          alert(message);
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
      {/*
      const { filters } = selectedGroup
      const stepSize = filters.find(filter => filter.filterType === 'LOT_SIZE').stepSize;
      setLotSize(stepSize)
      const volMinium = filters.find(filter => filter.filterType === 'NOTIONAL').minNotional;
      setVolMin(volMinium)
      const volMaximum = filters.find(filter => filter.filterType === 'NOTIONAL').maxNotional;
      setVolMax(volMaximum)
      */}

    }else if(direction === 'fcsapi'){
      const res = await GetFasciData(access_key)
      const mData = res?.data?.response
      setFeedNameFetchList(mData)
    }

  }
  const GetAskBid = async (symbol)=>{
     const res = await GetAskBidData(symbol)
     const {data: {askPrice, bidPrice}} = res
     setAskValue(askPrice)
     setBidValue(bidPrice)
  }

  return (
    <Spin spinning={isLoading} size="large">
      <div className='p-8' style={{ backgroundColor: colorBG }}>
        <div className='flex gap-3 items-center'>
          <img
            src={ARROW_BACK_CDN}
            alt='back icon'
            className='cursor-pointer'
            onClick={() => navigate(-1)}
          />
          {
          isDisabled  ? <h1 className='text-2xl font-semibold'>Preview Symbol Setting</h1> :
          <h1 className='text-2xl font-semibold'>{parseInt(id) === 0 ? 'Add Symbol Setting' : 'Edit Symbol Setting'}</h1>
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
             {/* <CustomAutocomplete
                key={2}
                name="name"
                label="Symbol Name"
                variant="standard"
                options={groupList}
                getOptionLabel={(option) => option.symbol ? option.symbol : ""}
                value={selectedGroup}
                onChange={(event, value) => {
                  if (value) {
                    setSelectedGroup(value);
                    setErrors(prevErrors => ({ ...prevErrors, name: "" }))
                  } else {
                    setSelectedGroup(null);

                  }

                }}
              />
              {errors.symbel_group_id && <span style={{ color: 'red' }}>{errors.symbel_group_id}</span>}*/}
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
                    setSelectedFeedName(value);
                    GetSymbolData(value.module, value.feed_login)
                    setErrors(prevErrors => ({ ...prevErrors, feed_name: "" }))
                  } else {
                    setSelectedFeedName(null);
                  }

                }}

              />

              {errors.feed_name && <span style={{ color: 'red' }}>{errors.feed_name}</span>}
            </div>


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
                    GetAskBid(value.symbol)
                  } else {
                    setSelectedFeedNameFetch(null);
                  }

                }}

              />
              {errors.feed_name_fetch && <span style={{ color: 'red' }}>{errors.feed_name_fetch}</span>}
            </div>
            <div>
            <CustomAutocomplete
                name='Leverage'
                variant='standard'
                label='Select Leverage'
                disabled={isDisabled}
                options={LeverageList}
                getOptionLabel={(option) => option.title ? option.title : ""}
                value={ SelectedLeverage} 
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
           {askValue > 0 &&  <span className='text-sm text-green-500 font-semibold'>Ask Price is {askValue} and Bid Price is {bidValue}</span>} 

          </div>
          <div className='flex justify-center items-center sm:justify-end flex-wrap gap-4 mt-6'>
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
              onClickHandler={() => navigate(-1)}
            />
            <CustomButton
              Text={isDisabled  ? 'Edit' : parseInt(id) === 0 ? 'Submit' : 'Update' }
              style={{
                padding: '16px',
                height: '48px',
                width: '200px',
                borderRadius: '8px',
                zIndex: '100'
              }}
              onClickHandler={()=>{
               if(isDisabled){
                  setIsDisabled(false)
              }else{
                handleSubmit()
              }
              }}
            />
          </div>
        </div>
      </div>
    </Spin>
  )
}

export default SymbolSettingsEntry
