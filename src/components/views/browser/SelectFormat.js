import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

class SelectFormat extends React.Component {
  state = {
    checkedTXT: this.props.initialValues.checkedTXT,
    checkedJSON: this.props.initialValues.checkedJSON,
    checkedXML: this.props.initialValues.checkedXML,
    error: false,
  };

  handleChange = name => event => {
    let propName = "checked" + name.toUpperCase();
    this.setState({ [propName]: event.target.checked }, () => {
      this.props.onChange(propName, this.state[propName]);
    });
  };

  checkboxes = ['txt', 'json', 'xml'];

  render() {
    const { classes, getDisabled } = this.props;
    const { error } = this.state;
    return(
      <div className={classes.root}>
        <FormControl
          component='fieldset'
          required
          error={error}
          disabled={getDisabled()}>
          <FormGroup row>
            {this.checkboxes.map((format, index) => (
              <FormControlLabel
                key={'format-' + index.toString()}
                control={
                  <Checkbox
                    checked={this.state["checked" + format.toUpperCase()]}
                    onChange={this.handleChange(format)}
                    value={"checked" + format.toUpperCase()}
                    color="primary"
                    disableRipple={true}
                  />
                }
                label={format.toUpperCase()}
              />
            ))}
          </FormGroup>
          {error && <FormHelperText>Wählen Sie mindestens ein Text-Format aus</FormHelperText>}
        </FormControl>
      </div>
    )
  }
}

SelectFormat.propTypes = {
  classes: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  getDisabled: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

const styles = theme => ({
  root:{
    marginLeft: theme.spacing.unit,
  }
});

export default withStyles(styles)(SelectFormat);