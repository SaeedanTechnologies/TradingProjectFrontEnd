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
    border: 0,
  },
}));

function createData(symbol, id, type, volume, open_price,open_time,stop_loss,take_profit,price,commission,swap,pnl) {
  return { symbol, id, type, volume, open_price,open_time,stop_loss,take_profit,price,commission,swap,pnl };
}

const rows = [
  createData('AUD / CHF', 500092, 'Buy', 1000, 0.4843,'3/12/2023 09:12 AM','-','-',0.573,'$0.0','$0.0','$0.18'),  
  createData('AUD / CHF', 500092, 'Buy', 1000, 0.4843,'3/12/2023 09:12 AM','-','-',0.573,'$0.0','$0.0','$0.18'),
  createData('AUD / CHF', 500092, 'Buy', 1000, 0.4843,'3/12/2023 09:12 AM','-','-',0.573,'$0.0','$0.0','$0.18'),
  createData('AUD / CHF', 500092, 'Buy', 1000, 0.4843,'3/12/2023 09:12 AM','-','-',0.573,'$0.0','$0.0','$0.18'),
  createData('AUD / CHF', 500092, 'Buy', 1000, 0.4843,'3/12/2023 09:12 AM','-','-',0.573,'$0.0','$0.0','$0.18'),
  createData('AUD / CHF', 500092, 'Buy', 1000, 0.4843,'3/12/2023 09:12 AM','-','-',0.573,'$0.0','$0.0','$0.18'),
  createData('AUD / CHF', 500092, 'Buy', 1000, 0.4843,'3/12/2023 09:12 AM','-','-',0.573,'$0.0','$0.0','$0.18'),
  createData('AUD / CHF', 500092, 'Buy', 1000, 0.4843,'3/12/2023 09:12 AM','-','-',0.573,'$0.0','$0.0','$0.18'),

];

export default function OrdersHistory() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Symbol</StyledTableCell>
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
            <StyledTableCell align="center">PnL</StyledTableCell>
            <StyledTableCell align="center" colSpan={2}>Actions</StyledTableCell>

            
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell  scope="row">
                {row.symbol}
              </StyledTableCell>
              <StyledTableCell align="center">{row.id}</StyledTableCell>
              <TableCell sx={{color:"#0ECB81"}} align="center">{row.type}</TableCell>
              <StyledTableCell align="center">{row.volume}</StyledTableCell>
              <StyledTableCell align="center">{row.open_price}</StyledTableCell>
              <StyledTableCell align="center">{row.open_time}</StyledTableCell>
              <StyledTableCell align="center">{row.stop_loss}</StyledTableCell>
              <StyledTableCell align="center">{row.take_profit}</StyledTableCell>
              <StyledTableCell align="center">{row.price}</StyledTableCell>
              <StyledTableCell align="center">{row.commission}</StyledTableCell>
              <StyledTableCell align="center">{row.swap}</StyledTableCell>
              <TableCell sx={{color:"#0ECB81"}} align="center">{row.pnl}</TableCell>
              <TableCell align="center" colSpan={2}>
                <Box display="flex" gap={2}>
                        <span >Edit</span>
                        <span >Delete</span> 
                </Box>
              </TableCell>
            </StyledTableRow>
                        ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
