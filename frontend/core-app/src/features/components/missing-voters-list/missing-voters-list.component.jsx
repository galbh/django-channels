import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, ListItemText } from '@material-ui/core';
import styles from './missing-voters-list.component.scss';
import userModel from '../../../common/state/auth/auth.models';

const MissingVotersListComponent = ({ voters }) => (
  <List className={styles.container}>
    {
      voters.map(voter => (
        <ListItem key={voter.id}>
          <ListItemText primary={voter.username} />
        </ListItem>
      ))
    }
  </List>
);

MissingVotersListComponent.propTypes = {
  voters: PropTypes.arrayOf(PropTypes.shape(userModel)).isRequired
};

export default MissingVotersListComponent;
