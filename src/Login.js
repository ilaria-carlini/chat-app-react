import * as React from 'react';
import axios from 'axios';
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

const theme = createTheme();

export default function Login() {

  let history = useHistory();

  // const BASE_URL = 'http://0.0.0.0:8080';
  const BASE_URL = 'https://chat-server-challenge.herokuapp.com';

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (data.get('email') != "" && data.get('password') != "") {

      const json = {
        username: data.get('email'),
        password: data.get('password')
      };

      // const fakeJson = {
      //   username: 'tizio',
      //   password: 'tizio.secret'
      // }
      

      // const caioJson = {
      //   username: 'caio',
      //   password: 'caio.secret'
      // }

      fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(json),
        credentials: "include",
      })
      // const res = await axios.post(`${BASE_URL}/login`, fakeJson, {
      //   withCredentials: true,
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // })
      .then(res => {
        return res.json()
        .then(data => {
          res.data = data;
          return res;
        })
      })
      .then(res => {
        if (res.status === 200) {
          history.push("/");
          localStorage.set('user-logged-in', res.data);
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
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
