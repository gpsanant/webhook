import React from 'react';
import Head from 'next/head';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { Grid, IconButton, Paper, Checkbox, jssPreset } from '@material-ui/core';
import Field from '../components/Field';
import DiscordView from '../components/DiscordView';
import app from "../lib/base"
import { ChromePicker } from 'react-color'
import { useRouter } from 'next/router';
import { machineId } from 'node-machine-id';

const storage = require('electron-settings');
const parser = require('../lib/parser');
const axios = require('axios');

const Message = () => {
  const router = useRouter();
  const [webhooks, setWebhooks] = React.useState([{val: "", err: false}]);
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [username, setUsername] = React.useState([""]);
  const [avatar, setAvatar] = React.useState("");
  const [embeds, setEmbeds] = React.useState([]);

  const pushInfo = (info) => {
    const index = parseInt(window.top.location.href.split('i=')[1]);
    var x = storage.getSync('messages')
    var t = info.title || title
    var c = info.content || content
    var u = info.username || username
    var a = info.avatar || avatar
    var e = info.embeds || embeds
    var w = info.webhooks || webhooks

    x[index] = { title: t, content: c, username: u, avatar: a, 
                embeds: e, webhooks: w, timestamp: Date.now(), idx: index }
    storage.setSync('messages', x)
  }

  React.useEffect(() => {
		let getInfo = async () => {
      if (!app.auth().currentUser || (await app.functions().httpsCallable('logon')
          .call('logon', {machineId: await machineId()})).data !== true) {
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
      const index = parseInt(window.top.location.href.split('i=')[1]);
      var x = storage.getSync('messages')
      setWebhooks(x[index].webhooks)
      setTitle(x[index].title)
      setContent(x[index].content)
      setUsername(x[index].username)
      setAvatar(x[index].avatar)
      setEmbeds(x[index].embeds)
      pushInfo({ title: x[index].title, content: x[index].content, username: x[index].username, 
        avatar: x[index].avatar, embeds: x[index].embeds, webhooks: x[index].webhooks })
    }
		getInfo()
	}, [storage, setWebhooks, setTitle, setContent, setUsername, setAvatar, setEmbeds]);

  const webhookFields = webhooks.map((webhook, i) => {
    if(webhooks === undefined){
      setWebhooks([{val: "", err: false}])
    }
    if(i !== webhooks.length-1){
    return (
      <>
      <Grid container item key={i}
      direction="row"
      justify="space-around"
      alignItems="center"
    >
      <Grid item xs={9} >
      <Field label="Discord Webhook" placeholder="https://discordapp.com/api/webhooks..." value={webhook.val}
              onChange={(ev) => changeWebhook(ev.target.value, i)} error={webhook.err}/>
      </Grid>
        <Grid item xs={2} >
          <Button fullWidth variant="contained" color="secondary" onClick={() => {deleteWebhook(i)}}>
            Delete
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12} style={{ height: '2vh' }} />
      </>
    );
          }else{
    return (
      <>
      <Grid key={i}
        container
        direction="row"
        justify="space-around"
        alignItems="center"
      >
      <Grid item xs={9} >
        <Field label="Discord Webhook" placeholder="https://discordapp.com/api/webhooks..." value={webhook.val}
              onChange={(ev) => changeWebhook(ev.target.value, i)} error={webhook.err} />

			</Grid>
        <Grid item xs={2}>
          <Button fullWidth variant="contained" color="primary" onClick={() => {setWebhooks(webhooks.concat([{val: "", err: false}]))}}>
            Add
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12} style={{ height: '2vh' }} />
      </>
    );
          }
    
  });
  const embedPapers = embeds.map((embed, i) => {
    return (
      <>
        <Grid item key={i} style={{ width: '97%' }}>
        <Paper style={{ background: '#2f3136' }} >
          <Grid container
            direction="row"
            justify="space-evenly"
            alignItems="center"
            >
              <Grid item xs={12} style={{ height: '2vh' }} />
              <Typography style={{color: '#ffffff'}}>Embed {i+1}</Typography>
              <Grid item xs={12} style={{ height: '2vh' }} />
              <Grid item style={{width: '46%'}}>
                <Field label="Title" placeholder="Mr. Discord" value={embed.title}
                onChange={(ev) => changeEmbed('title', ev.target.value, i)} length={256} />
              </Grid>
              <Grid item style={{width: '46%'}} >
                <Field label="Title URL" placeholder="https://google.com" value={embed.url}
                    onChange={(ev) => changeEmbed('titleURL', ev.target.value, i)} />
              </Grid>
              <Grid item xs={12} style={{ height: '2vh' }} />
              <Grid item container style={{width: '95%'}} justify='center'>
                <ChromePicker color={embed.color} disableAlpha onChange={(color, ev) => changeEmbed('color', color.hex, i)} onChangeComplete={(color, ev) => changeEmbed('color', color.hex, i)}/>
              </Grid>
              <Grid item xs={12} style={{ height: '2vh' }} />
              <Grid item style={{width: '95%'}}>
              <Field label="Thumbnail" placeholder="Mr. Discord" value={embed.thumbnail}
                      onChange={(ev) => changeEmbed('thumbnail', ev.target.value, i)} />
              </Grid>
              <Grid item xs={12} style={{ height: '2vh' }} />
              <Grid item style={{width: '95%'}}>
              <TextField fullWidth
                          id="outlined-multiline-static"
                          label="Message Content"
                          multiline
                          rows={4}
                          variant="outlined" label="Description" placeholder="eek ekke eek eek yo yo honey sing"
                    value={embed.description}
                    onChange={(ev) => changeEmbed('description', ev.target.value, i)}
                    style={{
                      background: '#40444b',
                    }}
                    InputProps={{
                      style: {
                        color: "white",
                      }
                    }}
                    InputLabelProps={{
                      style: {
                        color: "white",
                      }
                    }}
                    inputProps={{
                      maxLength: 2048
                    }}
              />
              </Grid>
              <Grid item xs={12} style={{ height: '2vh' }} />
              <Grid item style={{width: '30%'}}>
              <Field label="Author Name" placeholder="Mr. Discord" value={embed.author.name}
                    onChange={(ev) => changeEmbed('authorName', ev.target.value, i)} length={256}/>
            </Grid>
            <Grid item style={{width: '30%'}}>
              <Field label="Author URL" placeholder="Mr. Discord" value={embed.author.url}
                    onChange={(ev) => changeEmbed('authorURL', ev.target.value, i)} />
            </Grid>
            <Grid item style={{width: '30%'}}>
            <Field label="Author Icon" placeholder="Mr. Discord" value={embed.author.icon_url}
                    onChange={(ev) => changeEmbed('authorIcon', ev.target.value, i)} />
            </Grid>
            <Grid item xs={12} style={{ height: '2vh' }} />
            
            {embed.fields.map((field, j) => {
              return (
              <>
              <Grid item direction='row' container justify="space-between" style={{width: '95%'}}>
                <Typography style={{color: '#ffffff', left: '50%' }}>Field {j+1}</Typography>
                <Button style={{ background: '#ff392b', color: '#ffffff' }} variant="contained" onClick={() => deleteField(i, j)}>
                  Delete
                </Button>
              </Grid>
              <Grid item xs={12} style={{ height: '2vh' }} />
              <Grid item style={{width: '70%'}}>
              <Field label="Field Name" placeholder="Mr. Discord" value={field.name}
                    onChange={(ev) => changeField(i, j, 'name', ev.target.value)} length={256}/>
            </Grid>
            <Grid item container
            direction="row"
            justify="space-evenly"
            alignItems="center" style={{width: '23%'}}>
              <Typography style={{color: '#ffffff'}}>Inline</Typography>
              <Checkbox
                checked={field.inline}
                onChange={(ev) => changeField(i, j, 'inline', ev.target.checked)}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            </Grid>
            <Grid item xs={12} style={{ height: '2vh' }} />
            <Grid item style={{width: '95%'}}>
              <Field label="Field Value" placeholder="Mr. Discord" value={field.value}
                      onChange={(ev) => changeField(i, j, 'value', ev.target.value)} length={1024}/>
            </Grid>
            <Grid item xs={12} style={{ height: '2vh' }} />
            </>
              );
            })}
            <Grid item style={{ width: '50%' }} >
              <Button fullWidth color="primary" variant="contained" onClick={() => changeEmbed('addField', 'eek', i)}>
                Add Field
              </Button>
            </Grid>
            <Grid item xs={12} style={{ height: '2vh' }} />
            <Grid item style={{width: '46%'}}>
              <Field label="Footer Text" placeholder="Mr. Discord" value={embed.footer.text}
                        onChange={(ev) => changeEmbed('footerText', ev.target.value, i)} length={2048}/>
            </Grid>
            <Grid item style={{width: '46%'}}>
             <Field label="Footer Icon" placeholder="Mr. Discord" value={embed.footer.icon_url}
                        onChange={(ev) => changeEmbed('footerIcon', ev.target.value, i)} />
            </Grid>
            <Grid item xs={12} style={{ height: '2vh' }} />
            <Grid item style={{width: '46%'}}>
              <Field label="Timestamp" placeholder="Mr. Discord" value={embed.timestamp}
                        onChange={(ev) => changeEmbed('timestamp', ev.target.value, i)} />
            </Grid>
            <Grid item style={{width: '46%'}}>
              <Field label="Image" placeholder="Mr. Discord" value={embed.image}
                    onChange={(ev) => changeEmbed('image', ev.target.value, i)} />
            </Grid>
            <Grid item xs={12} style={{ height: '2vh' }} />
            <Button style={{ width: '95%', background: '#ff392b', color: '#ffffff' }} variant="contained" onClick={() => deleteEmbed(i)}>
              Delete
            </Button>
            <Grid item xs={12} style={{ height: '2vh' }} />
            </Grid>
            </Paper>
            </Grid>
        <Grid item xs={12} style={{ height: '2vh' }} />
      </>
    );
  })

  const changeEmbed = (thing, val, i) => {
    var x = [...embeds]
    switch(thing){
      case('title'):
        x[i].title = val;
        break;
      case('titleURL'):
        x[i].url = val;
        break;
      case('description'):
        x[i].description = val;
        break;
      case('authorName'):
        x[i].author.name = val;
        break;
      case('authorURL'):
        x[i].author.url = val;  
        break;
      case('authorIcon'):
        x[i].author.icon_url = val;
        break;  
      case('footerText'):
        x[i].footer.text = val;
        break;
      case('footerIcon'):
        x[i].footer.icon_url = val;
        break;
      case('timestamp'):
        x[i].timestamp = val;
        break;
      case('color'):
        x[i].color = val;
        break;
      case('thumbnail'):
        x[i].thumbnail = val;
        break;
      case('addField'):
        if(x[i].fields.length < 26) x[i].fields.push({inline: false, name: "", value: ""});
        break;
      case('image'):
        x[i].image = val
        break;
    }
    setEmbeds(x);
    pushInfo({ embeds: x })
  }

  const deleteEmbed = (idx) => {
    var x = [];
    for(var i = 0; i < embeds.length; i++){
      if(idx !== i){
        x.push(embeds[i])
      }
    }
    setEmbeds(x)
    pushInfo({ embeds: x })
  }

  const deleteField = (idx, j) => {
    var x = [];
    for(var i = 0; i < embeds[idx].fields.length; i++){
      if(i !== j){
        x.push(embeds[idx].fields[i])
      }
    }
    var y = [...embeds]
    y[idx].fields = x;
    setEmbeds(y)
    pushInfo({ embeds: y })
  }

  const changeField = (i, j, thing, val) => {
    var x = [...embeds]
    switch(thing){
      case('name'):
        x[i].fields[j].name = val;
        break;
      case('value'):
        x[i].fields[j].value = val;
        break;
      case('inline'):
        x[i].fields[j].inline = val;
        break;
    }
    setEmbeds(x)
    pushInfo({ embeds: x })
  }

  const changeWebhook = (val, i) => {
      var x = [...webhooks];
      x[i].val = val;
      setWebhooks(x)
      pushInfo({ webhooks: x })
  }

  const deleteWebhook = (idx) => {
    var x = [];
    for(var i = 0; i < webhooks.length; i++){
      if(idx !== i){
        x.push(webhooks[i])
      }
    }
    setWebhooks(x)
    pushInfo({ webhooks: x })
  }

  async function checkWebhook(hook) {
    var isErr = true;
    try{
      var response = await axios.get(hook)
      if (response.data.type === 1 && `${response.data.id}/${response.data.token}` === hook.substring(36)){
        console.log('success', response.data)
        isErr = false
      }else{
        console.log('went through, but not right', response.data)
      }
    }catch(error){
      console.log(error)
			if (error.response) {
				console.log(error)
				console.warn('err', error.response.data);
      }
    }
    return isErr;
  }
  
  const sendMessage = () => {
    var hooks = webhooks.filter((webhook) => !webhook.err)
    parser.convertMessage(content, username, avatar, embeds, hooks)
  }

  return (
    <React.Fragment>
      {/* <Head>
        <title>Home - Nextron (with-javascript-material-ui)</title>
      </Head> */}
      <div style={{ width: '100%', height: '10vh', background:'#36393f' }}>
        <Grid container alignItems="center" justify="space-around">
          <Grid item xs={12} style={{ height: '2vh' }} />
          <Grid item style={{ width: '10%' }} >
            <Button fullWidth variant="contained" color="secondary" onClick={() => router.push('/List')}>Go To Dash</Button>
          </Grid>
          <Grid item style={{ width: '60%' }} >
            <Field label="Title" placeholder="Mr. Discord" value={title}
                    onChange={(ev) => {
                      setTitle(ev.target.value)
                      pushInfo({ title: ev.target.value });
                    }} />
          </Grid>
          <Grid item style={{ width: '10%' }} >
            <Button fullWidth variant="contained" color="secondary" onClick={() => sendMessage()}>Send</Button>
          </Grid>
        </Grid>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', height: '100%', background:'#36393f', overflowY: 'hidden' }}>
      <div style={{ float: 'left', backgroundColor:'#36393f', width: '50%', minHeight:'90vh', overflowY: 'auto' }}>
      <Grid item xs={12} style={{ height: '2vh' }} />
      <Grid item xs={12} style={{ height: '2vh' }} />
        <Grid container alignItems="center" justify="center">
          {webhookFields}
          <Grid item style={{ width: '95%' }} >
            <Button fullWidth variant="contained" color="primary" onClick={async () => {
              var x = webhooks
              x.forEach(async (webhook) => {
                webhook.err = await checkWebhook(webhook.val);
              })
              setWebhooks(x)
              pushInfo({ webhooks: x })
            }}>Check Webhooks</Button>
          </Grid>
          <Grid item xs={12} style={{ height: '2vh' }} />
          <Grid item style={{ width: '95%' }} >
            <TextField fullWidth
                          id="outlined-multiline-static"
                          label="Message Content"
                          multiline
                          rows={4}
                          variant="outlined" label="Content" placeholder="eek ekke eek eek yo yo honey sing"
                    value={content}
                    onChange={(ev) => {
                      setContent(ev.target.value)
                      pushInfo({ content: ev.target.value })
                    }}
                    style={{
                      background: '#40444b',
                    }}
                    InputProps={{
                      style: {
                        color: "white",
                      }
                    }}
                    InputLabelProps={{
                      style: {
                        color: "white",
                      }
                    }}
                    inputProps={{
                      maxLength: 2000
                    }}
              />
          </Grid>
          <Grid item xs={12} style={{ height: '2vh' }} />
          <Grid item container style={{ width: '100%' }} direction='row' justify='space-around' alignItems='center'>
            <Grid item style={{width: '45%'}}>
              <Field label="Username" placeholder="Mr. Discord" value={username} length={80}
                          onChange={(ev) => {
                            setUsername(ev.target.value)
                            pushInfo({ username: ev.target.value })
                          }} />
              </Grid>
              <Grid item style={{width: '45%'}}>
                <Field label="Avatar URL" placeholder="Mr. Discord" value={avatar}
                          onChange={(ev) => {
                            setAvatar(ev.target.value)
                            pushInfo({ avatar: ev.target.value })
                          }} />
              </Grid>
            </Grid>
            <Grid item xs={12} style={{ height: '2vh' }} />
            <Grid item xs={12} style={{ height: '2vh' }} />
          {embedPapers}
      <Grid item xs={12} style={{ height: '2vh' }} />
        <Grid item xs={11}>
        <Button fullWidth variant="contained" color="primary" onClick={() => {
            if(embeds.length < 11){
              var e = embeds.concat([{title: "", url: "", description: "", 
                                    author: { name: "", url: "", icon_url: "" }, 
                                    footer: { text: "", icon_url: ""}, 
                                    color: '#ffffff', timestamp: "", fields: [], image: "" }])
              setEmbeds(e)
              pushInfo({ embeds: e })
            }
        }}>
            Add Embed
            </Button>
        </Grid>
          </Grid>
				
      </div>

      {/* style={{width:'50%', display:'inline-block'}}    backgroundColor: '#36393f'*/}
      <div style={{ float: 'left', width: '50%', backgroundColor: '#36393f', minHeight: '100vh', overflowY: 'auto'}}>
        <Grid item xs={12} style={{ height: '2vh' }} />
        <Grid item xs={12} style={{ height: '2vh' }} />
        <DiscordView
          {...parser.parseMessage(username, avatar, content, embeds)}
        />
      </div>
      </div>
    </React.Fragment>
  );
};

export default Message;
