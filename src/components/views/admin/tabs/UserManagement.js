import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';
import Paper from "@material-ui/core/Paper/Paper";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {Collapse} from 'react-collapse';
import NotificationContext from '../../../notifications/NotificationContext';
import InfoCard from '../../../InfoCard';
import Typography from "@material-ui/core/Typography/Typography";

const rowss =  JSON.parse('{"user":"efwfw"}');

const users = [
  {user: 'efwfw', isAdmin: false},
  {user: 'ladjsldj', isAdmin: true},
  {user: 'öaoewewk', isAdmin: false},
  {user: 'erüer', isAdmin: false},
];

class UserManagement extends React.Component {
  componentDidMount = () => {
    // TODO: load user list
  };

  state = {
    loading: false,
    users: [],
    isOpen: false,
    newUser: {
      email: '',
      pw1: '',
      pw2: '',
      isAdmin: false,
    }
  };

  handleChange = (prop, value) => {
    this.setState({
      [prop]: value,
    });
  };

  handleUserChange = (event) => {
    let newUser = this.state.newUser;
    newUser[event.target.name] = event.target.value;
    this.handleChange('newUser', newUser);
  };

  // check username for email format
  checkUsername = username => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(username);
  };

  // compare passwords (before sending)
  comparePasswords = () => {
    return this.state.newUser.pw1 !== this.state.newUser.pw2;
  };

  // Is password long enough?
  checkPasswordLength = () => {
    return (this.state.newUser.pw1.length < 8 || this.state.newUser.pw2.length < 8);
  };

  // TODO: get users from server
  requestUsers = () => {
    this.handleChange('loading', true);
    fetch('/backend/lib/admin.php',{
      method: 'POST',
      credentials: 'same-origin', // allow cookies -> session management
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({users: true}),
    })
      .then(response => {
        if(response.ok) {
          response.json().then(data => {
            if(data && data.status === 'success') {
              // received users list from server
              this.handleChange('users', data.users || []);
            } else {
              this.context.handleNotificationChange(true, 'Die Nutzerliste konnte nicht geladen werden.', 'import', 'error');
            }
          })
        } else {
          this.context.handleNotificationChange(true, 'Die Nutzerliste konnte nicht geladen werden.', 'import', 'error');
        }
        this.handleChange('loading', false);
      })
      .catch(error => {
        this.context.handleNotificationChange(true, 'Die Nutzerliste konnte nicht geladen werden.', 'import', 'error');
        this.handleChange('loading', false);
      });
  };

  // create new user on server
  requestNewUser = () => {
    // check inputs before sending request
    if(!this.checkUsername(this.state.newUser.email)
      || this.checkPasswordLength(this.state.newUser.pw1) || this.checkPasswordLength(this.state.newUser.pw2)
      || this.comparePasswords()
    ) {
      this.context.handleNotificationChange(true, 'Bitte geben Sie gütige Nutzerdaten ein.', 'newUser', 'error');
      return;
    }
    this.handleChange('loading', true);
    fetch('/backend/lib/admin.php',{
      method: 'POST',
      credentials: 'same-origin', // allow cookies -> session management
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: this.state.newUser.email,
        password: this.state.newUser.pw1,
        isadmin: this.state.newUser.isAdmin === false? 0 : 1,
      }),
    })
      .then(response => {
        if(response.ok) {
          response.json().then(data => {
            if(data && data.status === 'success') {
              // created new user
              this.context.handleNotificationChange(true, 'Benutzer*in erfolgreich angelegt.', 'createUser', 'success');
            } else {
              this.context.handleNotificationChange(true, 'Benutzer*in konnte nicht angelegt werden.', 'createUser', 'error');
            }
          })
        } else {
          this.context.handleNotificationChange(true, 'Benutzer*in konnte nicht angelegt werden.', 'createUser', 'error');
        }
        this.handleChange('loading', false);
      })
      .catch(error => {
        this.context.handleNotificationChange(true, 'Benutzer*in konnte nicht angelegt werden.', 'createUser', 'error');
        this.handleChange('loading', false);
      });
  };

  // TODO: change user password on server
  requestPasswordChange = () => {

  };

  // TODO: delete user from server
  requestDelete = (event) => {

  };

  render() {
    const { classes } = this.props;
    const {  isOpen, loading, newUser, users } = this.state;

    return (
        <div>
          <InfoCard message={'Hier können Sie Nutzer hinzufügen und entfernen.'}/>
          {SimpleTable(this.props)}
          <Button
              onClick={() => this.setState({ isOpen: !isOpen })}
              aria-controls="example-collapse-text"
              aria-expanded={isOpen}
              className={classes.nutzerbutton}
          >
            neuen Benutzer anlegen
          </Button>
          <Collapse isOpened={isOpen}>
            <div>
              <Paper className={classes.loginContainer}>
                <div className={classes.formContainer}>
                  <Typography color={'primary'}>Bitte geben Sie die Nutzerdaten ein:</Typography>
                  <TextField
                    disabled={loading}
                    autoFocus={true}
                    className={classes.textField}
                    label={'E-Mail/Benutzername'}
                    type={'email'}
                    value={newUser.email}
                    error={!loading && !this.checkUsername(newUser.email)}
                    name={'email'}
                    onChange={this.handleUserChange}
                  />
                  {!loading && !this.checkUsername(newUser.email) && <Typography color={'error'} className={classes.errorMessage}>
                    Geben Sie eine gültige E-Mail-Adresse ein.
                  </Typography>}
                  <TextField
                    className={classes.textField}
                    disabled={loading}
                    label={'Passwort'}
                    type={'password'}
                    name={'pw1'}
                    value={newUser.pw1}
                    onChange={this.handleUserChange}
                  />
                  <TextField
                    className={classes.textField}
                    disabled={loading}
                    label={'Passwort wiederholen'}
                    type={'password'}
                    name={'pw2'}
                    value={newUser.pw2}
                    error={!loading && this.comparePasswords()}
                    onChange={this.handleUserChange}
                  />
                  {!loading && this.comparePasswords() && <Typography color={'error'} className={classes.errorMessage}>
                    Die Passwörter stimmen nicht überein.
                  </Typography>}
                  {!loading && this.checkPasswordLength() && <Typography color={'error'} className={classes.errorMessage}>
                    Das Passwort muss mindestens 8 Zeichen lang sein.
                  </Typography>}
                  <div className={classes.flexContainer}>
                    <Button
                      disabled={loading}
                      size="small"
                      color="primary"
                      variant={"contained"}
                      className={classes.button}
                      onClick={this.requestNewUser}
                    >
                      Hinzufügen
                    </Button>
                  </div>
                </div>
              </Paper>
            </div>
          </Collapse>
        </div>
    );
  }
}

