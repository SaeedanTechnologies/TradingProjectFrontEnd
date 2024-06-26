import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box,IconButton } from '@mui/material';
import {  EditOutlined,DeleteOutlined } from '@mui/icons-material';
import { Search_Pending_Order } from '../../../utils/_TradingAPICalls';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { theme,Space } from 'antd';
import Swal from 'sweetalert2';
import CustomNotification from '../../../components/CustomNotification';
import { getValidationMsg } from '../../../utils/helpers';
import { GenericDelete } from '../../../utils/_APICalls';
import CustomModal from '../../../components/CustomModal';
import EditPendingOrder from './EditPendingOrder';
import {  checkNaN } from '../../../utils/helpers';
import { MinusCircleOutlined } from '@ant-design/icons';


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
'&:last-child td, &:last-child th': {
    border: 0,
    backgroundColor: theme.palette.action.hover,
  },
}));



export default function PendingOrders() {
  
   const [rows,setRows] = React.useState([])
   const [isModalOpen, setIsModalOpen] = React.useState(false);
   const [pendingOrder,setPendingOrder] = React.useState(null)
   const token = useSelector(({ terminal }) => terminal?.user?.token)
   const user = useSelector((state)=>state?.terminal?.user?.trading_account)
   const trading_account_id = useSelector((state) => state?.terminal?.user?.trading_account?.id)
   const {token: { colorPrimary }} = theme.useToken();


  const fetchPendingOrders = async()=>{
     const res = await Search_Pending_Order(token,1,10,{trading_account_id,order_types:['pending']})
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
          fetchPendingOrders()
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


  const editHandler = (order)=>{
    setPendingOrder(order)
    setIsModalOpen(true)
  }

   const handleOk = () => {
    setIsModalOpen(false);
  };


  const handleCancel = () => {
    setIsModalOpen(false);
  };


  React.useEffect(()=>{
  fetchPendingOrders()

},[])


  return (
    <>
     <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell align="center">Time</StyledTableCell>
            <StyledTableCell align="center">Order No.</StyledTableCell>
            <StyledTableCell align="center">Type</StyledTableCell>
            <StyledTableCell align="center">Volume</StyledTableCell>
            <StyledTableCell align="center">Symbol</StyledTableCell>
            <StyledTableCell align="center">Price</StyledTableCell>
            <StyledTableCell align="center">SL</StyledTableCell>
            <StyledTableCell align="center">TP</StyledTableCell>
            <StyledTableCell align="center">Reason</StyledTableCell>
            <StyledTableCell align="center">Swap</StyledTableCell>
            <StyledTableCell align="center" colSpan={2}>Actions</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {rows?.map((row) => (
            <StyledTableRow key={row?.id}>
              <StyledTableCell  align="center"> {moment(row?.open_time).format('MM/DD/YYYY HH:mm')}</StyledTableCell>
              <StyledTableCell align="center">{row?.id}</StyledTableCell>
              <StyledTableCell align="center">{row?.type ? row?.type :"-"}</StyledTableCell>
              <StyledTableCell align="center">{row?.volume ? row?.volume : "-" }</StyledTableCell>
              <StyledTableCell align="center">{row?.symbol ? row?.symbol : "-"}</StyledTableCell>
              <StyledTableCell align="center">{row?.open_price ? row?.open_price :"-"}</StyledTableCell>
              <StyledTableCell align="center">{row?.stopLoss? row?.stopLoss: "-" }</StyledTableCell>
              <StyledTableCell align="center">{row?.takeProfit ? row?.takeProfit : "-"}</StyledTableCell>
              <StyledTableCell align="center">{row?.reason ? row?.reason : "-"}</StyledTableCell>
              <StyledTableCell align="center">{row?.swap ? row?.swap : "-"}</StyledTableCell>
              <TableCell align="center" colSpan={2}>
                <Space size="middle" className='cursor-pointer'>
                  <EditOutlined 
                   style={{fontSize:"20px", color: colorPrimary }}
                   onClick={(e)=>{
                    e.stopPropagation();
                    editHandler(row)
                   }}
                   />
                <DeleteOutlined style={{fontSize:"24px", color: colorPrimary }} 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteHandler(row?.id);
                  }}
                  />
                </Space >
              </TableCell>
            </StyledTableRow>
                        ))}
            <StyledTableRow>
                  <TableCell colSpan={14} >
                    <span className='text-xs font-bold text-arial'>
                    <MinusCircleOutlined /> {" "}
                    Balance: {checkNaN(user?.balance)} {user?.currency} &nbsp;
                    Credit: {checkNaN(user?.credit)}  &nbsp;
                    Bonus: {checkNaN(user?.bonus)}  &nbsp;
                  </span>
                </TableCell>
            </StyledTableRow>                

          
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
          <EditPendingOrder
          setIsModalOpen={setIsModalOpen}
          pendingOrder={pendingOrder}
          fetchPendingOrders={fetchPendingOrders}
        
        />
     </CustomModal>
    
    </>
   
  );
}
