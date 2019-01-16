import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { TextField, Grid } from '@material-ui/core';
import { DateTimePicker } from 'material-ui-pickers';
import FormButtonsComponent from '../form-buttons/form-buttons.component.jsx';

class AddRoomFormComponent extends Component {
  constructor (props) {
    super(props);
    this.state = {
      name: '',
      address: '',
      description: '',
      minDate: moment(),
      maxDate: moment().add(7, 'days')
    };
  }

  render () {
    const { closeDialog, onSubmit } = this.props;

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          this.props.onSubmit(this.state);
        }}
      >
        <Grid container spacing={24}>

          <Grid item xs={6}>
            <DateTimePicker
              fullWidth
              keyboard
              label="Minimum date:"
              minDate={moment().subtract(1, 'days')}
              value={this.state.minDate}
              onChange={date => this.setState({ minDate: date })}
              format="DD/MM/YYYY hh:mm A"
              disableOpenOnEnter
              ampm={false}
              disablePast
            />
          </Grid>

          <Grid item xs={6}>
            <DateTimePicker
              fullWidth
              keyboard
              label="Maximum date:"
              minDate={this.state.minDate}
              value={this.state.maxDate}
              onChange={date => this.setState({ maxDate: date })}
              format="DD/MM/YYYY hh:mm A"
              disableOpenOnEnter
              ampm={false}
              disablePast
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              value={this.state.name}
              onChange={e => this.setState({ name: e.target.value })}
              label="room name"
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              value={this.state.description}
              onChange={e => this.setState({ description: e.target.value })}
              label="description"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              value={this.state.address}
              onChange={e => this.setState({ address: e.target.value })}
              label="address"
            />
          </Grid>

          <Grid item xs={12}>
            <FormButtonsComponent
              onCancel={closeDialog}
              onSubmit={() => onSubmit(this.state)}
            />
          </Grid>

        </Grid>
      </form>
    );
  }
}

AddRoomFormComponent.propTypes = {
  closeDialog: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default AddRoomFormComponent;
