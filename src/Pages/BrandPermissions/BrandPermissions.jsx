import { useCallback, useState } from "react";
import CustomPermissionTable from "../../components/CustomPermissionTable";
import { Space,Tag,theme,Checkbox  } from 'antd';
import ARROW_BACK_CDN from '../../assets/images/arrow-back.svg';
import { useNavigate, useParams } from "react-router-dom";
import CustomButton from "../../components/CustomButton";
import { SaveBrandPermission } from "../../utils/_PermissionAPI";
import { useSelector } from "react-redux";

const BrandPermissions = () => {

  const navigate = useNavigate()
  const token = useSelector(({ user }) => user?.user?.token)
  const {user_id} = useParams()



  const data = [
  {
    index: 0,
    module: 'Trading Account List',
    read:false,
    create:false,
    update:false,
    del:false
  },
  {
    index: 1,
    module: 'Trading Account Group',
    read:false,
    create:false,
    update:false,
    del:false
  },
  {
    index: 2,
    module: 'Active Account Group',
    read:false,
    create:false,
    update:false,
    del:false
  },
  {
    index: 3,
    module: 'Margin Call Trading Account',
    read:false,
    create:false,
    update:false,
    del:false
  },
   {
    index: 4,
    module: 'Live Orders',
    read:false,
    create:false,
    update:false,
    del:false
  },
   {
    index: 5,
    module: 'Close Orders',
    read:false,
    create:false,
    update:false,
    del:false
  },
   {
    index: 6,
    module: 'Transaction Orders',
    read:false,
    create:false,
    update:false,
    del:false
  },
  
];



  const [permissions,setPermissions ] = useState(data)

  const handleChange =useCallback((e,index,key) => {
    const updatedPermissions = [...permissions];
    updatedPermissions[index][key] = e.target.checked; 
    setPermissions(updatedPermissions);
  },[permissions]);


  const handleAllowPermission = async()=>{
    const PermissionData ={ brand_id:user_id,model_permission: 'create_trading_account'}
    const mData = await SaveBrandPermission(PermissionData,token)
    const { data: { message, payload, success } } = mData

  }
  

const columns = [
  {
    title: 'Module',
    dataIndex: 'module',
    key: 'module',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Public: Read',
    dataIndex: 'read',
    align: 'center',
    key: 'public_read',
    render: (_,{index,read} ) => (
      <div className="flex flex-row items-center justify-center">
        <Checkbox  checked = {read} onChange={(e) =>{ 
          handleChange(e,index,'read')} } />
        
       </div>
    ),
    
  },
  {
    title: 'Public: Create',
    dataIndex: 'create',
    align: 'center',
    key: 'public_create',
    render: (_, {index,create}) => (
      <div className="flex flex-row items-center justify-center">
        <Checkbox  checked = {create}  onChange={(e) => handleChange(e,index,'create')} />
       </div>
    ),
  },
  {
    title: 'Public: Update',
    dataIndex: 'update',
    align: 'center',
    key: 'public_create',
    render: (_, {index,update}) => (
      <div className="flex flex-row items-center justify-center">
        <Checkbox  checked = {update}  onChange={(e) => handleChange(e,index,'update')} />
       </div>
    ),
  },
  {
    title: 'Public: Delete',
    dataIndex: 'del',
    align: 'center',
    key: 'public_create_edit_delete',
    render: (_, {index,del}) => (
      <div className="flex flex-row items-center justify-center">
        <Checkbox  checked={del} onChange={(e) => handleChange(e,index,'del')} />
       </div>
    ),
  },

];





  

  const { token: { colorBG, TableHeaderColor, colorPrimary } } = theme.useToken();

  return (
      <div className='flex flex-col gap-5 p-8' style={{ backgroundColor: colorBG }}>
        <div className='flex flex-col sm:flex-row items-center gap-2 justify-between'>
          <div className='flex gap-3'>
          <img 
           src={ARROW_BACK_CDN} 
           alt='back icon' 
           className='cursor-pointer'
           onClick={() => navigate('/brand')}
           />
          <h1 className='text-2xl font-semibold'>Brand Permissions</h1>
          </div>
         
          <CustomButton
              Text='Allow Permission'
              onClickHandler={handleAllowPermission}
            />
        
        </div>
      
        <div>
          <CustomPermissionTable  columns={columns}  data={permissions}/> 
        </div>
       
      </div>
  )
}

export default BrandPermissions