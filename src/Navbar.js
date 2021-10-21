import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (

    // <Box sx={{ width: '100%' }}>
    //   <AppBar position="static">
    //     <Toolbar>
    //       <Button color="inherit">Logout</Button>
    //     </Toolbar>
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
    //   </AppBar>
    // </Box>
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
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
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
        Contacts
      </TabPanel>
      <TabPanel value={value} index={1}>
        Profile
      </TabPanel>
    </Box>
  );
}

