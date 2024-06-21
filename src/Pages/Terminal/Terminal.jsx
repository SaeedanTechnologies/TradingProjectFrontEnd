import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import ResponsiveAppbar from './molecules/ResponsiveAppbar'
import SidebarMenu from './molecules/MenuBar'
import { Stack } from '@mui/material';
import { Outlet } from 'react-router-dom';
import TradingInformation from './molecules/TradingInformation';

function ResponsiveDrawer(props) {





  return (
    <Box sx={{ display: 'flex',flexDirection:"column" }}>
     <ResponsiveAppbar/>
     <Stack direction="row">
      <SidebarMenu/>
        <Outlet/>
        <TradingInformation/>

     </Stack>
     
    
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;
