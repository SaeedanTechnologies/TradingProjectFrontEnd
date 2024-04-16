import React, { useEffect, useState } from 'react';
import CustomTextField from '../../components/CustomTextField';
import CustomAutocomplete from '../../components/CustomAutocomplete';
import { Symbol_Group_List } from '../../utils/_SymbolGroupAPI';
import { useSelector } from 'react-redux';
import { Spin } from 'antd';

const TradingAccountModal = () => {
  const token = useSelector(({user})=> user?.user?.token )
  const [GroupList, setGroupList] = useState([]);
  const [SelectedGroup, setSelectedGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState('');
  const [massLeverage, setMassLeverage] = useState('')
  const [massSwap, setMassSwap] = useState('')

  useEffect(()=>{
    getSymbolGroups()
  },[])
  const getSymbolGroups = async()=>{
    setIsLoading(true)
    const res = await Symbol_Group_List(token)
    const {data:{success, message, payload}} = res
    setIsLoading(false)
    if(success){
      setGroupList(payload.data)
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
      />
      <span style={{color: 'red'}}>Required</span>
      </div>
      <div>
      <CustomAutocomplete 
       name='SymbolGroup'
       varient='standard'
       label='Symbol Group'
       options={GroupList}
       getOptionLabel={(option) => option.name ? option.name : ""}
       onChange={(e, value) => {
        if (value) {
          setSelectedGroup(value);
        } else {
          setSelectedGroup(null);
        }
      }}
      
      />
      <span style={{color: 'red'}}>Required</span>
      </div>
      <div>
      <CustomTextField
       name='name'
       varient='standard'
       label='Mass Leverage'
      />
      <span style={{color: 'red'}}>Required</span>
      </div>
       <div>
       <CustomTextField
       name='name'
       varient='standard'
       label='Mass Swap'
      />
       <span style={{color: 'red'}}>Required</span>
       </div>
      
    </div>
    </Spin>
  );
};

export default TradingAccountModal;
