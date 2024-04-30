import React, { useEffect,useRef, useState } from 'react';
import { SearchOutlined,PlusCircleOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Pagination } from 'antd';
import Highlighter from 'react-highlight-words';

import { theme, Spin } from 'antd';
import ARROW_UP_DOWN from '../../../assets/images/arrow-up-down.png'
import CustomTable from '../../../components/CustomTable';
import CustomButton from '../../../components/CustomButton';
import { AddnewSettingsStyle} from '../../Brand/style';
import {useNavigate } from 'react-router-dom';
import { All_Setting_Data} from '../../../utils/_SymbolSettingAPICalls';
import { useDispatch, useSelector } from 'react-redux';
import  "../../DnDTable/index.css";
import { setSymbolSettingsData, setSymbolSettingsSelecetdIDs } from '../../../store/symbolSettingsSlice';
import { render } from 'react-dom';


const Index = () => {
  const dispatch = useDispatch()

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
  const [perPage, setPerPage] = useState(10)
  const [isUpdated, setIsUpdated] = useState(true)
  const [sortDirection, setSortDirection] = useState("")
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');

  const searchInput = useRef(null);
 
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  const columns = [
    {
      
      title:<span className="dragHandler">Name</span>,
      dataIndex: 'name',
      key: '1',
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
      children:[
        {
          title: <Input 
          placeholder='search Name' 
          onPressEnter={(e)=>{
            const filteredArray = allSetting.filter(item => item.name.toLowerCase().includes(e.target.value.toLowerCase()));
            setAllSetting(filteredArray)
            setIsUpdated(true)
          }}
           />,
          dataIndex: 'name',
          key: 'name',
          width: 150,
        }
      ],
      ...getColumnSearchProps('name'),
      
      
    },
    {
      title:<span className="dragHandler">Leverage</span>,
      dataIndex: 'leverage',
      key: '2',
      sorter: (a, b) => a.leverage.length - b.leverage.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />;  // Return null if no sorting direction is set
      },
      children:[
        {
          title: <Input placeholder='search Leverage'/>,
          dataIndex: 'leverage',
          key: 'leverage',
          width: 80,
        }
      ],
      ...getColumnSearchProps('leverage'),
    },
    {
      title:<span className="dragHandler">Swap</span>,
      dataIndex: 'swap',
      key: '3',
      sorter: (a, b) => a.swap.length - b.swap.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
      children:[
        {
          title: <Input placeholder='search swap'/>,
          dataIndex: 'swap',
          key: 'swap',
          width: 80,
        }
      ],
      ...getColumnSearchProps('swap'),
    },
    {
      title:<span className="dragHandler">Lot Size</span>,
      dataIndex: 'lot_size',
      key: '4',
      sorter: (a, b) => a.lot_size.length - b.lot_size.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
      children:[
        {
          title: <Input placeholder='search Lot size'/>,
          dataIndex: 'lot_size',
          key: 'lot_size',
          width: 80,
        }
      ],
      ...getColumnSearchProps('lot_size'),
    },
    {
      title:<span className="dragHandler">Lot Steps</span>,
      dataIndex: 'lot_step',
      key: '5',
      sorter: (a, b) => a.lot_step.length - b.lot_step.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <CaretDownOutlined />; // Return null if no sorting direction is set
      },
      children:[
        {
          title: <Input placeholder='search lot step' />,
          dataIndex: 'lot_step',
          key: 'lot_step',
          width: 80,
        }
      ],
      ...getColumnSearchProps('lot_step'),
    },
    {
      title:<span className="dragHandler">Minimum Value</span>,
      dataIndex: 'vol_min',
      key: '6',
      sorter: (a, b) => a.vol_min.length - b.vol_min.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
      children:[
        {
          title: <Input placeholder='search vol min'/>,
          dataIndex: 'vol_min',
          key: 'vol_min',
          width: 80,
        }
      ],
      ...getColumnSearchProps('vol_min'),
    },
    {
      title:<span className="dragHandler">Maximum Value</span>,
      dataIndex: 'vol_max',
      key: '7',
      sorter: (a, b) => a.vol_max.length - b.vol_max.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
      children:[
        {
          title: <Input placeholder='search vol max'/>,
          dataIndex: 'vol_max',
          key: 'vol_max',
          width: 80,
        }
      ],
      ...getColumnSearchProps('vol_max'),
    },
    {
      title:<span className="dragHandler">Commision</span>,
      dataIndex: 'commission',
      key: '8',
      sorter: (a, b) => a.commission.length - b.commission.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
      children:[
        {
          title: <Input placeholder='search Commision' />,
          dataIndex: 'commission',
          key: 'commission',
          width: 80,
        }, 
      ],

      ...getColumnSearchProps('commission'),
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
      const res = await All_Setting_Data(token, page, parseInt(perPage));
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
  }, [perPage])

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
          setSortDirection = {setSortDirection}
          perPage={perPage}
          setPerPage={setPerPage}
        />
      </div>
    </Spin>
  )
}

export default Index