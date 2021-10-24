import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useHistory } from "react-router-dom";
import localStorage from 'local-storage';
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from 'react';

const theme = createTheme();
const ENDPOINT = 'https://chat-server-challenge.herokuapp.com';
export default function Login() {
  let history = useHistory();
  const [login, setLogin] = useState(false);

  const handleSubmit = async (event) => {
    setLogin(true);
    event.preventDefault();    
    const data = new FormData(event.currentTarget);

    if (data.get('email') !== "" && data.get('password') !== "") {
      const json = {
        username: data.get('email'),
        password: data.get('password')
      };

      fetch(`${ENDPOINT}/login`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(json),
        credentials: "include",
      })
      .then(res => {
        return res.json()
        .then(data => {
          res.data = data;
          return res;
        })
      })
      .then(res => {
        if (res.status === 200) {
          localStorage.set('AUTH', res.data.id);
          setLogin(false);
          history.push("/");
        } else throw new Error(res.status);
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Authentication
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            { login && (
              <div style={{position: "absolute", left: '50%', top: '50%',
              transform: 'translate(-50%, -50%)'}}>
              <CircularProgress />
              </div>
            )} 
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}