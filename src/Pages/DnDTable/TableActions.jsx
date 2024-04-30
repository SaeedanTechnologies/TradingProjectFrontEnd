import React, { useState } from 'react';
import { Button, Dropdown, Select, Space } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';


const TableActions = ({setIsRearangments,  setIsAddRemove, selectedRows, MassEditHandler, MassDeleteHandler, setPerPage }) =>{
  const [SelectedOption, setSelectedOption] = useState(10)
  const items = [
    {
      key: '1',
      label: (
        <button rel="noopener noreferrer" onClick={()=> setIsRearangments(true)}>  Rearangments  </button>
      ),
    },
    {
      key: '2',
      label: (
        <button  rel="noopener noreferrer"  onClick={()=> setIsAddRemove(true)}>  Add Remove Columns  </button>
      ),
    },
    selectedRows?.length > 0 && {
      key: '3',
      label: (
        <button rel="noopener noreferrer" onClick={MassEditHandler}>   Edit </button>
      ),
    },
    selectedRows?.length > 0 && {
      key: '4',
      label: (
        <button  rel="noopener noreferrer"  onClick={MassDeleteHandler}>   Delete  </button>
      ),
    },
   
  ];
  const handleChange = (value) => {
    if(value){
      setPerPage(value)
      setSelectedOption(value)
    }else{
      setPerPage(10)
      setSelectedOption(null)
    }
  };
  return (
    <div>
       <Select
          style={{ width: 120 }}
          className='mr-3'
          onChange={handleChange}
          value={SelectedOption}
          options={[
            { value: '10', label: '10' },
            { value: '20', label: '20' },
            { value: '50', label: '50' },
            { value: '100', label: '100' },
          ]}
    />
    <Dropdown
      menu={{
        items,
      }}
      placement="bottom"
      arrow
      trigger={['click']}
      className='mb-3 mt-6'
    >
      <Button> 
        <div className='flex items-center gap-2'>
          <span>More</span>
          <CaretDownOutlined />
        </div>
        
     </Button>
    </Dropdown>

    </div>
);
}


export default TableActions;