import React, { useEffect, useState } from 'react'
import { Space, Spin, theme } from 'antd';
import {PlusCircleOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons';

import CustomTable from '../../../components/CustomTable';
import CustomButton from '../../../components/CustomButton';
import { AddnewStyle } from '../../Brand/style';
import CustomTextField from '../../../components/CustomTextField';
import { Symbol_Group_List, DeleteSymbolsGroup } from '../../../utils/_SymbolGroupAPI';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { notifyError, notifySuccess } from '../../../utils/constants';
import Swal from 'sweetalert2';

const Index = () => {
  const {
    token: { colorBG, TableHeaderColor, Gray2, colorPrimary  },
  } = theme.useToken();
  const token = useSelector(({user})=> user?.user?.token )
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [SymbolList, setSymbolList] = useState([])
  const headerStyle = {
    background: TableHeaderColor, // Set the background color of the header
    color: 'black', // Set the text color of the header
  };
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: '1',
    },
    {
      title: 'Laverage',
      dataIndex: 'leverage',
      key: '2',
    },
    {
      title: 'Swap',
      dataIndex: 'swap',
      key: '3',
    },
    {
      title: 'Lot Size',
      dataIndex: 'lot_size',
      key: '4',
    },
    {
      title: 'Lot Steps',
      dataIndex: 'lot_step',
      key: '5',
    },
    {
      title: 'Minimum Value',
      dataIndex: 'vol_min',
      key: '6',
    },
    {
      title: 'Maximum Value',
      dataIndex: 'vol_max',
      key: '7',
    },
    {
      title: 'Symbol Group TI',
      dataIndex: 'trading_interval',
      key: '8',
    },
    {
      title: 'Symbols',
      render: (text)=> <Link to={'#'} className='text-sm font-semibold cursor-pointer' style={{color: colorPrimary }}>View Details</Link>,
      key: '9',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle" className='cursor-pointer'>
         <Link to={`/symbol-groups/${record.id}`}><EditOutlined style={{fontSize:"24px", color: colorPrimary }}  /></Link> 
           <DeleteOutlined style={{fontSize:"24px", color: colorPrimary }} onClick={()=> DeleteHandler(record.id)} />
        </Space>
      ),
    },
  ];

const FetchData = async () =>{
    setIsLoading(true)
    const res = await Symbol_Group_List(token)
  const {data:{message, payload, success}} = res
    setIsLoading(false)
    if(success){
      setSymbolList(payload.data)
    }
}
const DeleteHandler = async (id)=>{
  setIsLoading(true)
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#1CAC70",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then(async(result) => {
    if (result.isConfirmed) {
      const res = await DeleteSymbolsGroup(id, token)
      const {data:{success, message, payload}} = res
      setIsLoading(false)
      if(success){
        Swal.fire({
          title: "Deleted!",
          text: message,
          icon: "success"
        });
        FetchData()
      }else{
        Swal.fire({
          title: "Opps!",
          text: {message},
          icon: "error"
        });
      }
     
    }
  });
 
  setIsLoading(false)
 
}
useEffect(() => {
  FetchData()
}, [])

  return (
    <Spin spinning={isLoading} size="large">
    <div className='p-8' style={{ backgroundColor: colorBG }}>
    <div className='flex flex-col sm:flex-row items-center gap-2 justify-between'>
      <h1 className='text-2xl font-semibold'>Symbol Group</h1>
      <div className='flex items-center gap-4'>
       <CustomTextField label={'Search'} varient={'outlined'} sx={{height:'48px'}} />
        <CustomButton
          Text='Add Symbol Group'
          style={AddnewStyle}
          icon={<PlusCircleOutlined />}
          onClickHandler={()=> navigate('/symbol-groups/0')}
        />
       
      </div>
    </div>
    <CustomTable columns={columns} data={SymbolList} headerStyle={headerStyle} />
  </div>
  </Spin>
  )
}

export default Index