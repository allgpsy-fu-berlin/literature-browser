import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper/Paper";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import fileDownload from 'js-file-download';
import { Redirect } from 'react-router-dom';
import InfoIcon from '@material-ui/icons/Info';
import fetchTimeout from 'fetch-timeout';
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorMessage from '../browser/results/ErrorMessage';

class Login extends React.Component {
  state = {
    redirectToReferrer: false,
    email: '',
    password: '',
    emailError: true,
    passwordError: true,
    eErrorMessage: '',
    pErrorMessage: '',
    loginError: false,
    loading: false,
  };

  handleSubmit = () => {
    this.setState({loading: true});
    // TODO: send request to server to get cookie + status (admin?)
    let payload = JSON.stringify({login: true});
    fetch(this.props.url,{
      method: 'POST',
      credentials: 'same-origin', // allow cookies -> session management
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(response => {

      });

    this.setState({loading: false});
  };

  login = () => {
    this.props.setAuth(() => {
    });
    this.setState({
      redirectToReferrer: true
    });
  };

  render() {
    const {classes, setAuth } = this.props;
    const { email, password, emailError, passwordError, loginError, loading, redirectToReferrer } = this.state;

    if(redirectToReferrer === true) {
      console.log('redirecting...');
      return(
        <Redirect to='/'/>
      )
    }

    return (
      <div className={classes.root}>
        <Paper className={classes.infoBox}>
          <InfoIcon color={"primary"} className={classes.infoIcon}/>
          <Typography color={"primary"}>
            Falls Sie sich registrieren möchten, Ihr Passwort vergessen haben
            oder Ihr Nutzerkonto löschen möchten wenden Sie sich bitte an den/die Administrator/in.
          </Typography>
        </Paper>
        <Paper className={classes.loginContainer}>
          <div className={classes.formContainer}>
            <Typography variant={'h6'} color={'primary'}>Bitte melden Sie sich an</Typography>
            <TextField
              className={classes.textField}
              label={'E-Mail'}
              type={'email'}
              value={email}
            />
            {<Typography color={'error'} className={classes.errorMessage}>{this.state.errorMessage}</Typography>}
            <TextField
              className={classes.textField}
              label={'Passwort'}
              type={'password'}
              value={password}
            />
            <div className={classes.flexContainer}>
              <Button
                size="small"
                color="primary"
                variant={"contained"}
                className={classes.button}
                onClick={this.login}
              >
                Anmelden
              </Button>
              {loading && <CircularProgress className={classes.loadingAnimation} size={30}/>}
            </div>
          </div>
        </Paper>
      </div>
    )
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
  url: PropTypes.string,
  setStatus: PropTypes.func,
  setAuth: PropTypes.func.isRequired,
};

const styles = theme => ({
  root: {},
  loginContainer:{
    width: 400,
    padding: theme.spacing.unit * 6,
    margin: 'auto',
  },
  formContainer:{
    display: 'flex',
    flexDirection: 'column',
  },
  textField: {
    marginTop: theme.spacing.unit * 2,
  },
  button:{
    marginTop: theme.spacing.unit * 5,
    marginRight: theme.spacing.unit * 2,
    width: 100,
  },
  infoBox:{
    width: 400 + theme.spacing.unit * 6,
    padding: theme.spacing.unit*2,
    paddingRight: theme.spacing.unit * 4,
    display: 'flex',
    margin: 'auto',
    marginBottom: theme.spacing.unit * 3,
  },
  infoIcon: {
    marginRight: theme.spacing.unit,
  },
  flexContainer:{
    display: 'flex',
    alignItems: 'flex-end',
  },
});

export default withStyles(styles)(Login);