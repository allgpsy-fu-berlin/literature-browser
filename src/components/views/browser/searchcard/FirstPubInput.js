import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';
import Typography from '@material-ui/core/Typography';

// select firstpub time range in which to search
class FirstPubInput extends React.PureComponent {
  state = {
    firstpubFrom: this.props.initialFirstpubFrom,
    firstpubTo: this.props.initialFirstpubTo,
    minFirstpub: this.props.minFirstpub,
    maxFirstpub: this.props.maxFirstpub,
    firstpubFromError: false,
    firstpubToError: false,
  };

  // update state with new min/max firstpub year if props change
  componentWillReceiveProps = nextProps => {
    if(this.props.minFirstpub !== nextProps.minFirstpub || this.props.maxFirstpub !== nextProps.maxFirstpub) {
      this.setState({minFirstpub: nextProps.minFirstpub, maxFirstpub: nextProps.maxFirstpub});
}
  };

  handleChange = name => event => {
    const value = event.target.value;
    const firstpub = parseInt(value);
    let newState = {};

    // check input for right time frame
    if(name === 'firstpubFrom') {
      newState.firstpubFromError = (firstpub < this.props.minFirstpub || firstpub > this.props.maxFirstpub);
    } else if(name === 'firstpubTo') {
      newState.firstpubToError = (firstpub < this.props.minFirstpub || firstpub > this.props.maxFirstpub);
    }

    this.setState(newState, () => {
      this.props.handleBrowserChange('firstpubError', (this.state.firstpubFromError || this.state.firstpubToError));
      this.setState({
        [name]: value,
      }, () => {
        if(!this.state.firstpubFromError && !this.state.firstpubToError) {
          this.props.onInputChange(this.props.cardId, name, this.state[name]);
        }
      });
    });
  };

  render() {
    const { classes, variant, initialFirstpubTo, initialFirstpubFrom, disabled } = this.props;
    const { firstpubFrom, firstpubTo, minFirstpub, maxFirstpub, firstpubToError, firstpubFromError } = this.state;

    return(
      <div className={classes.root}>
        <FormGroup row={true}>
          <TextField
            id="fromFirstpub"
            label="von (Ertveröffentlichung)"
            placeholder={minFirstpub}
            inputProps={{min: initialFirstpubFrom , max: initialFirstpubTo}}
            value={firstpubFrom}
            onChange={this.handleChange('firstpubFrom')}
            type="number"
            className={classes.textField}
            variant={variant}
            disabled={disabled}
            error={firstpubFromError}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            id="toFirstpub"
            label="bis (Erstveröffentlichung)"
            placeholder={maxFirstpub}
            inputProps={{min: initialFirstpubFrom , max: initialFirstpubTo}}
            value={firstpubTo}
            onChange={this.handleChange('firstpubTo')}
            type="number"
            className={classes.textField}
            variant={variant}
            disabled={disabled}
            error={firstpubToError}
            InputLabelProps={{
              shrink: true,
            }}
          />
          {(this.state.firstpubToError || this.state.firstpubFromError) &&
          <Typography color={'error'} className={classes.errorMessage}>
            Bitte geben Sie eine Zahl zwischen {this.props.minFirstpub} und {this.props.maxFirstpub} ein.
          </Typography>}
        </FormGroup>
      </div>
    )
  }
}

FirstPubInput.propTypes = {
  classes: PropTypes.object.isRequired,
  cardId: PropTypes.string.isRequired,
  variant: PropTypes.string.isRequired,
  initialFirstpubFrom: PropTypes.string.isRequired,
  initialFirstpubTo: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  onInputChange: PropTypes.func.isRequired,
  minFirstpub: PropTypes.string.isRequired,
  maxFirstpub: PropTypes.string.isRequired,
  handleBrowserChange: PropTypes.func.isRequired,
};

const styles = theme => ({
  root:{
    display: 'flex',
    flexGrow: 1,
    paddingTop: 5,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginTop: theme.spacing.unit,
    position: 'relative',
  },
  textField: {
    maxWidth: 140,
    marginRight: theme.spacing.unit * 2,
  },
  center:{

  },
  errorMessage:{
    fontSize: '0.75rem'
  },
});

export default withStyles(styles)(FirstPubInput);
