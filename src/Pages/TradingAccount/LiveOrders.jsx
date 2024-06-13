import { theme, Spin, Table, Space } from 'antd';
import React, {useState, useEffect } from 'react'

import CustomTable from '../../components/CustomTable';
import { MinusCircleOutlined,CaretUpOutlined, CaretDownOutlined  } from '@ant-design/icons';
import { useLocation, } from 'react-router-dom';
import { Put_Trade_Order, Put_Trading_Account,Search_Live_Order } from '../../utils/_TradingAPICalls';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import CustomNotification from '../../components/CustomNotification';
import { CurrenciesList, LeverageList } from '../../utils/constants';
import { calculateEquity, calculateFreeMargin, calculateMargin, calculateMarginCallPer, checkNaN, ColumnSorter, getCurrentDateTime } from '../../utils/helpers';
import { GenericDelete, UpdateMultiTradeOrder } from '../../utils/_APICalls';
import ARROW_UP_DOWN from '../../assets/images/arrow-up-down.png';
import { setLiveOrdersSelectedIds,setLiveOrdersData } from '../../store/TradingAccountListSlice';
import { CloseOutlined, DeleteOutlined } from '@mui/icons-material';
import { EyeOutlined  } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { updateMultipleFields, updateTradingAccountGroupBalance } from '../../store/tradingAccountGroupSlice';

