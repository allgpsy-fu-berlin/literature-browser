import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import Typography from '@material-ui/core/Typography';
import InfoCard from '../../../InfoCard';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import NotificationContext from '../../../notifications/NotificationContext';

// add new texts to server database, start importing texts from external database on server, view import status
class TextManagement extends Component {
  state= {
    newText: '',
    loading: false,
    lastImportTime: 'unbekannt',
    importStatus: 'unbekannt'
  };

  // see if server is currently importing or when last import was started
  requestImportStatus = () => {
    fetch(' /backend/lib/admin.php',{
      method: 'POST',
      credentials: 'same-origin', // allow cookies -> session management
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        importStatus: true,
        id: localStorage.getItem('sessionID')
      })
    })
      .then(response => {
        if(response.ok) {
          response.json().then(data => {
            if(data && data.status === 'success') {
              // import status was loaded from server
              this.handleChange('importStatus', data.importStatus || 'unbekannt');
              this.handleChange('lastImportTime', data.lastImport || 'unbekannt');
            } else {
              this.context.handleNotificationChange(true, 'Der Import Status konnte nicht vom Server geladen werden.', 'importStatus', 'error');
            }
          })
        } else {
          this.context.handleNotificationChange(true, 'Der Import Status konnte nicht vom Server geladen werden.', 'importStatus', 'error');
        }
      })
      .catch(error => {
        this.context.handleNotificationChange(true, 'Der Import Status konnte nicht vom Server geladen werden.', 'importStatus', 'error');
      });
  };

  componentDidMount = () => {
    // request import state
    this.requestImportStatus();
  };

  // update state
  handleChange = (prop, value) => {
    this.setState({
      [prop]: value,
    });
  };

  // update state when new text is entered into input field
  handleTextChange = (event) => {
    this.handleChange('newText', event.target.value);
  };

  // delete entered text
  emptyTextField = () => {
    this.handleChange('newText', '');
  };

  // update authors, genres, time range
  updateLogs = () => {
    this.props.requestNewAuthors();
    this.props.requestNewLog();
  };

  // request server to start import from Gutenberg Corpus
  requestImport = () => {
    this.handleChange('loading', true);
    fetch('/backend/lib/admin.php',{
      method: 'POST',
      credentials: 'same-origin', // allow cookies -> session management
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        import: true,
        id: localStorage.getItem('sessionID')
      }),
    })
      .then(response => {
        if(response.ok) {
          response.json().then(data => {
            if(data && data.status === 'success') {
              // import was started on server
              this.context.handleNotificationChange(true, 'Der Import wurde auf dem Server gestartet.', 'import', 'success');
            } else {
              this.context.handleNotificationChange(true, 'Der Import konnte auf dem Server nicht gestartet werden.', 'import', 'error');
            }
          })
        } else {
          this.context.handleNotificationChange(true, 'Der Import konnte auf dem Server nicht gestartet werden.', 'import', 'error');
        }
        this.handleChange('loading', false);
      })
      .catch(error => {
        this.context.handleNotificationChange(true, 'Der Import konnte auf dem Server nicht gestartet werden.', 'import', 'error');
        this.handleChange('loading', false);
      });
  };

  // request server to add input from textfield as new text to database
  requestAddText = () => {
    this.handleChange('loading', true);
    fetch(' /backend/lib/admin.php',{
      method: 'POST',
      credentials: 'same-origin', // allow cookies -> session management
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        addText: true,
        text: this.state.newText,
        id: localStorage.getItem('sessionID')
      })
    })
      .then(response => {
        if(response.ok) {
          response.json().then(data => {
            if(data && data.status === 'success') {
              // import was started on server
              this.context.handleNotificationChange(true, 'Der Text wurde zur Datenbank hinzugefügt.', 'import', 'success');
              this.props.requestNewAuthors();
              this.props.requestNewLog();

            } else {
              this.context.handleNotificationChange(true, 'Der Text konnte nicht hinzugefügt werden.', 'import', 'error');
            }
          })
        } else {
          this.context.handleNotificationChange(true, 'Der Text konnte nicht hinzugefügt werden.', 'import', 'error');
        }
        this.handleChange('loading', false);
      })
      .catch(error => {
        this.context.handleNotificationChange(true, 'Der Import konnte auf dem Server nicht gestartet werden.', 'import', 'error');
        this.handleChange('loading', false);
      });
  };

  render() {
    const {classes} = this.props;
    const {newText, loading, lastImportTime, importStatus} = this.state;

    // show example for how entered text should be formatted
    const FormatExample = () => (
      <div>
        <Typography>
          Bitte geben Sie Texte im folgenden Format ein (\n gibt einen Zeilenumbruch an):
        </Typography><br/>
        <Typography className={classes.newLine} color={'primary'}>
          {`{"metadata": {
            "type": "poem",
            "author": "Guido Zernatto",
            "title": "18 Gedichte",
            "booktitle": "... kündet laut die Zeit",
            "publisher": "Stiasny Verlag",
            "editor": "Hans Brunmayr",
            "year": "1961"
          },
            "content": {
            "Sommerabend": "Gegen neun verdreht der Wind
            \\n Über uns den Zug der Wolkenfläume
            \\n Und fällt tiefer unten in die Bäume,
            \\n Die schon schattenlos im Dämmer sind.
            \\n In den Gräsern ist noch Ruh
            \\n Und die abendliche Feuchte zeigt sich
            \\n Kühl. Aus einem Fenster neigt sich
            \\n Mein Gesicht der Erde zu."
          }
          }`}
        </Typography>
      </div>
    );

    return (
      <div>
        <InfoCard message='Hier können Sie weitere Texte zur Datenbank hinzufügen (Freitext-Feld)
        oder die vorhandenen Gedichte aus der Gutenberg-Sammlung aktualisieren indem Sie auf "Import starten" klicken.'/>
        <div className={classes.importContainer}>
          <Typography variant={'h6'} color={'primary'}>Import Gutenberg</Typography><br/>
          <Typography>Import Status: {importStatus}</Typography>
          <Typography>Letzter Import gestartet: {lastImportTime}</Typography>
          <div className={classes.buttonsContainer}>
            <Button
              className={classes.importButton}
              color={'primary'}
              variant={'contained'}
              disabled={loading}
              onClick={this.requestImport}
            >
              Import starten
            </Button>
            <Button
              className={classes.secondaryButton}
              color={'primary'}
              variant={'text'}
              disabled={loading}
              onClick={this.requestImportStatus}
            >
              Import-Status aktualisieren
            </Button>
          </div>
        </div>
        <Divider variant='middle' className={classes.divider}/><br/>
        <div className={classes.addTextContainer}>
          <Typography variant={'h6'} color={'primary'}>Text hinzufügen</Typography><br/>

          <div className={classes.flexContainer}>
            <TextField
              variant='outlined'
              multiline={true}
              className={classes.textInput}
              value={newText}
              onChange={this.handleTextChange}
              disabled={loading}
              placeholder={'Geben Sie hier einen Text ein, der dem Beispiel-Format entspricht.'}
            />
          </div>
          <div className={classes.buttonsContainer}>
            <Button
              className={classes.importButton}
              color={'primary'}
              variant={'contained'}
              disabled={loading}
              onClick={this.requestAddText}
            >
              Text abschicken
            </Button>
            <Button
              className={classes.secondaryButton}
              color={'primary'}
              variant={'text'}
              disabled={loading}
              onClick={this.emptyTextField}
            >
              Eingabe löschen
            </Button>
          </div>
          <br/>
          {FormatExample()}
          <br/>
        </div>
      </div>
    )
  }
}

TextManagement.propTypes = {
  classes: PropTypes.object.isRequired,
  requestNewAuthors: PropTypes.func.isRequired,
  requestNewLog: PropTypes.func.isRequired,
};

TextManagement.contextType = NotificationContext;

const styles = theme => ({
  textPaper: {
    paddingTop: '10px',
  },
  importButton:{
    marginTop: theme.spacing.unit,
  },
  importContainer:{
    marginLeft: theme.spacing.unit,
  },
  addTextContainer:{
    marginLeft: theme.spacing.unit,
  },
  textInput:{
    width: 800 + theme.spacing.unit*12,
  },
  divider:{
    marginTop: theme.spacing.unit * 5,
    width: 800 + theme.spacing.unit*12,
  },
  buttonsContainer:{
    display: 'flex',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2,
  },
  secondaryButton:{
    marginLeft: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit,
  },
  newLine:{
    whiteSpace: 'pre-wrap',
  }
});

export default withStyles(styles)(TextManagement);