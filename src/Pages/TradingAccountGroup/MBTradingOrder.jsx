import React, { useEffect, useState } from 'react'
import { PlusCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

import ARROW_BACK_CDN from '../../assets/images/arrow-back.svg';
import { Link, useNavigate } from 'react-router-dom';
import { Space, theme, Spin } from 'antd';
import CustomButton from '../../components/CustomButton';
import CustomTable from '../../components/CustomTable';
import { GET_Group_Trade_Order } from '../../utils/_TradeOrderAPI';
import { useSelector } from 'react-redux';
import { setTradeGroupsData, setTradeGroupsSelectedIDs } from '../../store/tradeGroupsSlice';
// import { Spin } from 'antd';

const MBTradingOrder = () => {
  const token = useSelector(({ user }) => user?.user?.token)
  const {
    token: { colorBG, TableHeaderColor, colorPrimary },
  } = theme.useToken();
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [tradeOrder, setTradeOrder] = useState([])
  const [totalRecords, setTotalRecords] = useState(0)
  const [CurrentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [isUpdated, setIsUpdated] = useState(true)
  const [sortDirection, setSortDirection] = useState("")
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  

  const FetchTradeGroup = async () => {
    try{
      setIsLoading(true)
    const mData = await GET_Group_Trade_Order(token)
    const { data: { message, payload, success } } = mData
      setIsLoading(false)
      setTradeOrder(payload.data)
      setTotalRecords(payload.total)
      setCurrentPage(payload.current_page)
      setLastPage(payload.last_page)
      setIsUpdated(false)
    }
    catch (error) {
      console.error('Error fetching trade groups:', error);
    }
  }

  const onPageChange = () =>{
    FetchTradeGroup()
  }

  useEffect(() => {
    FetchTradeGroup()
  }, [])

  const LoadingHandler = React.useCallback((isLoading)=>{
    setIsLoading(isLoading)
  },[])

  const headerStyle = {
    background: TableHeaderColor,
    color: 'black',
  };
  const columns = [
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: '1',
    },
    {
      title: 'Open Time',
      dataIndex: 'open_time',
      key: '2',
    },
    {
      title: 'Close Time',
      dataIndex: 'close_time',
      key: '3',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: '4',
    },
    {
      title: 'Volume',
      dataIndex: 'volume',
      key: '5',
    },
    {
      title: 'Open Price',
      dataIndex: 'open_price',
      key: '6',
    },
    {
      title: 'SL',
      dataIndex: 'stopLoss',
      key: '7',
    },
    {
      title: 'TP',
      dataIndex: 'takeProfit',
      key: '8',
    },
    {
      title: 'Close Price',
      dataIndex: 'close_price',
      key: '9',
    },
    {
      title: 'Profit',
      dataIndex: 'profit',
      key: '10',
    },
    // {
    //   title: 'Action',
    //   key: 'action',
    //   render: (_, record) => (
    //     <Space size="middle" className='cursor-pointer'>
    //       <Link to="/trading-group/mb-to/0/0"><EditOutlined style={{ fontSize: "24px", color: colorPrimary }} /></Link>
    //       <DeleteOutlined style={{ fontSize: "24px", color: colorPrimary }} />
    //     </Space>
    //   ),
    // },
  ];

  const data = [
    {
      key: '1',
      Symbol: 'Symbol A',
      Time: '10:00',
      Type: 'Type A',
      Volume: '100',
      Price: '50',
      SL: '45',
      TP: '55',
      Price2: '60',
      Profit: '20%',
    },
    {
      key: '2',
      Symbol: 'Symbol B',
      Time: '11:00',
      Type: 'Type B',
      Volume: '200',
      Price: '55',
      SL: '50',
      TP: '60',
      Price2: '65',
      Profit: '15%',
    },
    // Add more data objects as needed
  ];

  return (
    <Spin spinning={isLoading} size="large">
      <div className='p-8' style={{ backgroundColor: colorBG }}>
        <div className='flex gap-3 justify-between'>
          <div className='flex gap-3'>
            <img
              src={ARROW_BACK_CDN}
              alt='back icon'
              className='cursor-pointer'
              onClick={() => navigate(-1)}
            />

            <h1 className='text-3xl font-bold'>Mass Buy/Sell Trading Order</h1>
          </div>
          <CustomButton
            Text='Create New Order'
            style={{
              padding: '16px',
              height: '48px',
              borderRadius: '8px',
            }}
            onClickHandler={() => navigate('/trading-group/mb-to/create')}
          />
        </div>
        <CustomTable 
        columns={columns}
        column_name="group_unique_id" 
        data={tradeOrder} 
        headerStyle={headerStyle} 
        direction="/trading-group/mb-to"
        formName = "Mass Buy"
        total={totalRecords}
        onPageChange = {onPageChange}
        current_page={CurrentPage}
        token = {token}
        isUpated={isUpdated}
        setSelecetdIDs={setTradeGroupsSelectedIDs}
        setTableData = {setTradeGroupsData}
        table_name= "trade_orders"
        setSortDirection = {setSortDirection}
        perPage={perPage}
        setPerPage={setPerPage}
        SearchQuery = {FetchTradeGroup}
        LoadingHandler={LoadingHandler}
        />

      </div>
    </Spin>
  )
}

export default MBTradingOrder