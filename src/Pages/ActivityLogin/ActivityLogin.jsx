import { Space, Tag, theme, Spin } from 'antd';
import React, { useState, useEffect } from 'react'
import { PlusCircleOutlined, DeleteOutlined, CaretUpOutlined, CaretDownOutlined  } from '@ant-design/icons';
import CustomAutocomplete from '../../components/CustomAutocomplete';
import CustomButton from '../../components/CustomButton';
import CustomTable from '../../components/CustomTable';

import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { TransactionOrderValidationSchema } from '../../utils/validations';
import moment from 'moment'
import { CheckBrandPermission, ColumnSorter, getCurrentIP } from "../../utils/helpers";
import { setTransactionOrdersSelectedIds,setTransactionOrdersData } from '../../store/TradingAccountListSlice';
import ARROW_UP_DOWN from '../../assets/images/arrow-up-down.png'
import { UserLoginActivities } from '../../utils/_APICalls';



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
  const [activitiesData,setActivitiesData] = useState([])

  
  const columns = [

    {
      title: <span className="dragHandler">User ID</span>,
      dataIndex: 'user_id',
      key: '1',
      sorter: (a, b) => a.user_id - b.user_id,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },

    },
    {
      title: <span className="dragHandler">Created Time</span>,
      dataIndex: 'created_at',
      key: '2',
      render: (text) => <a>{moment(text).format("YYYY-MM-DD HH:mm")}</a>,
      sorter: (a, b) =>  ColumnSorter(a.created_at , b.created_at),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },

    },
    {
      title: <span className="dragHandler">Ip Address</span>,
      dataIndex: 'ip_address',
      key: '3',
      sorter: (a, b) => ColumnSorter(a.ip_address, b.ip_address),
       sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },

    },
     {
      title: <span className="dragHandler">Login Time</span>,
      dataIndex: 'login_time',
      key: '4',
      sorter: (a, b) => ColumnSorter(a.login_time, b.login_time),
       sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },

    },
    
    {
      title: <span className="dragHandler">Updated Time</span>,
      dataIndex: 'updated_at',
      key: '5',
      sorter: (a, b) => ColumnSorter(a.updated_at , b.updated_at),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },

    },
  
  ];

    const fetchActivityLogins = async (page) => {
      // debugger
    setIsLoading(true)
    const mData = await UserLoginActivities(token,page)
    const { data: { message, payload, success } } = mData
    
      
    if (success) {

      

      setActivitiesData(payload?.data)
      setCurrentPage(payload.current_page)
      setLastPage(payload.last_page)
      setTotalRecords(payload.total)
      setIsLoading(false)
      setIsUpdated(false)


    }
  }


  useEffect(() => {
    (async ()=> {
        setIsLoading(true)
        const ip = await getCurrentIP()
        setCurrent_IP(ip.ip)
        setIsLoading(false)

        // SetSearchQueryList({
        //   page:CurrentPage,
        //   perPage
        // })

    })()
  }, [])


    useEffect(() => {
    setIsUpdated(true)
    fetchActivityLogins(CurrentPage)
  }, [perPage])

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
    // fetchActivityLogins(page)
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

          <CustomTable
            direction="/single-trading-accounts/details/login-activity-entry"
            formName="Login Activities"
            columns={newColumns}
            data = {activitiesData}
            headerStyle={headerStyle}
            total={totalRecords}
            setTotalRecords={setTotalRecords}
            onPageChange={onPageChange}
            current_page={CurrentPage}
            token={token}
            isUpated={isUpdated}
            // setSelecetdIDs={setTransactionOrdersSelectedIds}
            // setTableData = {setTransactionOrdersData}
            table_name= "user_login_activities"
            setSortDirection = {setSortDirection}
            perPage={perPage}
            setPerPage={setPerPage}
            SearchQuery = {UserLoginActivities}
            // SearchQueryList={SearchQueryList}
            // LoadingHandler={LoadingHandler}
            setCurrentPage={setCurrentPage}
            setLastPage={setLastPage}
            // editPermissionName="transaction_orders_update"
            // deletePermissionName="transaction_orders_delete"
          />



        </div>

      </div>
    </Spin>
  )
}

export default ActivityLogin