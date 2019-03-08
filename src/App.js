import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import theme from './theme/theme'
import { MuiThemeProvider } from '@material-ui/core/styles';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import NotificationContext from './components/notifications/NotificationContext';
import Header from './components/views/navigation/Header';
import Login from './components/views/login/Login';
import Browser from './components/views/browser/Browser';
import About from './components/views/About';
import Admin from './components/views/admin/Admin';
import MissingPage from './components/views/MissingPage';
import Notification from './components/notifications/NotificationSnackbar';
import ScriptDownload from './components/views/ScriptDownload';

// App component
class App extends React.Component {
  state = {
    loggedIn: false,
    sessionID: 0,
    isAdmin: false,
    timeRange: {
      minYear: '',
      maxYear: '',
    },
    authors: [],
    genres: ['poem', 'ballad', 'sonnet'],
    notification: {
      show: false,
      statusCode: 0,
      message: 'notification',
      action: '',
      variant: 'error',
    }
  };

  // set state of App component
  handleStateChange = (prop, value) => {
    this.setState({
      [prop]: value,
    }, () => {
      if(prop === 'sessionID' && this.state.loggedIn === true) {
        this.requestSuggestions();
      }
    });
  };

  // open/close notification snackbar, display message (depending on optional statusCode and variant)
  handleNotificationChange = (show, message, action, variant, statusCode, ) => {
    this.handleStateChange('notification', {
      show: show,
      statusCode: statusCode? statusCode : 0,
      message: message? message : '',
      action: action,
      variant: variant? variant : 'error',
    });
  };

  requestSuggestions = () => {
    // request initial data (authors, genres, time range, user status
    this.requestAuthors();
    this.requestLog();
  };

