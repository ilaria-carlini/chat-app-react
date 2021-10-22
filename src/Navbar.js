import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import * as React from 'react';
import Box from '@mui/material/Box';
import localStorage from 'local-storage';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import IconButton from '@mui/material/IconButton';
import { useHistory } from "react-router-dom";
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';

export default function Navbar(props) {
  const { children, value, index, ...other } = props;
  let history = useHistory();

  const [windowUrl, setWindowUrl] = React.useState(0);
  let isInChat = true;

  useEffect(() => {
    getWindowUrl();

    async function getWindowUrl() {
      isInChat = false;
      let str = window.location.href;
      if (str.includes('/chat')) {
        isInChat = true;
      }
      setWindowUrl(isInChat);
    }
  });

  const handleLogout = async (event) => {
    event.preventDefault();
    if (localStorage.get('user-logged-in') != null) {
      localStorage.remove('user-logged-in');
      history.push("/login");
    }
  };

  const handleGoBack = async (event) => {
    event.preventDefault();
    history.push("/");
  };

  return (
    <Box sx={{ width: '100%' }}>
      <AppBar position="static">
        <Toolbar>
          { isInChat && 
              <IconButton
              size="large"
              onClick={handleGoBack}
              color="inherit"
            >
              <ArrowBackIosIcon />
            </IconButton>     
          }
          <Typography  component="div" sx={{ flexGrow: 1 }}>
            Back
          </Typography>

          { localStorage.get('user-logged-in') != null && (
            <IconButton
              size="large"
              onClick={handleLogout}
              color="inherit"
            >
              <LogoutIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

