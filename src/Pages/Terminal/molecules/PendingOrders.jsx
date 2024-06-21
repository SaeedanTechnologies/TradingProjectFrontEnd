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
import {  DeleteOutlined } from '@mui/icons-material';

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
  '&:last-child td, &:last-child th': {
    backgroundColor: '#E3E3E3',
    color: theme.palette.common.black,
    fontWeight:600
  },
}));

function createData(time, order_id, type,volume, symbol, price,stop_loss,take_profit,reason,swap,profit) {
  return { time, order_id, type,volume, symbol, price,stop_loss,take_profit,reason,swap,profit};
}

const rows = [
  createData('02/20...', 500092, 'Buy', 0.1, 'cajpy',1000,0.00,0.00,'Deposit',0.01),  
  createData('02/20...', 500092, 'Buy', 0.1, 'cajpy',1000,0.00,0.00,'Deposit',0.01),  
  createData('02/20...', 500092, 'Buy', 0.1, 'cajpy',1000,0.00,0.00,'Deposit',0.01),  
  createData('02/20...', 500092, 'Buy', 0.1, 'cajpy',1000,0.00,0.00,'Deposit',0.01),  
  createData('02/20...', 500092, 'Buy', 0.1, 'cajpy',1000,0.00,0.00,'Deposit',0.01),  
  createData('02/20...', 500092, 'Buy', 0.1, 'cajpy',1000,0.00,0.00,'Deposit',0.01),  
  createData('02/20...', 500092, 'Buy', 0.1, 'cajpy',1000,0.00,0.00,'Deposit',0.01),  
  createData('02/20...', 500092, 'Buy', 0.1, 'cajpy',1000,0.00,0.00,'Deposit',0.01),  



];

export default function PendingOrders() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Time</StyledTableCell>
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

            
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.order_id}>
              <StyledTableCell  scope="row">
                {row.time}
              </StyledTableCell>
              <StyledTableCell align="center">{row.order_id}</StyledTableCell>
              <StyledTableCell align="center">{row.type}</StyledTableCell>
              <StyledTableCell align="center">{row.volume}</StyledTableCell>
              <StyledTableCell align="center">{row.symbol}</StyledTableCell>
              <StyledTableCell align="center">{row.price}</StyledTableCell>
              <StyledTableCell align="center">{row.stop_loss}</StyledTableCell>
              <StyledTableCell align="center">{row.take_profit}</StyledTableCell>
             
              <TableCell align="center">{row.reason}</TableCell>
              <StyledTableCell align="center">{row.swap}</StyledTableCell>
              <TableCell align="center" colSpan={2}>
                <Box display="flex" gap={2}>
                       
                <IconButton>
                    <DeleteOutlined sx={{ color: '#1CAC70' }} />
                  </IconButton>
                </Box>
              </TableCell>
            </StyledTableRow>
                        ))}
          <StyledTableRow>
            <TableCell>-</TableCell>
            <TableCell  align="center">Profit: -0.20</TableCell>
            <StyledTableCell align="center">Deposit: 1,000.00</StyledTableCell>
            <TableCell colSpan={3} align="center">Width: 0.0</TableCell>
            <TableCell colSpan={2} align="center">Credit: 0.0</TableCell>
            <TableCell colSpan={3} align="center">Balance: 894.49</TableCell>
          

            
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
