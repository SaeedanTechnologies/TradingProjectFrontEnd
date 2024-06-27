import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/material';
import { Search_Live_Order } from '../../../utils/_TradingAPICalls';
import { useSelector } from 'react-redux';
import { theme,Space } from 'antd';
import { CloseOutlined,EditOutlined,DeleteOutlined } from '@mui/icons-material';
import moment from 'moment';
import CustomNotification from '../../../components/CustomNotification';
import Swal from 'sweetalert2';
import { GenericDelete, UpdateMultiTradeOrder } from '../../../utils/_APICalls';
import { calculateNights, calculateNumOfPip, calculateProfitLoss, getCurrentDateTime, getOpenPriceFromAPI, getValidationMsg } from '../../../utils/helpers';
import CustomModal from '../../../components/CustomModal';
import EditActiveOrders from './EditActiveOrders';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#E3E3E3',
    color: theme.palette.common.black,
    fontSize:"12px",
    fontWeight:500
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: '12px',

  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
 
  // hide last border
  'td, th': {
    border: 0,
    padding:3
  },
}));







export default function ActiveOrders() {


    const [rows,setRows] = React.useState([])
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const token = useSelector(({ terminal }) => terminal?.user?.token)
    const trading_account_id = useSelector((state) => state?.terminal?.user?.trading_account?.id)
    const { token: { colorPrimary }} = theme.useToken();
    const [activeOrder,setActiveOrder] = React.useState(null);


  const handleOk = () => {
    setIsModalOpen(false);
  };


  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const setLiveManipulatedData = async (data) => {

    const currentDateTime = getCurrentDateTime();
    const updatedData = await Promise.all(data.map(async (x) => {
      const response = await getOpenPriceFromAPI(x?.symbol, x?.feed_name);
      if (response && typeof response === 'object' && 'askPrice' in response && 'bidPrice' in response) {
         const { askPrice, bidPrice } = response;
        const pipVal = x?.symbol_setting?.pip ? x?.symbol_setting?.pip : 5;
        const open_price = parseFloat(x?.open_price).toFixed(pipVal);
        const currentPrice = x?.type === "sell" ? parseFloat(askPrice).toFixed(pipVal) ?? 0 : parseFloat(bidPrice).toFixed(pipVal) ?? 0;
        const profit = calculateProfitLoss(parseFloat(calculateNumOfPip(currentPrice, parseFloat(x?.open_price), x?.type, parseInt(pipVal))).toFixed(2), parseFloat(x?.volume));
        const totalNights = calculateNights(x?.created_at, currentDateTime);
        const Calswap = parseFloat(x?.volume) * totalNights * parseFloat(x?.symbol_setting?.swap ?? 0);
        const swap = Calswap > 0 ? -Calswap : Calswap;
        return { ...x, swap, profit, currentPrice, open_price };
      } else {
        // Handle cases where properties are missing or response is invalid
        console.error('Missing askPrice or bidPrice in response:', response);
        // You can return a default value or handle the error differently
        return { ...x, swap: 0, profit: 0, currentPrice: 0, open_price: x?.open_price };
      }
    }));
    setRows(updatedData)
    return updatedData;
  }


  
  const fetchActiveOrders = async()=>{
 
    const res = await Search_Live_Order(token,1,10,{trading_account_id,order_types:['market']})
    // setRows(res?.data?.payload?.data)
    setLiveManipulatedData(res?.data?.payload?.data)

  }

  const closeHandler = async (record) => {
    const modifiedData =[{
      ...record,
      trading_account_id,
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
      const res = await UpdateMultiTradeOrder(Params,token)
      const { data: { success, message, payload } } = res
      if (success) {
        CustomNotification({
          type: "success",
          title: "Order Closed",
          description: message,
          key: "a4",
        })
        fetchActiveOrders()
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


  const editHandler = (order)=>{
    setActiveOrder(order)
    setIsModalOpen(true)
  }

  React.useEffect(()=>{
  fetchActiveOrders()
},[])


  return (
    <>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell align="center">Symbol</StyledTableCell>
            <StyledTableCell align="center">ID</StyledTableCell>
            <StyledTableCell align="center">Type</StyledTableCell>
            <StyledTableCell align="center">Volume</StyledTableCell>
            <StyledTableCell align="center">Open Price</StyledTableCell>
            <StyledTableCell align="center">Open Time</StyledTableCell>
             <StyledTableCell align="center">Current Price</StyledTableCell>
            <StyledTableCell align="center">SL</StyledTableCell>
            <StyledTableCell align="center">TP</StyledTableCell>
            <StyledTableCell align="center">Price</StyledTableCell>
            <StyledTableCell align="center">Commission</StyledTableCell>
            <StyledTableCell align="center">Swap</StyledTableCell>
            <StyledTableCell align="center">Profit</StyledTableCell>
            <StyledTableCell align="start" colSpan={2}>Actions</StyledTableCell>

            
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell align="center">
                {row.symbol}
              </StyledTableCell>
              <StyledTableCell align="center">{row.id}</StyledTableCell>
              <TableCell sx={{color:"#0ECB81"}} align="center">{row.type}</TableCell>
              <StyledTableCell align="center">{row.volume}</StyledTableCell>
              <StyledTableCell align="center">{row.open_price}</StyledTableCell>
              <StyledTableCell align="center">{moment(row.open_time).format('D MMMM YYYY h:mm A')}</StyledTableCell>
              <StyledTableCell align="center">{row.currentPrice ? row.currentPrice:"-"}</StyledTableCell>
              <StyledTableCell align="center">{row.stopLoss ? row.stopLoss:"-"}</StyledTableCell>
              <StyledTableCell align="center">{row.takeProfit ? row.takeProfit:"-"}</StyledTableCell>
              <StyledTableCell align="center">{row.price ? row.price: "-"}</StyledTableCell>
              <StyledTableCell align="center">{row.commission ? row.commission: "-" }</StyledTableCell>
              <StyledTableCell align="center">{row.swap? row.swap: "-" }</StyledTableCell>
              <StyledTableCell align="center">{row.profit? row.profit: "-" }</StyledTableCell>

              <TableCell align="center" colSpan={2}>
                <Space size="middle" className='cursor-pointer'>
                  <CloseOutlined style={{ fontSize: "24px", color: colorPrimary }} 
                  onClick={(e) => {
                    e.stopPropagation();
                    closeHandler(row);
                  }}
                  />
                  <EditOutlined 
                   style={{fontSize:"20px", color: colorPrimary }}
                   onClick={(e)=>{
                    e.stopPropagation();
                    editHandler(row)
                   }}
                   />
                 
                </Space >
               
              </TableCell>
            </StyledTableRow>
                        ))}
        </TableBody>
      </Table>
    </TableContainer>
     <CustomModal
          isModalOpen={isModalOpen}
          handleOk={handleOk}
          handleCancel={handleCancel}
          title={''}
          width={800}
          footer={null}
        >
          <EditActiveOrders 
          setIsModalOpen={setIsModalOpen}
          activeOrder={activeOrder}
          fetchActiveOrders={fetchActiveOrders}
        
        />
      </CustomModal>
     </>   
  );
}
