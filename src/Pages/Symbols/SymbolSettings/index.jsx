import React, { useEffect, useState } from 'react'
import { Space, theme, Spin } from 'antd';
import { PlusCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

import CustomTable from '../../../components/CustomTable';
import CustomButton from '../../../components/CustomButton';
import { AddnewStyle } from '../../Brand/style';
import CustomTextField from '../../../components/CustomTextField';
import { Link, useNavigate } from 'react-router-dom';
import { All_Setting_Data, DeleteSymbolSetting } from '../../../utils/_SymbolSettingAPICalls';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

const Index = () => {
  const token = useSelector(({ user }) => user?.user?.token)
  const {
    token: { colorBG, TableHeaderColor, Gray2, colorPrimary },
  } = theme.useToken();
  const navigate = useNavigate()
  const headerStyle = {
    background: TableHeaderColor, // Set the background color of the header
    color: 'black', // Set the text color of the header
  };

  const [allSetting, setAllSetting] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const fetchAllSetting = async () => {

    try {
      setIsLoading(true)
      const res = await All_Setting_Data(token);
      const { data: { message, success, payload } } = res
      setIsLoading(false)
      setAllSetting(payload.data);
    } catch (error) {
      console.error('Error fetching symbol groups:', error);
    }
  }
  useEffect(() => {
    fetchAllSetting()
  }, [])

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
      title: 'Commission',
      dataIndex: 'commission',
      key: '7',
    },

    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle" className='cursor-pointer'>
          <Link to={`/symbol-settings/${record.id}`}><EditOutlined style={{ fontSize: "24px", color: colorPrimary }} /></Link>
          <DeleteOutlined style={{ fontSize: "24px", color: colorPrimary }} onClick={() => DeleteHandler(record.id)} />
        </Space>
      ),
    },
  ];
  const DeleteHandler = async (id) => {
    setIsLoading(true)
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1CAC70",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await DeleteSymbolSetting(id, token)
        const { data: { success, message, payload } } = res
        setIsLoading(false)
        if (success) {
          Swal.fire({
            title: "Deleted!",
            text: message,
            icon: "success"
          });
          fetchAllSetting()
        } else {
          Swal.fire({
            title: "Opps!",
            text: { message },
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
          <h1 className='text-2xl font-semibold'>Symbol Settings</h1>
          <div className='flex items-center gap-4'>
            <CustomTextField label={'Search'} varient={'outlined'} sx={{ height: '48px' }} />
            <CustomButton
              Text='Add Symbol'
              style={AddnewStyle}
              icon={<PlusCircleOutlined />}
              onClickHandler={() => navigate('/symbol-settings/0')}
            />

          </div>
        </div>
        <CustomTable columns={columns} data={allSetting} headerStyle={headerStyle} />
      </div>
    </Spin>
  )
}

export default Index