UserManagement.propTypes = {
  classes: PropTypes.object.isRequired,
};

UserManagement.contextType = NotificationContext;

function SimpleTable(props) {
  const { classes } = props;

  let number = 0;
  function createData(id, email) {
    number += 1;
    id = email[0];
    email = email[0];
    return { number, id, email};
  }
  const rows =[];
  /*rowss.forEach(function(key, value) {
    rows.push(createData(value,key));
  });*/

  return (
      <div className={classes.tableWrapper}>
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="left">Benutzername / E-mail</TableCell>
              <TableCell align="left">Aktion </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
                <TableRow key={row.number}>
                  <TableCell component="th" scope="row">{row.number}</TableCell>
                  <TableCell align="left">{row.email}</TableCell>
                  <TableCell align="left">
                    <Button color="inherit" className={classes.deleteButton}>Löschen</Button>
                    <Button color="inherit" className={classes.changeButton}>Passwort ändern</Button>
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      </div>
  );
}

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = theme => ({

  root: {
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    marginLeft: theme.spacing.unit,
    marginRight: '20px',
    width: 896,
  },
  table: {
    minWidth: 400,
    maxWidth: 800,
    marginLeft: theme.spacing.unit,
  },
  newUser:{
    padding: '20px',
    marginTop: '20px'
  },
  nutzerpaper: {
    marginTop:'10px',
    marginRight: '20px',
  },
  nutzerBox: {
    padding: 5,
    display: 'flex',
  },
  deleteButton: {
    color: 'red'
  },
  changeButton:{
  },
  formular:{
    marginRight: '20px'
  },
  nutzerbutton: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit,
    border: '#CCC 1px solid'
  },
  tableWrapper: {
    width: '100%',
  },
  loginContainer:{
    width: 400,
    padding: theme.spacing.unit * 6,
    marginTop: theme.spacing.unit * 2
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
  flexContainer:{
    display: 'flex',
    alignItems: 'flex-end',
  },
  loginErrorMessage:{
    marginLeft: -theme.spacing.unit,
    marginTop: theme.spacing.unit * 3,
    width: theme.spacing.unit * 52,
  },
});

export default withStyles(styles)(UserManagement);

