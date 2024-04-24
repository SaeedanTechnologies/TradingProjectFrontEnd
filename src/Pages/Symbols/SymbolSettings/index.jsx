import React, { useEffect, useState } from 'react'
import { Space, theme, Spin, Checkbox } from 'antd';
import { PlusCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

import CustomTable from '../../../components/CustomTable';
import CustomButton from '../../../components/CustomButton';
import { AddnewSettingsStyle, AddnewStyle } from '../../Brand/style';
import CustomTextField from '../../../components/CustomTextField';
import { Link, json, useNavigate } from 'react-router-dom';
import { All_Setting_Data, DeleteSymbolSetting } from '../../../utils/_SymbolSettingAPICalls';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import CustomDropdownBtn from '../../../components/CustomDropdownBtn';
import styled, { css } from "styled-components";
import  "../../DnDTable/index.css";



const VerticalCheckboxGroup = styled(Checkbox.Group)`
  ${(props) =>
    props.backgroundColor &&
    css`
      &  .ant-checkbox-group-item {
        display: flex;
        align-items: center;
        height: 32px;
        margin-right: 0;
      }
      ,
      .ant-checkbox-checked .ant-checkbox-inner {
        background-color: ${props.backgroundColor};
        border-color: ${props.backgroundColor};
      }
    `}
`;

const Index = () => {
  const token = useSelector(({ user }) => user?.user?.token)
  const {
    token: { colorBG, TableHeaderColor, Gray2, colorPrimary },
  } = theme.useToken();
  const navigate = useNavigate()
  const headerStyle = {
    background: TableHeaderColor,
    color: 'black',
  };

  const [allSetting, setAllSetting] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [CurrentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)

  const columns = [
    {
      
      title:<span className="dragHandler">Name</span>,
      dataIndex: 'name',
      key: '1',
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ['ascend'],
      
    },
    {
      title:<span className="dragHandler">Leverage</span>,
      dataIndex: 'leverage',
      key: '2',
      sorter: (a, b) => a.leverage.length - b.leverage.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">Swap</span>,
      dataIndex: 'swap',
      key: '3',
      sorter: (a, b) => a.swap.length - b.swap.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">Lot Size</span>,
      dataIndex: 'lot_size',
      key: '4',
      sorter: (a, b) => a.lot_size.length - b.lot_size.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">Lot Steps</span>,
      dataIndex: 'lot_step',
      key: '5',
      sorter: (a, b) => a.lot_step.length - b.lot_step.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">Minimum Value</span>,
      dataIndex: 'vol_min',
      key: '6',
      sorter: (a, b) => a.vol_min.length - b.vol_min.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">Maximum Value</span>,
      dataIndex: 'vol_max',
      key: '7',
      sorter: (a, b) => a.vol_max.length - b.vol_max.length,
      sortDirections: ['ascend'],
    },
    {
      title:<span className="dragHandler">Commision</span>,
      dataIndex: 'commission',
      key: '8',
      sorter: (a, b) => a.commission.length - b.commission.length,
      sortDirections: ['ascend'],
    },

  //   {
  //     title: 'Action',
  //     key: 'action',
  //     render: (_, record) => (
  //       <Space size="middle" className='cursor-pointer'>
  //         <Link to={`/symbol-settings/${record.id}`}><EditOutlined style={{ fontSize: "24px", color: colorPrimary }} /></Link>
  //         <DeleteOutlined style={{ fontSize: "24px", color: colorPrimary }} onClick={() => DeleteHandler(record.id)} />
  //       </Space>
  //     ),
  //  }
  ];
  const defaultCheckedList = columns.map((item) => item.key);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [newColumns , setNewColumns] = useState(columns)
  const fetchAllSetting = async (page) => {

    try {
      setIsLoading(true)
      const res = await All_Setting_Data(token, page);
      const { data: { message, success, payload } } = res
      setIsLoading(false)
      setCurrentPage(payload.current_page)
      setLastPage(payload.last_page)
      setAllSetting(payload.data);
      setTotalRecords(payload.total)
    } catch (error) {
      console.error('Error fetching symbol groups:', error);
    }
  }
  useEffect(() => {
    fetchAllSetting(CurrentPage)
  }, [])

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
          fetchAllSetting(CurrentPage)
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
  const onPageChange = (page) =>{
    fetchAllSetting(page)
  }
  useEffect(() => {
  const newCols = columns.filter(x => checkedList.includes(x.key));
  setNewColumns(newCols)
  }, [checkedList]);

  const handleMenuClick = (e) => { };

  const columnMenuProps = {
    
    items: columns.map((column) => ({
      key: column.key,
      icon: (
        <VerticalCheckboxGroup
          value={checkedList}
          options={[{ label: column.title, value: column.key }]}
          onChange={(value) => {
            const newCheckedList = [...checkedList];
            if (value.includes(column.key)) {
              newCheckedList.push(column.key);
            } else {
              const index = newCheckedList.indexOf(column.key);
              if (index !== -1) {
                newCheckedList.splice(index, 1);
              }
            }
            setCheckedList(newCheckedList);
          }}
          backgroundColor={colorPrimary}
        />
      ),
    })),
    onClick: handleMenuClick,
  };
  return (
    <Spin spinning={isLoading} size="large">
      <div className='p-8' style={{ backgroundColor: colorBG }}>
        <div className='flex flex-col sm:flex-row items-center gap-2 justify-between'>
          <h1 className='text-2xl font-semibold'>Symbol Settings</h1>
          <div className='flex items-center gap-4'>
            <CustomTextField label={'Search'} varient={'outlined'} sx={{ height: '48px' }} />
            <CustomButton
              Text='Add New Symbol Settings'
              style={AddnewSettingsStyle}
              icon={<PlusCircleOutlined />}
              onClickHandler={() => navigate('/symbol-settings/0')}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
      <div className="self-end mt-4 mb-4">
       <CustomDropdownBtn Text='Manage Columns' menuProps={columnMenuProps} />
     </div>
     </div>
        <CustomTable
          direction="symbol-settings" 
          columns={newColumns}
          data={allSetting} 
          headerStyle={headerStyle}
          total={totalRecords}
          onPageChange = {onPageChange}
          current_page={CurrentPage}
        />
      </div>
    </Spin>
  )
}

export default Index