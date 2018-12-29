import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = {

};

// https://reacttraining.com/react-router/web/example/basic

function Navbar(props) {
  const { classes } = props;
  return(
    <div>Ich bin die Navbar!</div>
  )
}

Navbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navbar);