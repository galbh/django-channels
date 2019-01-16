import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Icon, ListItemText, List, ListItem } from '@material-ui/core';
import styles from './report.component.scss';
import { reportModel } from '../../../common/state/room/room.models';
import { DATE_FORMAT } from '../../../common/constants';
import userModel from '../../../common/state/auth/auth.models';

const ReportComponent = ({ report, loggedInUser, onDeleteTimeSlot }) => (
  <div className={styles.container}>
    {
      report.submissions && Object.keys(report.submissions).map(key => (
        key !== 'matches' &&
        <div key={key}>
          {/* time stamp */}
          <div className={styles.timeStamp}>{moment(key).format(DATE_FORMAT)}</div>
          {/* User which selected this time stamp */}
          <List className={styles.usersList}>
            {
              report.submissions[key].votes.map(vote => (
                <ListItem key={vote.user.id}>
                  <ListItemText primary={vote.user.username} />
                  {
                    vote.user.id === loggedInUser.id &&
                    <Icon
                      className={styles.deleteTimeSlotIcon}
                      onClick={() => onDeleteTimeSlot(vote.id)}
                    >
                      clear
                    </Icon>
                  }
                </ListItem>
              ))
            }
          </List>
        </div>
      ))
    }
  </div>
);

ReportComponent.propTypes = {
  report: PropTypes.shape(reportModel).isRequired,
  loggedInUser: PropTypes.shape(userModel).isRequired,
  onDeleteTimeSlot: PropTypes.func.isRequired
};

export default ReportComponent;
