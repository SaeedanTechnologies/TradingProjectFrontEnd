import { Space, Tag, theme, Spin } from 'antd';
import React, { useState, useEffect } from 'react'
import { PlusCircleOutlined, DeleteOutlined, CaretUpOutlined, CaretDownOutlined  } from '@ant-design/icons';
import CustomAutocomplete from '../../components/CustomAutocomplete';
import CustomButton from '../../components/CustomButton';
import CustomTable from '../../components/CustomTable';

import { Link } from 'react-router-dom';
import { Save_Transaction_Order, Get_Transaction_Orders } from '../../utils/_TransactionOrderAPI';
import { useDispatch, useSelector } from 'react-redux';
import { TransactionOrderValidationSchema } from '../../utils/validations';
import moment from 'moment'
import CustomNotification from '../../components/CustomNotification';
import { Get_Single_Trading_Account } from '../../utils/_TradingAPICalls';
import { TextField, Input, InputAdornment, FormControl, Select, InputLabel, MenuItem } from '@mui/material';
import { CheckBrandPermission, ColumnSorter, getCurrentIP } from "../../utils/helpers";
import { setTradingAccountGroupData } from '../../store/tradingAccountGroupSlice';
import { AddnewStyle } from '../Brand/style';
import CustomModal from '../../components/CustomModal';
import { Search_Transaction_Ordcer } from '../../utils/_SymbolSettingAPICalls';
import { setTransactionOrdersSelectedIds,setTransactionOrdersData } from '../../store/TradingAccountListSlice';
import ARROW_UP_DOWN from '../../assets/images/arrow-up-down.png'


const ActivityLogin = () => {

  const token = useSelector(({ user }) => user?.user?.token)
  const {
    token: { colorBG, TableHeaderColor, colorPrimary },
  } = theme.useToken();
  const dispatch = useDispatch()
  const userPermissions = useSelector((state) => state?.user?.user?.user?.permissions)
    const userBrand = useSelector((state)=> state?.user?.user?.brand)

  const currentTradingAccountData = useSelector(({ tradingAccountGroup }) => tradingAccountGroup.tradingAccountGroupData)
  const [current_ip, setCurrent_IP] = useState("")
  const [sortDirection, setSortDirection] = useState("")
  const [perPage, setPerPage] = useState(10)
  const [SearchQueryList,SetSearchQueryList]= useState({})
  const [OperationsList, setOperationList] = useState([
    { "label": "Balance", "value": "balance" },
    { "label": "Commission", "value": "commission" },
    { "label": "Tax", "value": "tax" },
    { "label": "Credit", "value": "credit" },
    { "label": "Bonus", "value": "bonus" }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [CurrentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [isUpdated, setIsUpdated] = useState(true)
  const [totalRecords, setTotalRecords] = useState(0)
  
  const columns = [
    {
      title: <span className="dragHandler">Time</span>,
      dataIndex: 'time',
      key: '1',
      render: (text) => <a>{moment(text).format("YYYY-MM-DD HH:mm")}</a>,
      sorter: (a, b) =>  ColumnSorter(a.name , b.name),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },

    },
    {
      title: <span className="dragHandler">Ip Address</span>,
      dataIndex: 'ip_adress',
      key: '2',
      sorter: (a, b) => ColumnSorter(a.email, b.email),
       sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },

    },
    {
      title: <span className="dragHandler">Mac Address</span>,
      dataIndex: 'mac_address',
      key: '3',
      sorter: (a, b) => ColumnSorter(a.phone, b.phone),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },

    },
    {
      title: <span className="dragHandler">Type</span>,
      dataIndex: 'type',
      key: '4',
      sorter: (a, b) => ColumnSorter(a.country, b.country),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },

    },
    {
      title: <span className="dragHandler">Location</span>,
      dataIndex: 'location',
      key: '5',
      sorter: (a, b) =>ColumnSorter( a.type , b.type),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
  ];
  useEffect(() => {
    (async ()=> {
        setIsLoading(true)
        const ip = await getCurrentIP()
        setCurrent_IP(ip.ip)
        setIsLoading(false)

    })()
  }, [])
   const [newColumns , setNewColumns] = useState(columns)
  const defaultCheckedList = columns.map((item) => item.key);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  

 
  const headerStyle = {
    background: TableHeaderColor, // Set the background color of the header
    color: 'black', // Set the text color of the header
  };


 


  const clearFields = () => {
    
  }

  const onPageChange = (page) =>{
    // FetchData(page)
  }

 

  

 


   useEffect(() => {
  const newCols = columns.filter(x => checkedList.includes(x.key));
  setNewColumns(newCols)
  }, [checkedList]);

//   const LoadingHandler = React.useCallback((isLoading)=>{
//     setIsLoading(isLoading)
//   },[])

  const defaultProps = {
    options: OperationsList,
    getOptionLabel: (option) => option.label ? option.label : "",
  };

  const closeTransactionOrder = () => {
    setIsModalOpen(false)
  }

  return (
    <Spin spinning={isLoading} size="large">
      <div className='rounded-lg' style={{ backgroundColor: colorBG }}>

        <div className="mb-4 grid grid-cols-1  gap-4 mt-4">
          {/* <CustomTable columns={columns} data={transactionOrders} headerStyle={headerStyle} /> */}

          <CustomTable
            direction="/single-trading-accounts/details/login-activity-entry"
            formName="Transaction Order"
            columns={newColumns}
            headerStyle={headerStyle}
            total={totalRecords}
            setTotalRecords={setTotalRecords}
            onPageChange={onPageChange}
            current_page={CurrentPage}
            token={token}
            isUpated={isUpdated}
            setSelecetdIDs={setTransactionOrdersSelectedIds}
            setTableData = {setTransactionOrdersData}
            table_name= "transaction_orders"
            setSortDirection = {setSortDirection}
            perPage={perPage}
            setPerPage={setPerPage}
            SearchQuery = {Search_Transaction_Ordcer}
            SearchQueryList={SearchQueryList}
            // LoadingHandler={LoadingHandler}
            setCurrentPage={setCurrentPage}
            setLastPage={setLastPage}
            editPermissionName="transaction_orders_update"
            deletePermissionName="transaction_orders_delete"
          />
        </div>

      </div>
    </Spin>
  )
}

export default ActivityLogin