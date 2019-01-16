import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import styles from './event.component.scss';
import { reportModel } from '../../../common/state/room/room.models';
import ReportComponent from '../report/report.component.jsx';
import userModel from '../../../common/state/auth/auth.models';

const EventComponent = ({ report, loggedInUser, onDeleteTimeSlot }) => (

  <Grid container className={styles.container}>
    {
      report &&
      <div className={styles.timeSlotsList}>
        <ReportComponent
          report={report}
          loggedInUser={loggedInUser}
          onDeleteTimeSlot={onDeleteTimeSlot}
        />
      </div>
    }
  </Grid>
);

EventComponent.propTypes = {
  report: PropTypes.shape(reportModel),
  loggedInUser: PropTypes.shape(userModel).isRequired,
  onDeleteTimeSlot: PropTypes.func.isRequired
};

EventComponent.defaultProps = { report: null };

export default EventComponent;
