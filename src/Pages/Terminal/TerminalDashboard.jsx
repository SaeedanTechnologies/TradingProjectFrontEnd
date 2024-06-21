import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import ResponsiveAppbar from './molecules/ResponsiveAppbar'
import SidebarMenu from './molecules/MenuBar'
import { Stack,Grid } from '@mui/material';
import { Outlet } from 'react-router-dom';
import TradingInformation from './molecules/TradingInformation';

function TerminalDashboard(props) {





  return (
    <Box sx={{ display: 'flex',flexDirection:"column" }}>
     <ResponsiveAppbar/>
     <Grid container columnGap={2}>

         
        <Grid item xs={2}>
           <SidebarMenu/> 
        </Grid>
        <Grid item xs={2} sx={{boxShadow: '24px 0px 80px 0px rgba(49, 79, 124, 0.1)'}}>
          <Outlet/>
        </Grid>
        <Grid item xs={7.6}>
           <TradingInformation/>
        
        </Grid>
        
      </Grid>
   
     
    
    </Box>
  );
}

TerminalDashboard.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default TerminalDashboard;
