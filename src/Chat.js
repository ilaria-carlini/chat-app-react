import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import SendIcon from '@material-ui/icons/Send';
import Button from '@mui/material/Button';
import { useHistory } from "react-router-dom";
import localStorage from 'local-storage';
import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import LogoutIcon from '@mui/icons-material/Logout';

const ENDPOINT = "https://chat-server-challenge.herokuapp.com";

const useStyles = makeStyles({
  messageArea: {
    height: '471px',
    overflowY: 'auto'
  },
  chatGridLeft: {
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    padding: '10px 20px', 
    borderRadius: '30px'
  },
  chatGridRight: {
    backgroundColor: 'aliceblue',
    padding: '10px 20px', 
    borderRadius: '30px'
  }
});

const Chat = (props) => {
    let history = useHistory();
    if (localStorage.get('AUTH') == null) {
        history.push("/login");
    } 
    const [chat, setChat] = useState(null);
    const [profile, setProfile] = useState(null);
    const [speaker, setSpeaker] = useState(null);
    const [message, setMessage] = useState('');
    const messageEnd = useRef(null);

    useEffect(() => {
        getChat();
        getProfile();
        getSpeaker();
        executeScroll();

        async function getChat() {
            const response = await fetch(`${ENDPOINT}/contacts/${props.match.params.id}/history`, {
                method: "GET",
                headers: { "content-type": "application/json" },
                credentials: "include",
            });      
            const data = await response.json();
            setChat(data);
            executeScroll()
        }

        async function getProfile() {
          const response = await fetch(`${ENDPOINT}/profile`, {
            method: "GET",
            headers: { "content-type": "application/json" },
            credentials: "include",
          });      
          const data = await response.json();
          setProfile(data) ;
        }

        async function getSpeaker() {
            const response = await fetch(`${ENDPOINT}/contacts/${props.match.params.id}`, {
                method: "GET",
                headers: { "content-type": "application/json" },
                credentials: "include",
            });      
            const data = await response.json();
            setSpeaker(data);
        }

        const socket = io(ENDPOINT);
        socket.on("chat message", () => {
            getChat()
        });
    }, [props.match.params.id]);

    function executeScroll() {
        if (!messageEnd.current) return;
        messageEnd.current.scrollIntoView({ block: "start", behavior: "smooth" });
    }

    function sendMessage() {
        if (message !== '') {
            const json = {
                "contactId": props.match.params.id,
                "message": message,
                "sentDate": "2017-05-15T13:09:02.035Z",
            }
            fetch(`${ENDPOINT}/contacts/${props.match.params.id}/send`, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(json),
                credentials: "include",
            }).then(() => {
                setMessage('');
            });      
        }
    }

    function formatDate(string){
        return new Date(string).toLocaleTimeString([]);
    }

    const handleGoBack = async (event) => {
        event.preventDefault();
        history.push("/");
    };

    const handleLogout = async (event) => {
        event.preventDefault();
        if (localStorage.get('AUTH') != null) {
            localStorage.remove('AUTH');
            history.push("/login");
        }
    };

  const classes = useStyles();

  return (
      <div>  
          <div style={{
            position: "absolute",
            left: '0px',
            top: '4px',
            color: 'white'}}>
            <IconButton
            size="large"
            onClick={handleGoBack}
            color="inherit"
            >
                <ArrowBackIosIcon />
            </IconButton>   
          </div>
          <div style={{position: "absolute", right: "0", top: "4px", color:"white"}}>
            <IconButton
              size="large"
              onClick={handleLogout}
              color="inherit"
            >
              <LogoutIcon />
            </IconButton>
            </div>       
        
        <Grid item style={{width: '100%', bgcolor: 'background.paper'}}>
        { chat && (            
            <List className={classes.messageArea}>
            { chat.messages.map(item => {
                return (
                    <ListItem key={item.id}>
                        <Grid container>
                            <Grid item xs={12} className={(props.match.params.id === item.contactId) ? classes.chatGridLeft : classes.chatGridRight} >
                            { profile && speaker && (
                                <Avatar
                                    alt={profile.username} 
                                    src={(props.match.params.id === item.contactId) ? speaker.avatar : profile.avatar} 
                                    style={{float: (props.match.params.id === item.contactId) ? 'left' : 'right', 
                                        margin: (props.match.params.id === item.contactId) ? '0 16px 0 0' : '0 0 0 16px'
                                    }} 
                                />
                            )}
                            <ListItemText style={{margin: '8px 0'}} align={(props.match.params.id === item.contactId) ? 'left' : 'right'} primary={item.message}></ListItemText>
                        </Grid>
                        <Grid item xs={12}>
                            <ListItemText align={(props.match.params.id === item.contactId) ? 'left' : 'right'} secondary={formatDate(item.sentDate)}></ListItemText>
                        </Grid>
                    </Grid>
                </ListItem>
                );
            })}
            <div ref={messageEnd} style={{ float:"left", clear: "both" }}>
            </div>
            </List>
        )}
            <Grid container style={{padding: '20px', position: 'absolute', bottom: '0px', borderTop: '1px solid rgba(0,0,0,0.1)'}}>
                <Grid item xs={11}>
                    <TextField key="inputMessage" onChange={(e) => {setMessage(e.target.value)}} value={message} id="outlined-basic" label="Messaggio" fullWidth variant="outlined" 
                    onKeyPress={(e) => { if (e.key === 'Enter' ) { sendMessage() && executeScroll()} }} />
                </Grid>
                <Grid item xs={1} align="right" style={{margin:"auto"}}>
                    <Button 
                    onClick={() => sendMessage() && executeScroll()}
                    color="primary" aria-label="add"><SendIcon /></Button>
                </Grid>
            </Grid>
        </Grid>
      </div>
  );
}

export default Chat;