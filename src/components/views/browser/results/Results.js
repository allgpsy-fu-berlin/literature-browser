import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper/Paper";
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import green from '@material-ui/core/colors/green';
import NotificationContext from '../../../notifications/NotificationContext';

// display search results + provide download link
class Results extends React.Component {
  state = {};

  downloadResults = () => {
    // request data + handle response for each selected format separately
    this.props.formats.forEach(format => {
      fetch("/backend/lib/functions.php", {
        method: 'POST',
        credentials: 'same-origin', // allow cookies -> session management
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          download: this.props.filenames,
          format: format,
        }),
      })
        .then(response => {
          if(response.ok) {
            response.json().then(data => {
              console.log(data);
              if(data && data.status === 'success') {
                // create invisible anchor and click it
                let a = document.createElement('a');
                a.href = '/backend/database/_cache/' + data.filename;
                console.log('download path: ', a.href);
                a.download = true;
                a.click();
                console.log('clicked link');
                // alternative for downloading file:
                // window.open(responseJson['path'], "_blank")
              } else {
                this.context.handleNotificationChange(true, 'Die Ergebnis-Dateien konnten nicht vom Server geladen werden.', 'download', 'error');
              }
            })
          } else {
            this.context.handleNotificationChange(true, 'Die Ergebnis-Dateien konnten nicht vom Server geladen werden.', 'download', 'error');
          }
        })
        .catch((error) => {
          console.error(error);
          this.context.handleNotificationChange(true, 'Die Ergebnis-Dateien konnten nicht vom Server geladen werden.', 'download', 'error');
        });
    })

  };

  render() {
    const {classes, number,} = this.props;

    return (
      <div className={classes.root}>
        <Paper className={classes.resultContainer} elevation={0} >
          <Typography>
            <Link
              className={classes.resultLink}
              onClick={this.downloadResults}
            >
              Ergebnis als ZIP-Datei herunterladen {'(' + number + 'Treffer)'}
            </Link>
          </Typography>
        </Paper>
      </div>
    )
  }
}

Results.propTypes = {
  classes: PropTypes.object.isRequired,
  filenames: PropTypes.string,
  number: PropTypes.number.isRequired,
  formats: PropTypes.arrayOf(PropTypes.string),
};

Results.contextType = NotificationContext;

const styles = theme => ({
  root: {
    margin: theme.spacing.unit,
  },
  resultContainer:{
    padding: theme.spacing.unit,
    backgroundColor: green[600],
  },
  resultLink:{
    color: 'white',
  }
});

export default withStyles(styles)(Results);