const   LiveOrders = ({grandCommsion, setManipulatedData, isLoading, setIsLoading, grandProfit, lotSize,margin, totalSwap }) => {
  
  const dispatch = useDispatch()
  const trading_account_id = useSelector((state) => state?.trade?.selectedRowsIds ? state?.trade?.selectedRowsIds[0]:0);
  const token = useSelector(({ user }) => user?.user?.token)
  const liveOrdersData = useSelector(({tradingAccount})=> tradingAccount.liveOrdersData)
  const {balance, currency, leverage, brand_margin_call, id, credit, bonus,total_withdraw, commission, tax} = useSelector(({tradingAccountGroup})=> tradingAccountGroup?.tradingAccountGroupData )
  // const prev_data = useSelector((state)=>state.tradingAccountGroup.tradingAccountGroupData)
  const {value: accountLeverage} = LeverageList?.find(x=> x.title === leverage) ||  { value: '', title: '' }
  const {title : CurrencyName} = CurrenciesList?.find(x=> x.value === currency) ||  {label: 'Dollar ($)', value: '$', title: 'USD'}
  const location = useLocation()
  const { pathname } = location
  const equity_g = calculateEquity(balance, grandProfit, credit, bonus)
  const free_margin = calculateFreeMargin(equity_g, margin)
  const margin_level =  calculateMarginCallPer(equity_g, margin)
  //check
  const [CurrentPage, setCurrentPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [isUpdated, setIsUpdated] = useState(true)
    const [totalRecords, setTotalRecords] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const [SearchQueryList,SetSearchQueryList]= useState({})
    const [sortDirection, setSortDirection] = useState("")
    const [refresh_data, setRefreshData] = useState(false)
    
  const {
    token: { colorBG, TableHeaderColor, colorPrimary },
  } = theme.useToken();
  const columns = [
    {
      title:<span className="dragHandler">Symbol</span>,
      dataIndex: 'symbol_setting_name',
      key: '1',
      sorter: (a, b) =>  ColumnSorter(a.symbol_setting_name , b.symbol_setting_name),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; 
      },
    },
    {
      title:<span className="dragHandler">OrderID</span>,
      dataIndex: 'id',
      key: '2222',
      sorter:(a, b) => a?.id - b?.id,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    
    {  
      title:<span className="dragHandler">Type</span>,
      dataIndex: 'type',
      key: '2',
      render: (text)=> <span className={`${text === "sell" ? 'text-red-600' : 'text-green-600'}`}>{text}</span>,
      sorter: (a, b) =>  ColumnSorter(a.type , b.type),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; 
      },
    
    },
   
    {
      title: <span className="dragHandler">Volume</span>,
      dataIndex: 'volume',
      key: '3',
      
      sorter: (a, b) =>  ColumnSorter(a.volume , b.volume),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; 
      },
      render: (text)=> <span style={{color:"red"}}>{text}</span>
    },
    {
      title: <span className="dragHandler">Open Time</span>,
      dataIndex: 'open_time',
      key: '3',
      
      sorter: (a, b) =>  ColumnSorter(a.open_time , b.open_time),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; 
      },
    },
    {
      title: <span className="dragHandler">Open Price</span>,
      dataIndex: 'open_price',
      key: 'open_price',
      sorter: (a, b) => ColumnSorter(a.open_price , b.open_price),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; 
      },
    },
    //
    {
      title: <span className="dragHandler">Current Price</span>,
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      sorter: (a, b) => ColumnSorter(a.currentPrice , b.currentPrice),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; 
      },
    },
    {
      title: <span className="dragHandler">Take Profit</span>,
      dataIndex: 'takeProfit',
      key: 'takeProfit',
      sorter: (a, b) => ColumnSorter(a.takeProfit , b.takeProfit),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; 
      },
    },
    
    {
      title: <span className="dragHandler">Stop Loss</span>,
      dataIndex: 'stopLoss',
      key: 'stopLoss',
      sorter: (a, b) => ColumnSorter(a.stopLoss , b.stopLoss),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; 
      },
    },
  
    {
      title: <span className="dragHandler">Comment</span>,
      dataIndex: 'comment',
      key: 'comment',
      sorter: (a, b) => ColumnSorter(a.comment , b.comment),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; 
      },
    },
    {
      title: <span className="dragHandler">Swap</span>,
      dataIndex: 'swap',
      key: 'swap',
    },
    {
      title: <span className="dragHandler">Profit</span>,
      dataIndex: 'profit',
      key: 'profit',
      render: (text)=> <span className={`${text < 0 ? 'text-red-600' : 'text-green-600'}`}>{text}</span>
    },
    {
      title: <span className="dragHandler">Commission</span>,
      dataIndex: 'commission',
      key: 'commission',
      render: (text)=> <span className={`${text < 0 ? 'text-red-600' : 'text-green-600'}`}>{text}</span>
    },
   
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle" className='cursor-pointer'>
          <CloseOutlined style={{ fontSize: "24px", color: colorPrimary }} 
           onClick={(e) => {
            e.stopPropagation();
            closeHandler(record);
          }}
          />
          <EyeOutlined style={{ fontSize: "24px", color: colorPrimary }} />
          <DeleteOutlined style={{fontSize:"24px", color: colorPrimary }} 
          onClick={(e) => {
            e.stopPropagation();
            deleteHandler(record.id);
          }}
          />
        </Space >
        
      ),
    },
  ];
  const deleteHandler = async (id) => {
    const params = {
      table_name:"trade_orders",
      table_ids : [id]
    }
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1CAC70",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async( result )=> {
      if (result.isConfirmed) {
        setIsLoading(true)
        const res = await GenericDelete(params, token)
        const { data: { success, message, payload } } = res
        setIsLoading(false)
        if(success) {
        setRefreshData(true)
          CustomNotification({
            type: "success",
            title: "Deleted",
            description: message,
            key: "a4",
          })
        }
        else {
          const errorMsg = getValidationMsg(message, payload)
          if(errorMsg) 
            CustomNotification({
              type: "error",
              title: "Oppssss..",
              description: errorMsg,
              key: "b4",
            })
          else
          CustomNotification({
            type: "error",
            title: "Oppssss..",
            description: message,
            key: "b4",
          })
        }
      }
    })
    

  }

  const closeHandler = async (record) => {
    const modifiedData =[{
      ...record,
      order_type: 'close'
  }]
  
  const Params  = {orders:modifiedData}
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#1CAC70",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Close it!"
  }).then(async(result)=> {
    if (result.isConfirmed) {
    setIsLoading(true)
      const res = await UpdateMultiTradeOrder(Params,token)
      const { data: { success, message, payload } } = res
      setIsLoading(false)
      if (success) {
        // const res = await Search_Live_Order(token,CurrentPage,totalRecords, SearchQueryList  )
        // dispatch(setLiveOrdersData(res?.data?.payload?.data))
        const updated_balance = Number(balance) + Number(record.profit)
        dispatch(updateTradingAccountGroupBalance(updated_balance))
        setRefreshData(true)
        CustomNotification({
          type: "success",
          title: "Order Closed",
          description: message,
          key: "a4",
        })
      } else {
        CustomNotification({
          type: "error",
          title: "Oppssss..",
          description: message,
          key: "b4",
        })
      }

    }
  })
  
  }
  
  const defaultCheckedList = columns.map((item) => item.key);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [newColumns , setNewColumns] = useState(columns)

  const headerStyle = {
    background: TableHeaderColor,
    color: 'black',
  };


 const onPageChange = (page) =>{
      // fetchLiveOrder(page)
  }
  // const CancelLiveOrder = async (id) => {

  //  const requiredOrder = tradeOrder.find((order)=>order.id === id)

  //   setIsLoading(true)
  //   const currentDateISO = new Date().toISOString();
  //   // const currentDate = new Date(currentDateISO);
  //   // const formattedDate = moment(currentDate).format('MM/DD/YYYY HH:mm');
  //   const closeOrderData = {
  //       order_type : 'close',
  //       close_time: currentDateISO,
  //       close_price : requiredOrder.open_price

  //     }
  //     try{
  //       const res = await Put_Trade_Order(id,closeOrderData, token)
  //       const { data: { message, payload, success } } = res
  //       if (success) {
        
  //       CustomNotification({ type: "success", title: "Live Order", description: message, key: 1 })
  //       fetchLiveOrder(page)       
      
  //     }
  //     else {
      
  //       CustomNotification({ type: "error", title: "Live Order", description: message, key: 1 })

  //     }
  //     }catch(error){
  //       CustomNotification({ type: "error", title: "Live Order", description: error.message, key: 1 })

  //     }
        
  // }

  useEffect(() => {
  const newCols = columns.filter(x => checkedList.includes(x.key));
  setNewColumns(newCols)
  }, [checkedList]);

  useEffect(() => {
    // debugger;
    // fetchLiveOrder(CurrentPage)
    SetSearchQueryList({trading_account_id,order_types:['market']})
  }, [])
  useEffect(()=>{
    UpdateTradingAccountStatus()
   
  }, [grandProfit,lotSize,accountLeverage, equity_g, margin, free_margin, margin_level, totalSwap ])

    const LoadingHandler = React.useCallback((isLoading)=>{
    setIsLoading(isLoading)
  },[])


  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        if(liveOrdersData.length > 0){
          const modifiedData = liveOrdersData.map(item => {
            return {
                ...item,
                order_type: ''
            };
        });
          const Params  = {orders:modifiedData}
          const res = await UpdateMultiTradeOrder(Params, token);
        }
       
      } catch (error) {
        console.error('Error calling API:', error);
      }
    }, 30000); // Interval set to 1000ms (1 second)
    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  //#region Update Trading Account 
  const UpdateTradingAccountStatus = async()=>{
    const Params = {
      margin_level_percentage:checkNaN(margin_level),
      equity: checkNaN(equity_g) ,
      commission: checkNaN(grandCommsion),
      profit:checkNaN(grandProfit),
      swap: checkNaN(totalSwap),
      free_margin:checkNaN(free_margin),
      ...(margin_level < brand_margin_call && { status: "margin_call" })
    }
    const res = await Put_Trading_Account(id, Params, token)
    dispatch(updateMultipleFields(Params))
  }
  return (
    <Spin spinning={isLoading} size="large">
      <div className='p-8' style={{ backgroundColor: colorBG }}>
         <CustomTable
            direction="/single-trading-accounts/details/live-order-entry"
            formName = "Trading Live Orders" 
            columns={columns}
            // data={tradeOrder} 
            headerStyle={headerStyle}
            total={totalRecords}
            setTotalRecords={setTotalRecords}
            onPageChange = {onPageChange}
            current_page={CurrentPage}
            token = {token}
            summary={() => (
              <Table.Summary fixed>
                <Table.Summary.Row className='bg-gray-300'>
                  <Table.Summary.Cell index={0} colSpan={11}>
                    <span className='text-sm font-bold text-arial'>
                      <MinusCircleOutlined /> 
                      Balance: {checkNaN(balance)} {CurrencyName} &nbsp;
                      Equity: {checkNaN(equity_g)} &nbsp;
                      Credit: {checkNaN(credit)}  &nbsp;
                      Bonus: {checkNaN(bonus)}  &nbsp;
                      Total Withdraw: {checkNaN(total_withdraw)}  &nbsp;
                      <span> Margin: {checkNaN(margin)}</span>&nbsp;
                      Free Margin: {checkNaN(free_margin)} &nbsp;
                       <span>Margin Level: {checkNaN(margin_level)} %</span>
                    </span>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>{checkNaN(totalSwap)}</Table.Summary.Cell>
                  <Table.Summary.Cell>{checkNaN(grandProfit)}</Table.Summary.Cell>
                  <Table.Summary.Cell>{checkNaN(grandCommsion)}</Table.Summary.Cell>
                  <Table.Summary.Cell></Table.Summary.Cell>
                
                </Table.Summary.Row>
              </Table.Summary>
            )}
            isUpated={isUpdated}
            setSelecetdIDs={setLiveOrdersSelectedIds}
            setTableData = {setLiveOrdersData}
            table_name= "trade_orders"
            setSortDirection = {setSortDirection}
            perPage={perPage}
            setPerPage={setPerPage}
            SearchQuery = {Search_Live_Order}
            searchQueryManipulation = {setManipulatedData}
            SearchQueryList = {SearchQueryList}
            LoadingHandler={LoadingHandler}
            setCurrentPage={setCurrentPage}
            setLastPage={setLastPage}
            refreshData={refresh_data}
            editPermissionName="live_orders_update"
            deletePermissionName="live_orders_delete"
            setRefreshData={setRefreshData}
          />
      </div>
    </Spin>
  )
}

export default LiveOrders