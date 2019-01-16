import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Grid, Button } from '@material-ui/core';
import { DateTimePicker } from 'material-ui-pickers';
import styles from './calendar.component.scss';

class CalendarComponent extends Component {
  constructor (props) {
    super(props);
    this.state = {
      start_time: this.formatDate(moment().add(1, 'days'))
    };
  }

  getDuration (duration) {
    const hours = duration / 60;
    let text = '';
    if (duration >= 60 < 120) {
      text = 'hour';
    } else {
      text = 'hours';
    }
    return `${hours} ${text}`;
  }

  formatDate (date) {
    return date.format('YYYY-MM-DDThh:mm');
  }

  render () {
    const {
      onPostTimeSlot, maxDate, duration
    } = this.props;

    return (
      <div className={styles.container}>
        {
          moment(maxDate).diff(moment()) > 0
            ? (
              <form
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  onPostTimeSlot(this.state);
                }}
              >
                <Grid container spacing={24}>
                  <Grid item xs={12} lg={6}>
                    <DateTimePicker
                      fullWidth
                      keyboard
                      label="Date:"
                      minDate={moment().toISOString()}
                      maxDate={maxDate}
                      value={this.state.start_time}
                      onChange={date => this.setState({ start_time: date })}
                      format="DD/MM/YYYY hh:mm A"
                      disableOpenOnEnter
                      ampm={false}
                      disablePast
                      className={styles.calender}
                    />
                  </Grid>

                  <Grid item xs={12} lg={6}>
                    <label>Duration</label>
                    <div>{this.getDuration(duration)}</div>
                  </Grid>

                  <Grid item xs={12} lg={12}>
                    <Button className={styles.submitBtn} type="submit" variant="outlined">
                      add
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )
            : (
              <div>this event is past due</div>
            )
        }
      </div>
    );
  }
}

CalendarComponent.propTypes = {
  onPostTimeSlot: PropTypes.func.isRequired,
  maxDate: PropTypes.string,
  duration: PropTypes.number.isRequired
};

const today = new Date();
const weekFromNow = moment(today).add(7, 'days');

CalendarComponent.defaultProps = {
  maxDate: weekFromNow.toISOString()
};

export default CalendarComponent;
