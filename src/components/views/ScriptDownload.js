import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import InfoCard from '../InfoCard';
import NotificationContext from '../notifications/NotificationContext';
import Link from '@material-ui/core/Link';


class ScriptDownload extends React.Component {
  state = {
    filenames: [],
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  componentDidMount() {
    this.requestStatus();
  };

  logout = () => {
    this.handleStateChange('loggedIn', false);
    this.handleStateChange('isAdmin', false);
  };

  requestFilenames = () => {
    fetch("/backend/lib/functions.php", {
      method: 'POST',
      credentials: 'same-origin', // allow cookies -> session management
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({getFiles: true})
    })
      .then(res => {
        if(res.ok) {
          res.json().then(data => {
            if (data && data.status === "success") {
              this.context.handleNotificationChange(true, 'Die Dateien wurden erfolgreich abgerufen.', 'getFiles', 'success');
              this.setState({filenames: data.files})
            } else {
              this.context.handleNotificationChange(true, 'Die Dateien konnten nicht vom Server geladen werden.', 'getFiles', 'error');
            }
          })
        } else {
          this.context.handleNotificationChange(true, 'Die Dateien konnten nicht vom Server geladen werden.', 'getFiles', 'error');
        }
      })
      .catch(error => {
          this.context.handleNotificationChange(true, 'Die Dateien konnten nicht vom Server geladen werden.', 'getFiles', 'error');
        }
      );
  };

  requestStatus = () => {
    // check if session is still valid otherwise logout user
    fetch("/backend/lib/sessionManagement.php", {
      method: 'POST',
      credentials: 'same-origin', // allow cookies -> session management
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        loginStatus: true,
        loginID: this.props.sessionID
      })
    }).then(response => {
        if(response.ok) {
          response.json().then(data => {
            if(!data || data.status === 'error') {
              this.context.handleNotificationChange(true, 'Ihre Sitzung ist abgelaufen.', 'sessionCheck', 'error');
              this.props.handleAppChange('loggedIn', false);
              this.props.handleAppChange('isAdmin', false);
            } else {
              this.requestFilenames();
            }
          });
        } else {
          this.context.handleNotificationChange(true, 'Ihre Sitzung ist abgelaufen.', 'sessionCheck', 'error');
          this.logout();
        }
      }
    ).catch(error => {
        this.context.handleNotificationChange(true, 'Ihre Sitzung ist abgelaufen.', 'sessionCheck', 'error', 404);
        this.logout();
      }
    );
  };

  render() {
    const {classes} = this.props;
    const {filenames} = this.state;

    return (
      <div className={classes.root}>
        <InfoCard message='Auf dieser Seite können Sie Skripte zur weiteren Verarbeitung der Texte herunterladen.'/>
        <div className={classes.textContainer}>
          <Typography variant={'h5'} color={'primary'}>Python-Skripte</Typography>
          <ul>
            {filenames.map(name =>
              <li><Link key={name} href={'/backend/scripts/' + name} download>{name}</Link></li>
            )}
          </ul>
        </div>
      </div>
    )
  }

}

ScriptDownload.propTypes = {
  classes: PropTypes.object.isRequired,
  handleAppChange: PropTypes.func.isRequired,
  sessionID: PropTypes.any.isRequired,
};

const styles = theme => ({
  root:{
    margin: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 4,
  },
  textContainer: {
    minWidth: 500,
    maxWidth: 1000,
    marginLeft: theme.spacing.unit,
  }
});
ScriptDownload.contextType = NotificationContext;

export default withStyles(styles)(ScriptDownload);