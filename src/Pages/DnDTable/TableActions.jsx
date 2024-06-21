import React, { useState } from 'react';
import { Button, Dropdown, Select, Space } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import { CheckBrandPermission } from '../../utils/helpers';
import { useSelector } from 'react-redux';
import CustomButton from '../../components/CustomButton';
import { useNavigate } from 'react-router-dom';


const TableActions = ({tableName,backendColumns,setIsRearangments,  setIsAddRemove, selectedRows, MassEditHandler, MassDeleteHandler, setPerPage, editPermissionName, deletePermissionName, direction, MassCloseOrdersHandler,addButton, hideDeleteEdit }) =>{
  const navigate = useNavigate()
  const [SelectedOption, setSelectedOption] = useState(10)
  const userRole = useSelector((state)=>state?.user?.user?.user?.roles[0]?.name)
  const userPermissions = useSelector((state)=>state?.user?.user?.user?.permissions)
  const items = [
    {
      key: '1',
      label: (
        <button className='w-full text-left' rel="noopener noreferrer" onClick={()=> setIsRearangments(true)}>  Rearangments  </button>
      ),
    },
    {
      key: '2',
      label: (
        <button className='w-full text-left' rel="noopener noreferrer"  onClick={()=> setIsAddRemove(true)}>  Add Remove Columns  </button>
      ),
    },
    selectedRows?.length > 0 && CheckBrandPermission(userPermissions,userRole,editPermissionName) && (!hideDeleteEdit)  && {
      key: '3',
      label: (
        <button className='w-full text-left' rel="noopener noreferrer" onClick={MassEditHandler}>   Edit </button>
      ),
    },
    (selectedRows?.length > 0 && CheckBrandPermission(userPermissions,userRole,deletePermissionName)&& (!hideDeleteEdit))  && {
      key: '4',
      label: (
        <button className='w-full text-left' rel="noopener noreferrer"  onClick={MassDeleteHandler}>   Delete  </button>
      ),
    },
    (selectedRows?.length > 0 && CheckBrandPermission(userPermissions,userRole,deletePermissionName) && (direction ==='/single-trading-accounts/details/live-order-entry' || direction ==="/live-orders-entry")) &&{
      key: '5',
      label: (
        <button className='w-full text-left' rel="noopener noreferrer"  onClick={MassCloseOrdersHandler}>   Close  </button>
      ),
    },
   
  ];
  const handleNavigate = () => {
    // localStorage.setItem("columns", )
    navigate('/import-csv', {state:{backendColumns, tableName }})
  }
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
    <div className='flex gap-3 justify-end items-center'>
    <div>
    {addButton && addButton()}
    </div>
    <div>
     {
      direction !== "/single-trading-accounts/details/live-order-entry" && <Select
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
     }  
    
    <Dropdown
      menu={{
        items,
      }}
      placement="bottom"
      arrow
      trigger={['click']}
      className='mb-3'
    >
      <Button> 
        <div className='flex items-center gap-2'>
          <span>More</span>
          <CaretDownOutlined />
        </div>
        
     </Button>
    </Dropdown>

   
    </div>
     <CustomButton
        Text={"Import"}
        className='mb-3'
        onClickHandler={handleNavigate}
      />
    </div>
);
}


export default TableActions;