import React from 'react';
import Head from 'next/head';
import app from "../lib/base"
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Grid, IconButton, Paper, Checkbox, jssPreset } from '@material-ui/core';

import defaultMessage from '../lib/default';
const storage = require('electron-settings');
import { useRouter } from 'next/router';
import { machineId } from 'node-machine-id';

const List = () => {
  const router = useRouter();
  const [messages, setMessages] = React.useState([])
  React.useEffect(() => {
    const init = async () => {
      if (!app.auth().currentUser) {
        router.push('/home');
        return;
      }
      try{
        var res = (await app.functions().httpsCallable('logon').call('logon', {machineId: await machineId()})).data
        if(res !== true){
          router.push('/home')
          return;
        }
      }catch(error){
        router.push('/home')
        return;
      }
      if(storage.getSync('messages') == undefined){
        storage.setSync('messages', [])
      }
      setMessages(storage.getSync('messages').sort(compareMessages))
    }
    init()
  }, [storage]);
  
  function compareMessages(a, b){
    if(a.timestamp > b.timestamp) return -1;
    if(a.timestamp < b.timestamp) return 1;
    return 0
  }

  const deleteMessage = (idx) => {
    var x = [];
    for(var i = 0; i < messages.length; i++){
      if(idx !== i){
        x.push(messages[i])
      }
    }
    setMessages(x)
    storage.setSync('messages', x)
  }

  const messagePapers = React.useMemo(() => messages.map((message, i) => {
      return (
        <Grid item container key={i} style={{ width: '40%', minHeight: '20%' }}>
          <Grid item xs={12} style={{ height: '2vh' }} />
          <Paper style={{ background: '#2f3136', height: '100%', width: '100%' }}>
            <Grid container direction='row' style={{ width: '100%' }} justify="space-around" alignItems='center'>
              <Grid item xs={12} style={{ height: '2vh' }} />
              <Grid item container style={{ width: '60%' }} justify='center'>
              <Typography style={{ color: '#ffffff', fontSize: 20 }}>
                {message.title}
              </Typography>
              </Grid>
              <Grid item style={{ width: '15%' }}>
              <Button fullWidth variant="contained" color="secondary" onClick={() => router.push(`/Message?i=${message.idx}`)}>Go</Button>
              </Grid>
              <Grid item style={{ width: '15%' }}>
                <Button fullWidth variant="contained" style={{ background: '#ff392b', color: '#ffffff' }} onClick={() => deleteMessage(i)}>
                          Delete
                </Button>
              </Grid>
              <Grid item xs={12} style={{ height: '2vh' }} />
            </Grid>
          </Paper>
          <Grid item xs={12} style={{ height: '2vh' }} />
        </Grid>
      );
  }), [messages])

  const getMessages = () => {
    storage.setSync('messages', [])
    setMessages(storage.getSync('messages'))
  }

  //width:'50%', height: '100%', display:'inline-block', 
  return (
    <React.Fragment>
      <div style={{ width: '100%', background:'#36393f', minHeight:'100vh' , overflowY: 'auto' }}>
      <Grid container direction='row' justify='space-around' alignItems='flex-end'>
        <Grid item xs={12} style={{ height: '2vh' }} />
        {messagePapers}
        <Grid item style={{ width: '40%' }} >
          <Button fullWidth color="primary" variant="contained" 
            onClick={async () => {
              storage.setSync('messages', storage.getSync('messages').concat([ defaultMessage(storage.getSync('messages').length) ]));
              setMessages(storage.getSync('messages'))
              
            }}>
            Add Message
          </Button>
          <Grid item xs={12} style={{ height: '2vh' }} />
          <Button fullWidth color="primary" variant="contained" 
            onClick={() => {
              getMessages();
            }}>
            Delete All
          </Button>
        </Grid>
      </Grid>
      
        <Button variant='contained' color='secondary' style={{ left: '90%', top: '90%', position: 'fixed' }} onClick={async () => {
          await app.auth().signOut()
          router.push('/home')
        }}>Sign out</Button>
     
      </div>
    </React.Fragment>
  );
};

export default List;