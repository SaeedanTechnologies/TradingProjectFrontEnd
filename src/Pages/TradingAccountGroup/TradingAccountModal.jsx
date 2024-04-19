// ya modal h apna
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Spin } from 'antd';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import CustomTextField from '../../components/CustomTextField';
import CustomAutocomplete from '../../components/CustomAutocomplete';
import { Symbol_Group_List } from '../../utils/_SymbolGroupAPI';
import { useSelector } from 'react-redux';
import CustomButton from '../../components/CustomButton';
import { submitStyle } from '../Brand/style';
import { DeleteTradingAccountGroup, SaveTradingAccountGroups, SelectTradingAccountGroupWRTID, UpdateTradingAccountGroups, getAllTradingAccountsNotInGroup } from '../../utils/_TradingAccountGroupAPI';



const TradingAccountModal = ({ setIsModalOpen, fetchData, TradingGroupID }) => {
  const token = useSelector(({ user }) => user?.user?.token)
  const [GroupList, setGroupList] = useState([]);
  const [SelectedGroup, setSelectedGroup] = useState(null);
  const [AccountList, setAccountList] = useState([]);
  const [SelectedAccountList, setSelectedAccountList] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)
  const [name, setName] = useState('');
  const [massLeverage, setMassLeverage] = useState('')
  const [massSwap, setMassSwap] = useState('')
  const [errors, setErrors] = useState({});

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    SymbolGroup: Yup.array().required('Group is required'),
    // Account: Yup.array().required('Account is required'),
    massLeverage: Yup.string().required('Mass Leverage is required'),
    massSwap: Yup.string().required('Mass Swap is required')
  });
  const handleInputChange = (fieldName, value) => {
    setErrors(prevErrors => ({ ...prevErrors, [fieldName]: '' }));
    switch (fieldName) {
      case 'name':
        setName(value);
        break;
      case 'massLeverage':
        setMassLeverage(value);
        break;
      case 'massSwap':
        setMassSwap(value);
        break;
      default:
        break;
    }
  };
  const clearFields = () => {
    setName('')
    setMassLeverage('')
    setMassSwap('')
    setSelectedGroup(null)
    setSelectedAccountList(null)
    setErrors({})
    setIsDisabled(false)
  }
  useEffect(() => {
    clearFields()
    getSymbolGroups()
    getAccountList()
  }, [TradingGroupID])
  const fetchDataWRTID = async (AllGroups) => {
    setIsLoading(true)
    const res = await SelectTradingAccountGroupWRTID(TradingGroupID, token)
    const { data: { payload, message, success } } = res
    setIsDisabled(true)
    if (success) {
      setName(payload.name)
      setMassLeverage(payload.mass_leverage)
      setMassSwap(payload.mass_swap)
      const selectedOptions = AllGroups.filter(option => {
        return payload.symbel_groups.some(symbol => symbol.pivot.symbel_group_id === option.id);
      });
      setSelectedGroup(selectedOptions);
      setIsLoading(false)
    } else {
      notifyError(message)
    }
    setIsLoading(false)
  }
  const getSymbolGroups = async () => {
    setIsLoading(true)
    const res = await Symbol_Group_List(token)
    const { data: { success, message, payload } } = res
    setIsLoading(false)
    if (success) {
      setGroupList(payload.data)
      if(TradingGroupID !== 0){
        fetchDataWRTID(payload.data)
      }
    }
  }
  const getAccountList = async () => {
    setIsLoading(true)
    const res = await getAllTradingAccountsNotInGroup(token)
    const { data: { success, message, payload } } = res
    
    setIsLoading(false)
    if (success) {
      setAccountList(payload)
    }
  }
  const handleSumbit = async () => {
    try {
      await validationSchema.validate({
        SymbolGroup: SelectedGroup,
        name,
        massLeverage,
        massSwap, 
       // Account: SelectedAccountList
      }, { abortEarly: false });
      setErrors({})
      const TradingGroupData = {
        name,
        mass_leverage: massLeverage,
        mass_swap: massSwap,
        symbel_group_ids: SelectedGroup.map(item => item.id),
        trading_account_ids: SelectedAccountList ? SelectedAccountList.map(item => item.id) : []
      }
      if (TradingGroupID === 0) { // save
        setIsLoading(true)
        const res = await SaveTradingAccountGroups(TradingGroupData, token)
        const { data: { message, payload, success } } = res
        setIsLoading(false)
        if (success) {
          alert(message)
          clearFields()
          setIsModalOpen(false)
          fetchData()
        } else {
          alert(message)
        }

      } else { // update
        setIsLoading(true)
        const res = await UpdateTradingAccountGroups(TradingGroupID,TradingGroupData, token)
        const { data: { message, payload, success } } = res
        setIsLoading(false)
        if (success) {
          alert(message)
          clearFields()
          setIsModalOpen(false)
          fetchData()
        } else {
          alert(message)
        }
      }

    } catch (err) {
      const validationErrors = {};
      err.inner.forEach(error => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
    }
  }

  return (
    <Spin spinning={isLoading} size="large">
      <div className='flex flex-col gap-6'>
        <div>
          <CustomTextField
            name='name'
            varient='standard'
            label='Group Name'
            value={name}
            onChange={e => handleInputChange('name', e.target.value)}
          />
          {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
        </div>
        <div> 
        <Autocomplete
          multiple
          limitTags={2}
          id="symbolGroup"
          options={GroupList}
          getOptionLabel={(option) => option.name ? option.name : '' }
          value={SelectedGroup ??  []}
          onChange={(e, value) => {
            if (value) {
              setSelectedGroup(value);
              setErrors(prevErrors => ({ ...prevErrors, SymbolGroup: '' }));
            } else {
              setSelectedGroup(null);
              setErrors(prevErrors => ({ ...prevErrors, SymbolGroup: 'Symbol Group is requried' }));
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label="Symbol Group" placeholder="Symbol Group" variant="standard" />
          )}
          fullWidth
        />
          {errors.SymbolGroup && <span style={{ color: 'red' }}>{errors.SymbolGroup}</span>}
        </div>
        <div>
          <CustomTextField
            name='massLeverage'
            type={'number'}
            varient='standard'
            value={massLeverage}
            label='Mass Leverage'
            onChange={e => handleInputChange('massLeverage', e.target.value)}
          />
          {errors.massLeverage && <span style={{ color: 'red' }}>{errors.massLeverage}</span>}
        </div>
        <div>
          <CustomTextField
            name='massSwap'
            type={'number'}
            varient='standard'
            label='Mass Swap'
            value={massSwap}
            onChange={e => handleInputChange('massSwap', e.target.value)}
          />
          {errors.massSwap && <span style={{ color: 'red' }}>{errors.massSwap}</span>}
        </div>
        <div>
          <CustomAutocomplete
            multiple={true}
            name='accounts'
            variant='standard'
            label='Select Accounts'
            options={AccountList}
            disabled = {isDisabled}
            getOptionLabel={(option) => option.login_id ? option.login_id : ""}
            value={ SelectedAccountList} 
            onChange={(e, value) => {
              if (value) {
                setSelectedAccountList(value);
              } else {
                setSelectedAccountList(null);
              }
            }}
          />
         
        </div>
      </div>
      <div className='flex items-center justify-end gap-4'>
        <CustomButton
          Text={'Cancle'}
          style={{ backgroundColor: '#C5C5C5', borderColor: '#C5C5C5', color: '#fff', ...submitStyle }}
        />
        <CustomButton
          Text={'Submit'}
          style={submitStyle}
          onClickHandler={handleSumbit}
        />

      </div>
    </Spin>
  );
};

export default TradingAccountModal;
