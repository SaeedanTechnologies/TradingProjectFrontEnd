import React, { useState } from 'react';
import { Button, Dropdown, Space } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';


const TableActions = ({setIsRearangments, setIsMassEdit, setIsMassDelete, setIsAddRemove }) =>{
  const [MassEditMode, setMassEditMode] = useState(false)
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
        <button rel="noopener noreferrer" onClick={()=> {
          setMassEditMode(true)
        }}>  Mass Edit </button>
      ),
    },
    {
      key: '3',
      label: (
        <button  rel="noopener noreferrer"  onClick={()=> {
          setIsMassDelete(true)
        }}>  Mass Delete  </button>
      ),
    },
    {
      key: '4',
      label: (
        <button  rel="noopener noreferrer"  onClick={()=> setIsAddRemove(true)}>  Add Remove Columns  </button>
      ),
    },
  ];
  return (
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
      <span>{MassEditMode ? 'Mass Edit Mode':'Mass Delete Mode' 
        }</span>
        <EllipsisOutlined />
      </Button>
    </Dropdown>
);
}


export default TableActions;