import React, { useState } from 'react';
import { Button, Dropdown, Space } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';


const TableActions = ({setIsRearangments,  setIsAddRemove, selectedRows, MassEditHandler, MassDeleteHandler }) =>{
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
      <Button> <EllipsisOutlined /> </Button>
    </Dropdown>
);
}


export default TableActions;