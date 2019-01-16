import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { DateTimePicker } from 'material-ui-pickers';
import { Grid, TextField } from '@material-ui/core';
import styles from './update-room.page.scss';
import { FetchRoomByIdAction, ResetSelectedRoomAction, UpdateRoomInfoAction } from '../../../common/state/room/room.actions';
import { StartLoaderAction, StopLoaderAction } from '../../../common/state/shared/shared.actions';
import roomModel from '../../../common/state/room/room.models';
import FormButtonsComponent from '../../components/form-buttons/form-buttons.component.jsx';
import CardComponent from '../../components/card/card.component.jsx';

class UpdateRoomPage extends Component {
  constructor (props) {
    super(props);
    this.state = {
      name: '',
      duration: '',
      description: '',
      maxDate: moment().toISOString()
    };
    this.setDefaults = this.setDefaults.bind(this);
    this.updateRoom = this.updateRoom.bind(this);
  }

  componentDidMount () {
    const {
      match, startLoader, stopLoader, fetchRoomById
    } = this.props;
    startLoader();
    fetchRoomById(match.params.roomId)
      .then(() => stopLoader());
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.selectedRoom !== prevProps.selectedRoom) {
      this.setDefaults();
    }
  }

  componentWillUnmount () {
    this.props.resetSelectedRoom();
  }

  setDefaults () {
    const { selectedRoom } = this.props;
    this.setState({
      name: selectedRoom.name,
      duration: selectedRoom.event.duration.toString(),
      description: selectedRoom.event.description,
      maxDate: selectedRoom.event.max_date
    });
  }

  updateRoom (data) {
    const {
      updateRoom, startLoader, stopLoader, fetchRoomById, match, selectedRoom
    } = this.props;

    startLoader();
    updateRoom({ ...data, roomId: selectedRoom.id })
      .then(() => fetchRoomById(match.params.roomId))
      .then(() => stopLoader());
  }

  render () {
    const {
      name, duration, description, minDate, maxDate
    } = this.state;
    const { selectedRoom } = this.props;

    return (
      <div className={styles.container}>
        {
          selectedRoom && selectedRoom.event &&
          <CardComponent
            components={[
              {
                title: 'update room information',
                element: (
                  <Grid container spacing={24}>
                    <Unit
                      label="name"
                      stateKey="name"
                      value={name}
                      onChange={e => this.setState({ name: e.target.value })}
                      originalValue={selectedRoom.name}
                      updateProfile={this.updateRoom}
                      onCancel={this.setDefaults}
                    />

                    <Unit
                      label="duration"
                      value={duration}
                      type="number"
                      stateKey="duration"
                      onChange={e => this.setState({ duration: e.target.value })}
                      originalValue={selectedRoom.event.duration.toString()}
                      updateProfile={this.updateRoom}
                      onCancel={this.setDefaults}
                    />

                    <Unit
                      label="description"
                      value={description}
                      stateKey="description"
                      onChange={e => this.setState({ description: e.target.value })}
                      originalValue={selectedRoom.event.description.toString()}
                      updateProfile={this.updateRoom}
                      onCancel={this.setDefaults}
                    />

                    {/* Update event time frame */}

                    <Grid item lg={4} md={6} xs={12}>
                      <DateTimePicker
                        fullWidth
                        keyboard
                        label="Maximun date:"
                        minDate={moment(minDate).add(1, 'days')}
                        value={maxDate}
                        onChange={date => this.setState({ maxDate: date })}
                        format="DD/MM/YYYY hh:mm A"
                        disableOpenOnEnter
                        ampm={false}
                        disablePast
                      />

                      {
                        maxDate !== selectedRoom.event.max_date &&
                        <div className={styles.buttonsContainer}>
                          <FormButtonsComponent
                            onCancel={() => {
                              this.setState({
                                minDate: moment().toISOString(),
                                maxDate: selectedRoom.event.max_date
                              });
                            }}
                            onSubmit={() => this.updateRoom({ max_date: maxDate })}
                          />
                        </div>
                      }
                    </Grid>

                  </Grid>
                )
              }
            ]}
          />
        }
      </div>
    );
  }
}

const Unit = ({
  type, label, value, stateKey, onChange, originalValue, updateProfile, onCancel
}) => (
  <Grid item lg={4} md={6} xs={12}>
    <TextField
      fullWidth
      className={styles.input}
      type={type}
      label={label}
      value={value}
      onChange={onChange}
    />
    {
      value !== originalValue &&
        <div className={styles.buttonsContainer}>
          <FormButtonsComponent
            onSubmit={() => updateProfile({ [stateKey]: value })}
            onCancel={onCancel}
          />
        </div>
    }
  </Grid>
);

UpdateRoomPage.propTypes = {
  selectedRoom: PropTypes.shape(roomModel)
};

UpdateRoomPage.defaultProps = { selectedRoom: null };

function mapStateToProps (state) {
  return {
    selectedRoom: state.room.selectedRoom
  };
}

function mapDispatchToProps (dispatch) {
  return {
    fetchRoomById: roomId => dispatch(new FetchRoomByIdAction(roomId)),
    resetSelectedRoom: () => dispatch(new ResetSelectedRoomAction()),
    startLoader: () => dispatch(new StartLoaderAction()),
    stopLoader: () => dispatch(new StopLoaderAction()),
    updateRoom: data => dispatch(new UpdateRoomInfoAction(data))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateRoomPage);
