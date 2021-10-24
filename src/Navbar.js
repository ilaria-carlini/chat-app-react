import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import * as React from 'react';
import Box from '@mui/material/Box';

export default function Navbar(props) {
  return (
    <Box sx={{ width: '100%' }}>
      <AppBar position="static">
        <Toolbar>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

