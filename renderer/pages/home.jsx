import React, { useCallback, useContext } from "react";
import { useRouter } from 'next/router';
import app from "../lib/base";
import { Grid, Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, Typography } from '@material-ui/core';
import Field from '../components/Field';
import { machineId } from 'node-machine-id';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [buttonText, setButtonText] = React.useState("Log In")
  const [isAuthError, setIsAuthError] = React.useState(false)
  const [authError, setAuthError] = React.useState("")
  const handleLogin = async () => {
    try {
      setButtonText("Logging in...")
      await app
        .auth()
        .signInWithEmailAndPassword(email, password);
      var res = (await app.functions().httpsCallable('logon').call('logon', {machineId: await machineId()})).data
      if(res === true){
        router.push('/List')
        //setButtonText("Log in")
        return;
      }else if(res === "No Machine Id"){
        setAuthError("No Machine Id")
        setIsAuthError(true)
        setButtonText("Log in")
        return;
      }else{
        setAuthError("Can only access the app from one computer")
        setIsAuthError(true)
        setButtonText("Log in")
        return;
      }
    } catch (error) {
      setAuthError(error.message)
      setIsAuthError(true)
      setButtonText("Log in")
    }
  }

  return (
    <React.Fragment>
      <div style={{ width: '100%', background:'#36393f', minHeight:'100vh' , overflowY: 'auto' }}>
      <Dialog onClose={() => setIsAuthError(false)} aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description" open={isAuthError}>
        <DialogTitle id="alert-dialog-title">Auth Error</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {authError}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAuthError(false)} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container direction='column' justify='center' alignItems='center' style={{ minHeight:'100%' }}>
        <Grid item style={{ width: '40%', paddingTop: '30vh' }}>
          <Field label="Email" placeholder="123qwe@123qwe.com" value={email}
                onChange={(ev) => setEmail(ev.target.value)} />
        </Grid>
        <Grid item style={{ width: '40%', paddingTop: '3vh' }} >
          <Field label="Password" placeholder="123qwe" value={password}
                onChange={(ev) => setPassword(ev.target.value)} />
        </Grid>
        <Grid item style={{ width: '25%', paddingTop: '10vh' }} >
          <Button fullWidth color="primary" variant="contained" onClick={async () => await handleLogin()}>
            {buttonText}
          </Button>
        </Grid>
      </Grid>
    </div>
    </React.Fragment>
  );
};

export default Login;