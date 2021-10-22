import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
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

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  headBG: {
      backgroundColor: '#e0e0e0'
  },
  borderRight500: {
      borderRight: '1px solid #e0e0e0'
  },
  messageArea: {
    height: '70vh',
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

    // const BASE_URL = 'https://0.0.0.0:8080';
    const BASE_URL = 'https://chat-server-challenge.herokuapp.com';

    let history = useHistory();
    if (localStorage.get('user-logged-in') == null) {
        history.push("/login");
    }

    let firstRun = true;

    const [chat, setChat] = useState(null);
    const [profile, setProfile] = useState(null);
    const [speaker, setSpeaker] = useState(null);
    const [message, setMessage] = useState('');

    const messageEnd = useRef(null)
    const executeScroll = () => messageEnd.current.scrollIntoView({ block: "start", behavior: "smooth" });

    useEffect(() => {
        getChat();
        getProfile();
        getSpeaker();

        async function getChat() {
            const response = await fetch(`${BASE_URL}/contacts/${props.match.params.id}/history`, {
                method: "GET",
                headers: { "content-type": "application/json" },
                credentials: "include",
            });      
            const data = await response.json();
            setChat(data);
            if (data.unreadCount > 0 || firstRun) {
                executeScroll();
                firstRun = false;
            }
            setTimeout(() => getChat(), 5000);
        }

        async function getProfile() {
          const response = await fetch(`${BASE_URL}/profile`, {
            method: "GET",
            headers: { "content-type": "application/json" },
            credentials: "include",
          });      
          const data = await response.json();
          setProfile(data) ;
        }

        async function getSpeaker() {
            const response = await fetch(`${BASE_URL}/contacts/${props.match.params.id}`, {
                method: "GET",
                headers: { "content-type": "application/json" },
                credentials: "include",
            });      
            const data = await response.json();
            setSpeaker(data);
        }
    }, []);

    function sendMessage() {
        if (message != '') {
            const json = {
                "contactId": props.match.params.id,
                "message": message,
                "sentDate": "2017-05-15T13:09:02.035Z",
            }
            fetch(`${BASE_URL}/contacts/${props.match.params.id}/send`, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(json),
                credentials: "include",
            }).then(() => {
                setMessage('');
            });      
        }
    }

  const classes = useStyles();

  return (
      <div>        
        
        <Grid item xs={{width: '100%', bgcolor: 'background.paper'}}>
        { chat && (            
            <List className={classes.messageArea}>
            { chat.messages.map(item => {
                return (
                    
                    <ListItem key={item.id}>
                        <Grid container>
                        
                        <Grid item xs={12} className={(props.match.params.id == item.contactId) ? classes.chatGridLeft : classes.chatGridRight} >
                            { profile && speaker && (
                                <Avatar
                                    alt={profile.username} 
                                    src={(props.match.params.id == item.contactId) ? speaker.avatar : profile.avatar} 
                                    style={{float: (props.match.params.id == item.contactId) ? 'left' : 'right', 
                                        margin: (props.match.params.id == item.contactId) ? '0 16px 0 0' : '0 0 0 16px'
                                    }} 
                                />
                            )}
                            <ListItemText style={{margin: '8px 0'}} align={(props.match.params.id == item.contactId) ? 'left' : 'right'} primary={item.message}></ListItemText>
                        </Grid>
                        <Grid item xs={12}>
                            <ListItemText align={(props.match.params.id == item.contactId) ? 'left' : 'right'} secondary={item.sentDate}></ListItemText>
                        </Grid>
                    </Grid>
                </ListItem>
                );
            })}
            <div ref={messageEnd} style={{ 
                float:"left", clear: "both",
                // height: '100px',
                // overflowY: 'scroll'
                }}>
            </div>
            </List>
        )}
            
            <Divider />
            <Grid container style={{padding: '20px'}}>
                <Grid item xs={11}>
                    {/* <TextField id="outlined-basic" label="Messaggio" fullWidth variant="outlined" /> */}
                    <TextField key="inputMessage" onChange={(e) => {setMessage(e.target.value)}} value={message} id="outlined-basic" label="Messaggio" fullWidth variant="outlined" 
                    onKeyPress={(e) => { if (e.key === 'Enter' ) { sendMessage() && executeScroll()} }} />
                </Grid>
                <Grid xs={1} align="right">
                    <Button margin="auto" 
                    onClick={() => sendMessage() && executeScroll()}
                    color="primary" aria-label="add"><SendIcon /></Button>
                </Grid>
            </Grid>
        </Grid>
      </div>
  );
}

export default Chat;