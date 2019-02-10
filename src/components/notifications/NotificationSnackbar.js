import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import NotificationContext from './NotificationContext';


class NotificationSnackbar extends React.Component {
  state = {

  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleClose = (event, reason) => {
    if(reason === 'clickaway') {
      return;
    }
    this.context.handleNotificationChange(false,'','','');
  };

  renderErrorText = (message, statusCode, action) => {
    let msg = '';
    if(statusCode) {
      switch (statusCode) {
        // success (all HTTP status codes that start with 2)
        case (Math.floor(statusCode % 100) === 2):
          switch (action) {
            case 'addUser': msg = 'Nutzer erfolgreich hinzugefügt.'; break;
            case 'deleteUser': msg = 'Nutzer erfolgreich gelöscht.'; break;
            case 'changePassword': msg = 'Passwort erfolgreich geändert.'; break;
            case 'addText': msg = 'Text erfolgreich hinzugefügt.'; break;
            case 'startImport': msg = 'Import erfolgreich gestartet.'; break;
            case 'emptyCache': msg = 'Cache erfolgreich geleert'; break;
            default: msg = 'Die Aktion war erfolgreich.';
          } break;

        // some error cases (all other HTTP status codes)
        case 404:
          msg = 'Der Server konnte nicht gefunden werden.'; break;
        case 500: msg = 'Es ist ein Fehler auf dem Server aufgetreten.'; break;
        case 503: msg = 'Der Server ist im Moment nicht verfügbar. Bitte versuchen Sie es später noch einmal.'; break;
        case 550:
          switch (action) {
            case 'search': msg = 'Sie sind nicht berechtigt, diese Suche durchzuführen.'; break;
            case 'login': msg = 'Es gibt kein Nutzerkonto mit diesen Zugangsdaten.'; break;
            default: msg = 'Sie sind nicht berechtigt zum Durchführen dieser Aktion.'
          }
          break;

        // all other cases (that have not been handled)
        default:
          msg = `Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.`;
      }
    } else {
      msg = message;
    }
    return msg;
  };

  render() {
    const {classes} = this.props;
    const { error, message, statusCode, action, variant } = this.context;

    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={error}
          autoHideDuration={8000}
          onClose={this.handleClose}
        >
          <SnackbarContent
            className={classes[variant]}
            message={this.renderErrorText(message, statusCode, action)}
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                className={classes.close}
                onClick={this.handleClose}
              >
                <CloseIcon className={classes.icon} />
              </IconButton>,
            ]}
          />
        </Snackbar>
      </div>
    )
  }

}

NotificationSnackbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

NotificationSnackbar.defaultProps = {
  message: 'Es ist ein Fehler aufgetreten.',
};

NotificationSnackbar.contextType = NotificationContext;

const styles = theme => ({
  root: {},
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  success: {
    backgroundColor: green[600],
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
});

export default withStyles(styles)(NotificationSnackbar);