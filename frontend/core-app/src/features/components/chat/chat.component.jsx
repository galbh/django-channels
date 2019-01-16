import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, TextField } from '@material-ui/core';
import styles from './chat.component.scss';
import { messageModel } from '../../../common/state/room/room.models';
import RoomMessagesComponent from '../room-messages/room-messages.component.jsx';

class ChatComponent extends Component {
  constructor (props) {
    super(props);
    this.state = { text: '' };
  }

  render () {
    const { onSendMessage, messages } = this.props;

    return (
      <form
        className={styles.container}
        onSubmit={(e) => {
          e.preventDefault();
          onSendMessage(this.state.text);
          this.setState({ text: '' });
        }}
      >
        <RoomMessagesComponent messages={messages} />
        <div className={styles.sendPanel}>
          <TextField
            fullWidth
            multiline
            placeholder="write your message"
            label="message"
            value={this.state.text}
            onChange={e => this.setState({ text: e.target.value })}
          />
          <Button
            variant="outlined"
            type="submit"
          >
            send
          </Button>
        </div>
      </form>
    );
  }
}

ChatComponent.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  messages: PropTypes.arrayOf(PropTypes.shape(messageModel)).isRequired
};

export default ChatComponent;
