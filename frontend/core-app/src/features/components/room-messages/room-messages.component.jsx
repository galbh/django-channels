import React from 'react';
import PropTypes from 'prop-types';
import styles from './room-messages.component.scss';
import { messageModel } from '../../../common/state/room/room.models';

const RoomMessagesComponent = ({ messages }) => (
  <div>
    {
      messages.map(message => (
        <div className={styles.container} key={message.id}>
          <div className={styles.text}>{message.text}</div>
          <div className={styles.creator}>{message.creator.username}</div>
        </div>
      ))
    }
  </div>
);

RoomMessagesComponent.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape(messageModel)).isRequired
};

export default RoomMessagesComponent;
