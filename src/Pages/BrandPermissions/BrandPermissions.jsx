import { useCallback, useState } from "react";
import CustomPermissionTable from "../../components/CustomPermissionTable";
import { Space,Tag,theme,Checkbox  } from 'antd';
import ARROW_BACK_CDN from '../../assets/images/arrow-back.svg';
import { useNavigate } from "react-router-dom";
import CustomButton from "../../components/CustomButton";

const BrandPermissions = () => {

  const navigate = useNavigate()


  const data = [
  {
    index: 0,
    module: 'Trading Account',
    read_only:false,
    create_edit:false,
    del:false
  },
  {
    index: 1,
    module: 'Trading Orders',
    read_only:false,
    create_edit:false,
    del:false
  },
  {
    index: 2,
    module: 'Transaction Orders',
    read_only:false,
    create_edit:false,
    del:false,
  },
  {
    index: 3,
    module: 'Settings',
    read_only:false,
    create_edit:false,
    del:false,
  },
  
];



  const [permissions,setPermissions ] = useState(data)

  const handleChange =useCallback((e,index,key) => {
    const updatedPermissions = [...permissions];
    updatedPermissions[index][key] = e.target.checked; 
    setPermissions(updatedPermissions);
  },[permissions]);


  

const columns = [
  {
    title: 'Module',
    dataIndex: 'module',
    
    key: 'module',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Public: Read Only',
    dataIndex: 'public_read_only',
    align: 'center',
    key: 'public_read_only',
    render: (_,{index,read_only} ) => (
      <div className="flex flex-row items-center justify-center">
        <Checkbox  checked = {read_only} onChange={(e) =>{ 
          handleChange(e,index,'read_only')} } />
        
       </div>
    ),
    
  },
  {
    title: 'Public: Read Create/Edit',
    dataIndex: 'public_create_edit',
    align: 'center',
    key: 'public_create_edit',
    render: (_, {index,create_edit}) => (
      <div className="flex flex-row items-center justify-center">
        <Checkbox  checked = {create_edit}  onChange={(e) => handleChange(e,index,'create_edit')} />
       </div>
    ),
  },
  {
    title: 'Public:Read, Create/Edit, Delete',
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
            />
        
        </div>
      
        <div>
          <CustomPermissionTable  columns={columns}  data={permissions}/> 
        </div>
       
      </div>
  )
}

export default BrandPermissions