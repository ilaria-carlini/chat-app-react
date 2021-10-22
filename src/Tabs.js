import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import MessageIcon from '@mui/icons-material/Message';
import { useHistory } from "react-router-dom";
import localStorage from 'local-storage';
import { useState, useEffect } from 'react';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.05),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.08),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  border: 'alpha(theme.palette.common.black, 1) solid'
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {

  // const BASE_URL = 'https://0.0.0.0:8080';
  const BASE_URL = 'https://chat-server-challenge.herokuapp.com';

  let history = useHistory();

  if (localStorage.get('user-logged-in') == null) {
      history.push("/login");
  }

  const [value, setValue] = React.useState(0);
  const [contacts, setContacts] = useState(null);
  const [profile, setProfile] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getContacts();
    getProfile();

    async function getProfile() {
      const response = await fetch(`${BASE_URL}/profile`, {
        method: "GET",
        headers: { "content-type": "application/json" },
        credentials: "include",
      });      
      const data = await response.json();
      setProfile(data) ;
    }
  }, []);


  async function getContacts() {
    const response = await fetch(`${BASE_URL}/contacts?q=${search}`, {
      method: "GET",
      headers: { "content-type": "application/json" },
      credentials: "include",
    });      
    const data = await response.json();
    setContacts(data);

    setTimeout(() => getContacts(), 5000);
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChat = async (contact) => {
    history.push(`/chat/${contact.id}`);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant="fullWidth">
          <Tab label="Contacts" {...a11yProps(0)} />
          <Tab label="Profile" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>

      <Search onChange={(e) => {setSearch(e.target.value) && getContacts()}} value={search}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>

      {contacts && (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        { contacts.map((contact) => {
          return (
            <ListItemButton key={contact.id} onClick={handleChat.bind(this, contact)}>
              <ListItemAvatar>
                <Avatar alt={contact.username} src={contact.avatar} />
              </ListItemAvatar>
              <ListItemText
                primary={contact.name+' '+contact.surname}
              />

              <Badge badgeContent={contact.history.unreadCount} color="primary">
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  color="inherit"
                >
                  <MessageIcon />
                </IconButton>
              </Badge>
            </ListItemButton>
          );
        })}
      </List>
      )}
      </TabPanel>
      <TabPanel value={value} index={1}>
        { profile && (
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}> 
            <Avatar 
              alt={profile.username} 
              src={profile.avatar} 
              sx={{ width: 100, height: 100 }} 
              style={{margin: '10px auto 30px auto'}} 
            />
            <Divider />
            <ListItem key={profile.username}>
              <ListItemText
                primary={profile.username}
                secondary="Username"
              />
            </ListItem>
            <Divider />
            <ListItem key={profile.email}>
                <ListItemText
                  primary={profile.email}
                  secondary="Email"
                />
              </ListItem>
          </List>
        )}
      </TabPanel>
    </Box>
  );
}

