import { theme, Spin } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';

import ARROW_BACK_CDN from '../../../assets/images/arrow-back.svg';
import CustomTextField from '../../../components/CustomTextField';
import CustomAutocomplete from '../../../components/CustomAutocomplete';
import { AutocompleteDummyData } from '../../../utils/constants';
import CustomButton from '../../../components/CustomButton';
import { Feed_Data_List, SelectSymbolSettingsWRTID, SymbolSettingPost, Symbol_Group_List, UpdateSymbolSettings } from '../../../utils/_SymbolSettingAPICalls';
import { useSelector } from 'react-redux';

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
  const [EnabledList, setEnabledList] = useState([
    { id: 1, title: 'Yes' },
    { id: 2, title: 'No' },
  ])
  const [Selectedenable, setSelectedEnable] = useState(null)
  const [groupList, setGroupList] = useState(AutocompleteDummyData)
  const [errors, setErrors] = useState({});
  const [SymbolList, setSymbolList] = useState([])
  const [fetchData, setFetchData] = useState([])
  const [SelectedSymbol, setSelectedSymbol] = useState(null)
  const [feedValues, setFeedValues] = useState(FeedData)
  const [selectedGroup, setSelectedGroup] = useState([]);
  const [feedName, setFeedName] = useState('')
  const [feedNameFetch, setFeedNameFetch] = useState('')
  const [leverage, setLeverage] = useState('')
  const [swap, setSwap] = useState('')
  const [lotSize, setLotSize] = useState('')
  const [lotSteps, setLotSteps] = useState('')
  const [volMin, setVolMin] = useState('')
  const [volMax, setVolMax] = useState('')
  const [commission, setCommission] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const validationSchema = Yup.object().shape({
    SymbolGroup: Yup.object().required('Symbol Group is required'),
    symbel_group_id: Yup.object().required('Symbol Group Name is required'),
    feed_name: Yup.object().required('Symbol Feed Name is required'),
    feed_name_fetch: Yup.string().required('Symbol Feed Name Fetch is required'),
    leverage: Yup.string().required('Symbol Laverage is required'),
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
    setGroupList(AutocompleteDummyData);
    setErrors({});
    setSymbolList([]);
    setSelectedSymbol(null);
    setFeedValues(FeedData);
    setSelectedGroup([]);
    setFeedName('');
    setFeedNameFetch('');
    setLeverage('');
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
      case 'feed_name_fetch':
        setFeedNameFetch(value);
        break;
      case 'leverage':
        setLeverage(value);
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
      setFetchData(payload.data);
    } catch (error) {
      console.error('Error fetching symbol groups:', error);
    }
  }
  const fetchSymbolSettingsWRTID = async () => {
    if (id !== 0) {
      setIsLoading(true)
      const res = await SelectSymbolSettingsWRTID(id, token)
      const { data: { message, payload, success } } = res
      setIsLoading(false)
      if (success) {
        const selectedGroup = SymbolList.find(x => x.id === payload.name)
        setSelectedSymbol(selectedGroup)
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
  useEffect(() => {
    if (parseInt(id) !== 0) {
      fetchSymbolSettingsWRTID()

    }
  }, [id])
  const fetchSymbolGroups = async () => {
    try {
      const res = await Symbol_Group_List(token);
      const { data: { message, success, payload } } = res
      setSymbolList(payload.data);
    } catch (error) {
      console.error('Error fetching symbol groups:', error);
    }
  };
  useEffect(() => {
    fetchSymbolGroups();
    fetchFeedData();
  }, []);

  const handleSubmit = async () => {
    try {
      await validationSchema.validate({
        SymbolGroup: selectedGroup,
        symbel_group_id: SelectedSymbol,
        feed_name: feedName,
        feed_name_fetch: feedNameFetch,
        leverage: leverage,
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
        name: selectedGroup.title,
        symbel_group_id: SelectedSymbol.id,
        speed_max: 'abc',
        lot_size: lotSize,
        lot_step: lotSteps,
        commission: commission,
        enabled: Selectedenable.title = 'Yes' ? 1 : 0,
        leverage: leverage,
        feed_name: feedName ? feedName.name : '',
        feed_server: feedName ? feedName.feed_server : '',
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
          alert(message);
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


  return (
    <Spin spinning={isLoading} size="large">
      <div className='p-8' style={{ backgroundColor: colorBG }}>
        <div className='flex gap-3'>
          <img
            src={ARROW_BACK_CDN}
            alt='back icon'
            className='cursor-pointer'
            onClick={() => navigate(-1)}
          />
          <h1 className='text-2xl font-semibold'>Symbol Group</h1>
        </div>
        <div className='border rounded-lg p-4'>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
            <div>
              <CustomAutocomplete
                name="SymbolGroup"
                label="Symbol Group"
                variant="standard"
                options={SymbolList}
                value={SelectedSymbol}
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
              <CustomAutocomplete
                key={2}
                name="name"
                label="Symbol Name"
                variant="standard"
                options={groupList}
                getOptionLabel={(option) => option.title ? option.title : ""}
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
              {errors.symbel_group_id && <span style={{ color: 'red' }}>{errors.symbel_group_id}</span>}
            </div>
            <div>
              <CustomAutocomplete
                key={3}
                name={'feed_name'}
                label="Symbol Feed Name"
                variant="standard"
                options={fetchData}
                value={feedName}
                getOptionLabel={(option) => option.name ? option.name : ""}
                onChange={(event, value) => {
                  if (value) {
                    setFeedName(value);
                    setErrors(prevErrors => ({ ...prevErrors, feed_name: "" }))
                  } else {
                    setFeedName(null);
                  }

                }}

              />

              {errors.feed_name && <span style={{ color: 'red' }}>{errors.feed_name}</span>}
            </div>


            <div>

              <CustomTextField
                key={4}
                name={"feed_name_fetch"}
                label="Symbol Feed Name Fetch"
                varient="standard"
                onChange={(e) => handleInputChange("feed_name_fetch", e.target.value)}
              />
              {errors.feed_name_fetch && <span style={{ color: 'red' }}>{errors.feed_name_fetch}</span>}
            </div>
            <div>
              <CustomTextField
                key={5}
                name="leverage"
                label="Symbol Laverage"
                type={'number'}
                value={leverage}
                varient="standard"
                onChange={(e) => handleInputChange("leverage", e.target.value)}
              />
              {errors.leverage && <span style={{ color: 'red' }}>{errors.leverage}</span>}
            </div>
            <div>
              <CustomTextField
                name={'swap'}
                key={6}
                label="Symbol Swap"
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
                label="Value Minimum"
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
                label="Value Maximum"
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
              onClick={() => navigate(-1)}
            />
            <CustomButton
              Text='Update'
              style={{
                padding: '16px',
                height: '48px',
                width: '200px',
                borderRadius: '8px',
                zIndex: '100'
              }}
              onClickHandler={handleSubmit}
            />
          </div>
        </div>
      </div>
    </Spin>
  )
}

export default SymbolSettingsEntry
