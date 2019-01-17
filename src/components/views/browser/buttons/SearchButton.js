import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

class SearchButton extends React.Component {
  state = {};

  buttonLabel = (this.props.variant === 'search')? 'Suchen' : 'gesamten Korpus herunterladen';
  buttonVariant = (this.props.variant === 'search')? 'contained' : 'text';

  buttonTips = 'Alle Texte abfragen, die den eingegebenen Kriterien entsprechen';

  render() {
    const { classes, variant } = this.props;
    return(
      <div className={classes.root}>
        {(variant === 'search') &&
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
        }
        {!(variant === 'search') &&
        <Button
          color={'primary'}
          variant={this.buttonVariant}
          disabled={this.props.getLoading()}
          onClick={this.props.handleSubmit}
        >
          {this.buttonLabel}
        </Button>
        }

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