import React, { useEffect, useState } from 'react'
import { theme, Spin } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';

import CustomTable from '../../../components/CustomTable';
import CustomButton from '../../../components/CustomButton';
import { AddnewSettingsStyle} from '../../Brand/style';
import CustomTextField from '../../../components/CustomTextField';
import {useNavigate } from 'react-router-dom';
import { All_Setting_Data} from '../../../utils/_SymbolSettingAPICalls';
import { useDispatch, useSelector } from 'react-redux';
import  "../../DnDTable/index.css";
import { setSymbolSettingsData, setSymbolSettingsSelecetdIDs } from '../../../store/symbolSettingsSlice';




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
  const [isUpdated, setIsUpdated] = useState(true)

  const dispatch = useDispatch()

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
      setIsUpdated(false)
    } catch (error) {
      console.error('Error fetching symbol groups:', error);
    }
  }
  useEffect(() => {
    setIsUpdated(true)
    fetchAllSetting(CurrentPage)
  }, [])

  const onPageChange = (page) =>{
    fetchAllSetting(page)
  }
  useEffect(() => {
  const newCols = columns.filter(x => checkedList.includes(x.key));
  setNewColumns(newCols)
  }, [checkedList]);


 
  return (
    <Spin spinning={isLoading} size="large">
      <div className='p-8' style={{ backgroundColor: colorBG }}>
        <div className='flex flex-col sm:flex-row items-center gap-2 justify-between'>
          <h1 className='text-2xl font-semibold'>Symbol Settings</h1>
          <div className='flex items-center gap-4'>
            <CustomButton
              Text='Add New Symbol Settings'
              style={AddnewSettingsStyle}
              icon={<PlusCircleOutlined />}
              onClickHandler={() =>{
                dispatch(setSymbolSettingsSelecetdIDs([0]))
                navigate('/symbol-settings-entry')
              }}
            />
          </div>
        </div>
      
        <CustomTable
          direction="/symbol-settings-entry"
          formName = "Symbol Settings" 
          columns={newColumns}
          data={allSetting} 
          headerStyle={headerStyle}
          total={totalRecords}
          onPageChange = {onPageChange}
          current_page={CurrentPage}
          token = {token}
          isUpated={isUpdated}
          setSelecetdIDs={setSymbolSettingsSelecetdIDs}
          setTableData = {setSymbolSettingsData}
          table_name= "symbel_settings"
        />
      </div>
    </Spin>
  )
}

export default Index