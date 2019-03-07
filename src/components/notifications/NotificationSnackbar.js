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
import Fade from '@material-ui/core/Fade';
import { getErrorMessage } from '../../utils/errorMessageHelper';

// show success/warning/error snackbar in right lower corner of viewport
class NotificationSnackbar extends React.Component {

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  // do not show Snackbar anymore
  handleClose = (event, reason) => {
    if(reason === 'clickaway') {
      return;
    }
    this.context.handleNotificationChange(false,'','','');
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
          resumeHideDuration={0}
          disableWindowBlurListener={true}
          onClose={this.handleClose}
          transitionDuration={0}
        >
          <SnackbarContent
            classes={{root: classes[variant]}}
            aria-describedby="snackbar"
            message={<span id={'snackbar'}>{getErrorMessage(message, statusCode, action)}</span>}
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
});

export default withStyles(styles)(NotificationSnackbar);