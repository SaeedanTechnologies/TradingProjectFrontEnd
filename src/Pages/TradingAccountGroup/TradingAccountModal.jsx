import React, { useState } from 'react';
import CustomTextField from '../../components/CustomTextField';
import CustomAutocomplete from '../../components/CustomAutocomplete';

const TradingAccountModal = () => {
  const [GroupList, setGroupList] = useState([
    { id: 1, title: 'rea.848.USDT' },
    { id: 2, title: 'rea.849.USDT' },
    { id: 3, title: 'rea.850.USDT' },
    { id: 4, title: 'rea.851.USDT' }
  ]);
  const [SelectedGroup, setSelectedGroup] = useState(null);
  const Controls = [
    { id: 1, control: 'CustomTextField', label: 'Group Name', varient: 'standard' },
    {
      id: 2,
      control: 'CustomAutocomplete',
      name: 'SymbolGroup',
      varient: 'standard',
      label: 'Symbol Group',
      options: GroupList,
      getOptionLabel: (option) => option.title ? option.title : "",
      onChange: (e, value) => {
        if (value) {
          setSelectedGroup(value);
        } else {
          setSelectedGroup(null);
        }
      }
    },
    { id: 3, control: 'CustomTextField', label: 'Mass Laverage', varient: 'standard' },
    { id: 4, control: 'CustomTextField', label: 'Mass Swap', varient: 'standard' }
  ];
  const ComponentMap = {
    CustomTextField: CustomTextField,
    CustomAutocomplete: CustomAutocomplete,
  };
  return (
    <div className='flex flex-col gap-6'>
      {
        Controls.map(item => {
          const ComponentToRender = ComponentMap[item.control];
          return (
            <ComponentToRender
              key={item.id}
              name={item.name}
              varient={item.varient}
              label={item.label}
              options={item.options}
              getOptionLabel={(option) => item.getOptionLabel(option)}
              onChange={(e, value) => item.onChange(e, value)}
            />
          )
        })
      }
    </div>
  );
};

export default TradingAccountModal;
