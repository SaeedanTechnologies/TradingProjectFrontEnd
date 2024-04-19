import React, { useEffect, useState } from 'react'
import { Space, Spin, theme } from 'antd';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined, EyeOutlined,EyeInvisibleOutlined} from '@ant-design/icons';

import CustomTable from '../../components/CustomTable'
import CustomButton from '../../components/CustomButton'
import CustomModal from '../../components/CustomModal'
import BrandModal from './BrandModal';
import { notifySuccess, notifyError } from '../../utils/constants';
import { ToastContainer } from 'react-toastify';
import { AddnewStyle, footerStyle, submitStyle } from './style';
import { Brands_List, DeleteBrand } from '../../utils/_APICalls';
import { useSelector } from 'react-redux';
import { Stack,Typography } from '@mui/material';
import Swal from 'sweetalert2';


const BrandList = () => {
  const token = useSelector(({ user }) => user?.user?.token)
  const { token: { colorBG, TableHeaderColor, colorPrimary } } = theme.useToken();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [BrandsList, setBrandsList] = useState([])
  const [BrandID, setBrandID] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const [showKey,setShowKey] = useState(false)

  const fetchBrands = async () => {
    setIsLoading(true)
    const mData = await Brands_List(token)
    const { data: { message, payload, success } } = mData
    setIsLoading(false)
    if (success) {
      setBrandsList(payload.data)
    }
  }
  useEffect(() => {
    fetchBrands()
  }, [])

  const showModal = (id = null) => {
    setBrandID(id)
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const toggleKey=()=>{
    setShowKey(!showKey)
  }

  const headerStyle = {
    background: TableHeaderColor, // Set the background color of the header
    color: 'black', // Set the text color of the header
  };
  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: '1',
      hidden: true,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: '2',
    },
    {
      title: 'Domain',
      dataIndex: 'domain',
      key: '3',
    },
    {
      title: 'Authorization Key',
      dataIndex: 'public_key',
      key: '4',
       render: (_, record) => (
        <Stack direction="row" justifyContent={'space-between'}>
          <Typography sx={{fontWeight: showKey? 400 : 700,fontSize:showKey ? "14px": "22px"}}>{showKey ? record.public_key: '................'}</Typography>

          <Space size="middle" className='cursor-pointer'>
            { showKey ?
            <EyeInvisibleOutlined style={{ fontSize: "24px", color: colorPrimary }} onClick={toggleKey} />:
            <EyeOutlined style={{ fontSize: "24px", color: colorPrimary }} onClick={toggleKey} />
            }
            </Space>
        </Stack>
      ),
    },
    {
      title: 'Margin Calls',
      dataIndex: 'margin_call',
      key: '4',
    },
    {
      title: 'Actions',
      dataIndex: 'type',
      key: '9',
      render: (_, record) => (
        <Space size="middle" className='cursor-pointer'>
          <EditOutlined style={{ fontSize: "24px", color: colorPrimary }} onClick={() => showModal(record.id)} />
          <DeleteOutlined style={{ fontSize: "24px", color: colorPrimary }} onClick={() => DeleteHandler(record.id)} />

        </Space>
      ),
    },

  ];
 

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
      const res = await DeleteBrand(id, token)
      const {data:{success, message, payload}} = res
      setIsLoading(false)
      if(success){
        Swal.fire({
          title: "Deleted!",
          text: message,
          icon: "success"
        });
        fetchBrands()
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



  return (
    <Spin spinning={isLoading} size="large">
      <div className='p-8' style={{ backgroundColor: colorBG }}>
        <div className='flex flex-col sm:flex-row items-center gap-2 justify-between'>
          <h1 className='text-2xl font-semibold'>Brand List</h1>
          <div>
            <CustomButton
              Text='Add New Brand'
              style={AddnewStyle}
              icon={<PlusCircleOutlined />}
              onClickHandler={() => showModal(0)}
            />
          </div>
        </div>
        <CustomTable columns={columns} data={BrandsList} headerStyle={headerStyle} />
        <CustomModal
          isModalOpen={isModalOpen}
          handleOk={handleOk}
          handleCancel={handleCancel}
          title={''}
          width={800}
          footer={null}
          
        >
          <BrandModal
            setIsModalOpen={setIsModalOpen}
            fetchBrands={fetchBrands}
            BrandID={BrandID}
          />
        </CustomModal>
      </div>
      <ToastContainer />
    </Spin>
  )
}
export default BrandList