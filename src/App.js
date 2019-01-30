import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import theme from './theme/theme'
import { MuiThemeProvider } from '@material-ui/core/styles';
import Header from './components/views/navigation/Header';
import Login from './components/views/login/Login';
import Browser from './components/views/browser/Browser';
import Wiki from './components/views/Wiki';
import About from './components/views/About';

class App extends React.Component {
  requestURL = '';

  render() {
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.root}>
          <Header/>
          <div className={classes.contentWrapper}>
            <Login url={this.requestURL}/>
            <Wiki/>
            <About/>
          </div>
        </div>
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
    backgroundColor: '#fcfcfc',
  }
};

export default withStyles(styles)(App);
