import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

// button to trigger search in browser
class SearchButton extends React.Component {
  state = {};

  buttonLabel = (this.props.variant === 'search')? 'Suchen' : 'gesamten Korpus herunterladen';
  buttonVariant = (this.props.variant === 'search')? 'contained' : 'text';

  // display tip on hover
  searchTip = 'Alle Texte abfragen, die den eingegebenen Kriterien entsprechen';
  getAllTip = 'Alle verfügbaren Texte abfragen';
  buttonTips = this.props.variant === 'search'? this.searchTip : this.getAllTip;

  render() {
    const { classes } = this.props;
    return(
      <div className={classes.root}>
        <Tooltip title={this.buttonTips} placement={'bottom-start'}>
          <Button
            color={'primary'}
            variant={this.buttonVariant}
            disabled={this.props.getLoading()}
            onClick={this.props.handleSubmit}
          >
            {this.buttonLabel}
          </Button>
        </Tooltip>
      </div>
    )
  }
}

SearchButton.propTypes = {
  classes: PropTypes.object.isRequired,
  variant: PropTypes.string,
  getLoading: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

const styles = theme => ({
  root:{
    margin: theme.spacing.unit,
  }
});

export default withStyles(styles)(SearchButton);