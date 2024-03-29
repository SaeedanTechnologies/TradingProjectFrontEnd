import { theme } from 'antd';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import ARROW_BACK_CDN from '../../../assets/images/arrow-back.svg';
import CustomTextField from '../../../components/CustomTextField';
import CustomAutocomplete from '../../../components/CustomAutocomplete';
import { AutocompleteDummyData } from '../../../utils/constants';
import CustomButton from '../../../components/CustomButton';

const SymbolSettingsEntry = () => {
  const {
    token: { colorBG, TableHeaderColor, Gray2, colorPrimary  },
  } = theme.useToken();
  const navigate = useNavigate()
  const [SymbolList, setSymbolList] = useState(AutocompleteDummyData)
  const [SelectedSymbol, setSelectedSymbol] = useState(null)

  const [EnabledList, setEnabledList] = useState([
  {id: 1, title: 'Yes'},
  {id: 2, title: 'No'},

  ])
  const [Selectedenable, setSelectedEnable] = useState(null)

  const Controls = [
    {
      id: 1,
      control: 'CustomAutocomplete',
      name: 'SymbolGroup',
      label: 'Symbol Group Name',
      varient: 'standard',
      options: SymbolList,
      getOptionLabel: (option) => option.title ? option.title : "",
      onChange: (e, value) => {
        if (value) {
          setSelectedSymbol(value)
        }
        else {
          setSelectedSymbol(null)
        }
      }
    },
    { id: 2, control: 'CustomTextField', label: 'Symbol Group', varient: 'standard' },
    { id: 3, control: 'CustomTextField', label: 'Symbol Feed Name', varient: 'standard' },
    { id: 4, control: 'CustomTextField', label: 'Symbol Feed Name Fetch', varient: 'standard' },
    { id: 5, control: 'CustomTextField', label: 'Symbol Laverage', varient: 'standard' },
    { id: 6, control: 'CustomTextField', label: 'Symbol Swap', varient: 'standard' },
    { id: 7, control: 'CustomTextField', label: 'Lot Size', varient: 'standard' },
    { id: 8, control: 'CustomTextField', label: 'Lot Steps', varient: 'standard' },
    { id: 9, control: 'CustomTextField', label: 'Value Minimum', varient: 'standard' },
    { id: 10, control: 'CustomTextField', label: 'Value Maximum', varient: 'standard' },
    { id: 11, control: 'CustomTextField', label: 'Commision', varient: 'standard' },
    {
      id: 12,
      control: 'CustomAutocomplete',
      name: 'Enabled',
      label: 'Enabled',
      varient: 'standard',
      options: EnabledList,
      getOptionLabel: (option) => option.title ? option.title : "",
      onChange: (e, value) => {
        if (value) {
          setSelectedEnable(value)
        }
        else {
          setSelectedEnable(null)
        }
      }
    },
  ]

  const ComponentMap = {
    CustomTextField: CustomTextField,
    CustomAutocomplete: CustomAutocomplete,
  };

  return (
    <div className='p-8' style={{ backgroundColor: colorBG }}>
     <div className='flex gap-3'>
     <img 
        src={ARROW_BACK_CDN} 
        alt='back icon' 
        className='cursor-pointer'
        onClick={()=> navigate(-1)}
        />
      <h1 className='text-2xl font-semibold'>Symbol Group</h1>
    </div>
    <div className='border rounded-lg p-4'>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
        {
          Controls.map(val=>{
          const ComponentToRender = ComponentMap[val.control]
          return <ComponentToRender
          key={val.id} 
          name={val.name}
          varient={val.varient}
          label={val.label}
          options={val.options}
          value={val.value}
          getOptionLabel={(option) => val.getOptionLabel(option)}
          onChange={(e, value) => val.onChange(e, value)}
          />
          })
        }
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
            Text='Update'
            style={{
              padding: '16px',
              height: '48px',
              width: '200px',
              borderRadius: '8px',
            }}
          />

        </div>
    </div>
    </div>
  )
}

export default SymbolSettingsEntry