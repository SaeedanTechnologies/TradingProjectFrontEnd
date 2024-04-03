import React, { useEffect, useState } from 'react'
import { theme } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';

import CustomTable from '../../components/CustomTable'
import CustomButton from '../../components/CustomButton'
import CustomModal from '../../components/CustomModal'
import BrandModal from './BrandModal';
import { AddnewStyle, footerStyle, submitStyle } from './style';
import { Brands_List } from '../../utils/_APICalls';

const columns = [
  {
    title: 'Column 1',
    dataIndex: 'address',
    key: '1',
  },
  {
    title: 'Column 2',
    dataIndex: 'address',
    key: '2',
  },
  {
    title: 'Column 3',
    dataIndex: 'address',
    key: '3',
  },
  {
    title: 'Column 4',
    dataIndex: 'address',
    key: '4',
  },
  {
    title: 'Column 5',
    dataIndex: 'address',
    key: '5',
  },
  {
    title: 'Column 6',
    dataIndex: 'address',
    key: '6',
  },
  {
    title: 'Column 7',
    dataIndex: 'address',
    key: '7',
  },
  {
    title: 'Column 8',
    dataIndex: 'address',
    key: '8',
  },
];
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 40,
    address: 'London Park',
  },
];

const BrandList = () => {
  const { token: { colorBG, TableHeaderColor } } = theme.useToken();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [BrandsList, setBrandsList] = useState([])

  const fetchBrands = async () => {
    const mData = await Brands_List()
    debugger
  }

  useEffect(() => {
    fetchBrands()
  }, [])

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const headerStyle = {
    background: TableHeaderColor, // Set the background color of the header
    color: 'black', // Set the text color of the header
  };
  return (
    <div className='p-8' style={{ backgroundColor: colorBG }}>
      <div className='flex flex-col sm:flex-row items-center gap-2 justify-between'>
        <h1 className='text-2xl font-semibold'>Brand List</h1>
        <div>
          <CustomButton
            Text='Add New Brand'
            style={AddnewStyle}
            icon={<PlusCircleOutlined />}
            onClickHandler={showModal}
          />
        </div>
      </div>
      <CustomTable columns={columns} data={data} headerStyle={headerStyle} />
      <CustomModal
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
        title={''}
        width={800}
        footer={[
          <div style={footerStyle}>
            <CustomButton
              Text={'Submit'}
              onClickHandler={handleOk}
              style={submitStyle}
            />
          </div>
        ]}
      >
        <BrandModal />
      </CustomModal>
    </div>
  )
}
export default BrandList