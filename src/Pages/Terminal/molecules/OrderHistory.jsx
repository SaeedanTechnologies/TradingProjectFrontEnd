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
import { useSelector } from 'react-redux';
import { Search_Close_Order } from '../../../utils/_TradingAPICalls';
import moment from 'moment';
import { theme,Space } from 'antd';
import { getValidationMsg } from '../../../utils/helpers';
import { GenericDelete } from '../../../utils/_APICalls';
import {  DeleteOutlined } from '@mui/icons-material';
import Swal from 'sweetalert2';



const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#E3E3E3',
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
 
  // hide last border
  'td,th': {
    border: 0,
    padding:3
  },
}));



export default function OrdersHistory() {

   const [rows,setRows] = React.useState([])
   const token = useSelector(({ terminal }) => terminal?.user?.token)
   const trading_account_id = useSelector((state) => state?.terminal?.user?.trading_account?.id)
   const {
    token: { colorPrimary },
  } = theme.useToken();

  const fetchOrdersHistory = async()=>{

 
    const res = await Search_Close_Order(token,1,10,{trading_account_id,order_types:['close']})
     setRows(res?.data?.payload?.data)
  }


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
        const res = await GenericDelete(params, token)
        const { data: { success, message, payload } } = res
        if(success) {
          CustomNotification({
            type: "success",
            title: "Deleted",
            description: message,
            key: "a4",
          })
          fetchOrdersHistory()
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


  React.useEffect(()=>{
  fetchOrdersHistory()
},[])


  return (
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
            <StyledTableCell align="center">SL</StyledTableCell>
            <StyledTableCell align="center">TP</StyledTableCell>
            <StyledTableCell align="center">Price</StyledTableCell>
            <StyledTableCell align="center">Commission</StyledTableCell>
            <StyledTableCell align="center">Swap</StyledTableCell>
            <StyledTableCell align="center" colSpan={2}>Actions</StyledTableCell>

            
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell  align="center">
                {row.symbol}
              </StyledTableCell>
              <StyledTableCell align="center">{row.id}</StyledTableCell>
              <TableCell sx={{color:"#0ECB81"}} align="center">{row.type}</TableCell>
              <StyledTableCell align="center">{row.volume}</StyledTableCell>
              <StyledTableCell align="center">{row.open_price}</StyledTableCell>
              <StyledTableCell align="center">{ moment(row.open_time).format('MM/DD/YYYY HH:mm')}</StyledTableCell>
              <StyledTableCell align="center">{ row.stop_loss ? row.stop_loss:"-"}</StyledTableCell>
              <StyledTableCell align="center">{row.take_profit ? row.take_profit:"-"}</StyledTableCell>
              <StyledTableCell align="center">{row.price ? row.price:"-"}</StyledTableCell>
              <StyledTableCell align="center">{row.commission ? row.commission:"-"}</StyledTableCell>
              <StyledTableCell align="center">{row.swap ? row.swap:"-"}</StyledTableCell>
              <TableCell align="center" colSpan={2}>
                
                 <Space size="middle" className='cursor-pointer'>
                
                  <DeleteOutlined style={{fontSize:"24px", color: colorPrimary }} 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteHandler(row.id);
                  }}
                  />
                </Space >
              </TableCell>
            </StyledTableRow>
                        ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