  // request authors list
  requestAuthors = () => {
    fetch("/backend/lib/functions.php", {
      method: 'POST',
      credentials: 'same-origin', // allow cookies -> session management
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authors: true,
        id: this.state.sessionID,
      })
    }).then(response => {
        if(response.ok) {
          response.json().then(data => {
            if(data && data.status === 'success' && data.authors) {
              this.handleStateChange('authors', JSON.parse(data.authors));
            } else {
              // server error
              this.handleNotificationChange(true, 'Autoren/Genres/Zeitspanne konnten nicht vom Server geladen werden.', 'initialLoad', 'error');
            }
          });
        } else {
          this.handleNotificationChange(true, 'Autoren/Genres/Zeitspanne konnten nicht vom Server geladen werden.', 'initialLoad', 'error');
        }
      }
    ).catch(error => {
        this.handleNotificationChange(true, 'Autoren/Genres/Zeitspanne konnten nicht vom Server geladen werden.', 'initialLoad', 'error', 404);
      }
    );
  };

  // request genres + time range
  requestLog = () => {
    fetch("/backend/lib/functions.php", {
      method: 'POST',
      credentials: 'same-origin', // allow cookies -> session management
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        log: true,
        id: this.state.sessionID
      })
    }).then(response => {
        if(response.ok) {
          response.json().then(data => {
            if(data && data.status === 'success' && data.log) {
              let parsedLog = JSON.parse(data.log);
              let parsedGenre = parsedLog.genre? parsedLog.genre.replace('[','').replace(']','').split(',') : [];
              let parsedMinYear = parsedLog.minYear? parsedLog.minYear.slice(0,4) : '';
              let parsedMaxYear = parsedLog.maxYear? parsedLog.maxYear.slice(0,4) : '';
              this.handleStateChange('genres', parsedGenre);
              this.handleStateChange('timeRange', {minYear: parsedMinYear, maxYear: parsedMaxYear});
            } else {
              this.handleNotificationChange(true, 'Autoren/Genres/Zeitspanne konnten nicht vom Server geladen werden.', 'initialLoad', 'error');
            }
          });
        } else {
          this.handleNotificationChange(true, 'Autoren/Genres/Zeitspanne konnten nicht vom Server geladen werden.', 'initialLoad', 'error');
        }
      }
    ).catch(error => {
        this.handleNotificationChange(true, 'Autoren/Genres/Zeitspanne konnten nicht vom Server geladen werden.', 'initialLoad', 'error', 404);
      }
    );
  };

  // check if user is logged in (valid session id) and if he is an admin
  requestUserStatus = () => {
    fetch("/backend/lib/sessionManagement.php", {
      method: 'POST',
      credentials: 'same-origin', // allow cookies -> session management
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        loginStatus: true,
        loginID: this.state.sessionID
      })
    }).then(response => {
        if(response.ok) {
          response.json().then(data => {
            if(!data || data.status === 'error') {
              this.handleNotificationChange(true, 'Ihre Sitzung ist abgelaufen.', 'sessionCheck', 'error');
              this.handleStateChange('loggedIn', false);
              this.handleStateChange('isAdmin', false);
              console.log('error1');
              return 'false';
            } else {
              console.log('success');
              return 'true';
            }
          });
        } else {
          this.handleNotificationChange(true, 'Ihre Sitzung ist abgelaufen.', 'sessionCheck', 'error');
          this.handleStateChange('loggedIn', false);
          this.handleStateChange('isAdmin', false);
          console.log('error2');
          return 'false';
        }
      }
    ).catch(error => {
        this.handleNotificationChange(true, 'Ihre Sitzung ist abgelaufen.', 'sessionCheck', 'error', 404);
        this.handleStateChange('loggedIn', false);
        this.handleStateChange('isAdmin', false);
      console.log('error3');
      return 'false';
      }
    );
  };

  // executed after component is inserted into the tree
  componentDidMount = () => {
    // request initial data (authors, genres, time range, user status
    this.requestAuthors();
    this.requestLog();
  };

  // logout user, request server to delete sessionID, display error if necessary
  logout = () => {
    fetch('/backend/lib/sessionManagement.php', {
      method: 'POST',
      credentials: 'same-origin', // allow cookies -> session management
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        logout: true,
        loginID: this.state.sessionID
      })
    })
      .then(response => {
        if(response.ok && response.json().status === 'success') {
          this.handleNotificationChange(true, 'Logout erfolgreich', 'logout', 'success');
        }
        this.setState({
          loggedIn: false,
          isAdmin: false,
        });
      })
      .catch(error => {
        this.handleNotificationChange(true, error.message, 'logout', 'error', 404);
        this.setState({
          loggedIn: false,
          isAdmin: false,
        });
      });
  };

  render() {
    const { classes } = this.props;
    const { loggedIn, isAdmin, authors, timeRange, notification, genres, sessionID } = this.state;

    return (
      <MuiThemeProvider theme={theme}>
        <NotificationContext.Provider
          value={{
            error: notification.show,
            message: notification.message,
            statusCode: notification.statusCode,
            action: notification.action,
            variant: notification.variant,
            handleNotificationChange: this.handleNotificationChange,
          }}
        >
          <div className={classes.root}>
            <Router>
              <div>
                <Header loggedIn={loggedIn} isAdmin={isAdmin} logout={this.logout}/>
                <div className={classes.contentWrapper}>
                  <Switch>
                    <Route exact path='/' render={() => (
                      loggedIn? (<Browser requestStatus={this.requestUserStatus} authorsList={authors} minYear={timeRange.minYear} maxYear={timeRange.maxYear} genres={genres}/>) :
                        (<Redirect to='/login'/>)
                    )}/>
                    <Route path='/about' component={About}/>
                    <Route path='/scripts' render={() => (
                      loggedIn? (<ScriptDownload requestStatus={this.requestUserStatus}/>) : (<Redirect to='/login'/>)
                    )}/>
                    <Route path='/admin' render={() => (
                      (loggedIn && isAdmin)? (<Admin requestNewAuthors={this.requestAuthors} requestNewLog={this.requestLog} requestStatus={this.requestUserStatus}/>) : (<Redirect to='/' />)
                    )}/>
                    <Route path='/login' render={() => (
                      loggedIn? (<Redirect to='/'/>) : (<Login handleAppStateChange={this.handleStateChange} />)
                    )}/>

                    <Route component={MissingPage}/>
                  </Switch>
                </div>
                <Notification />
              </div>
            </Router>
          </div>
        </NotificationContext.Provider>
      </MuiThemeProvider>
    );
  }
}

const styles = {
  root: {
    height: '100%',
  },
  contentWrapper: {
    height: '100%',
    paddingTop: 0,
  },
  routerWrapper: {
    height: '100%',
  },
};

export default withStyles(styles)(App);
