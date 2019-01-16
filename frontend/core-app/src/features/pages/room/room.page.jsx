import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Divider } from '@material-ui/core';
import GroupIcon from '@material-ui/icons/Group';
import styles from './room.page.scss';
import { SendWebsocketAction } from '../../../common/state/websocket/websocket.actions';
import roomModel, { reportModel } from '../../../common/state/room/room.models';
import ChatComponent from '../../components/chat/chat.component.jsx';
import CalendarComponent from '../../components/calendar/calendar.component.jsx';
import ExpansionPanelComponent from '../../components/expansion-panel/expansion-panel.component.jsx';
import EventComponent from '../../components/event/event.component.jsx';
import FloatingActionButtonComponent from '../../components/floating-action-button/floating-action-button.component.jsx';
import { CloseDialogAction, OpenDialogAction } from '../../../common/state/dialog/dialog.actions';
import AddUserFormComponent from '../../components/add-user-form/add-user-form.component.jsx';
import userModel from '../../../common/state/auth/auth.models';
import { UpdateRoomAction, RemoveUserFromRoomAction, DeleteTimeSlotAction } from '../../../common/state/room/room.actions';
import { StartLoaderAction, StopLoaderAction } from '../../../common/state/shared/shared.actions';
import FormButtonsComponent from '../../components/form-buttons/form-buttons.component.jsx';
import MissingVotersListComponent from '../../components/missing-voters-list/missing-voters-list.component.jsx';

class RoomPage extends Component {
  componentDidMount () {
    const { match, sendToWebsocket } = this.props;

    sendToWebsocket({
      channel: 'join_room',
      room_id: match.params.roomId
    });

    this.fetchData();
  }

  componentDidUpdate (prevProps, prevState) {
    const { websocket } = this.props;

    if (websocket !== prevProps.websocket) {
      this.fetchData();
    }
  }

  componentWillUnmount () {
    const { match, sendToWebsocket } = this.props;
    sendToWebsocket({
      channel: 'leave_room',
      room_id: match.params.roomId
    });
  }

  fetchData () {
    const { match, sendToWebsocket } = this.props;
    sendToWebsocket({ channel: 'rooms' });
    sendToWebsocket({ channel: 'users' });
    sendToWebsocket({ channel: 'event', room_id: match.params.roomId });
    sendToWebsocket({ channel: 'report', room_id: match.params.roomId });
  }

  render () {
    const {
      rooms, match, sendToWebsocket, loggedInUser, startLoader, stopLoader,
      report, openDialog, closeDialog, users, updateRoom, removeUserFromRoom, deleteTimeSlot
    } = this.props;
    const room = rooms.find(r => r.id.toString() === match.params.roomId);
    const members = room && room.members;
    const isRoomCreator = loggedInUser && room && loggedInUser.id === room.creator.id;
    const nonMemberUsers = room && users.filter(user => !room.members.find(m => m.id === user.id));

    return (
      <div className={styles.container}>
        {
          room &&
          <div>
            {/* Room name */}
            <div className={styles.roomName}>
              <div>{room.name}</div>
              <div className={styles.createdBy}>created by {room.creator.username}</div>
            </div>

            <Divider />

            {/* Users list */}
            <div className={styles.usersList}>
              <GroupIcon />
              {
                members &&
                members.map(user => (
                  <div
                    key={user.id}
                    className={
                      loggedInUser &&
                        user.id === loggedInUser.id
                        ? `${styles.userListItem} ${styles.myUser}`
                        : styles.userListItem
                    }
                    onClick={
                      loggedInUser &&
                        user.id !== loggedInUser.id &&
                        room.creator.id === loggedInUser.id
                        ? () => openDialog(
                          'Confirm',
                          <form className={styles.confirmRemoveUserForm}>
                            {`Are you sure you want to remove user: ${user.username}`}
                            <FormButtonsComponent
                              onCancel={closeDialog}
                              onSubmit={() => {
                                startLoader();
                                removeUserFromRoom(room.id, user.id)
                                  .then(() => { stopLoader(); closeDialog(); });
                              }}
                            />
                          </form>
                        )
                        : null
                    }
                  >
                    {user.username}
                  </div>
                ))
              }

              {
                isRoomCreator && nonMemberUsers.length > 0 &&
                nonMemberUsers.length < users.length &&
                <FloatingActionButtonComponent
                  mini
                  onClick={() => {
                    openDialog(
                      'add user',
                      <AddUserFormComponent
                        onCancel={closeDialog}
                        onSubmit={(selectedUsers) => {
                          startLoader();
                          updateRoom(selectedUsers, room.id)
                            .then(() => { closeDialog(); stopLoader(); });
                        }}
                        users={nonMemberUsers}
                      />
                    );
                  }}
                  title="add user"
                />
              }

            </div>

            <Grid container spacing={24}>

              {/* Vote dates for event */}
              <Grid item lg={4} md={6} xs={12}>
                <ExpansionPanelComponent
                  title={
                    <div className={styles.cardTitle}>
                      <div>select an available time slot</div>
                    </div>
                  }
                  content={
                    <CalendarComponent
                      minDate={room.event.min_date}
                      maxDate={room.event.max_date}
                      duration={room.event.duration}
                      onPostTimeSlot={(timeSlot) => {
                        sendToWebsocket({
                          channel: 'post_time_slot',
                          time_slot: timeSlot,
                          room_id: room.id,
                          user_id: loggedInUser ? loggedInUser.id : 1
                        });
                      }}
                    />
                  }
                />
              </Grid>

              {/* Event */}
              {
                loggedInUser && report.submissions && Object.keys(report.submissions).length > 0 &&
                <Grid item lg={4} md={6} xs={12}>
                  <ExpansionPanelComponent
                    title={
                      <div className={styles.cardTitle}>
                        <div>Submissions</div>
                      </div>
                    }
                    content={
                      <EventComponent
                        event={room.event}
                        report={report}
                        loggedInUser={loggedInUser}
                        onDeleteTimeSlot={(timeSlotId) => {
                          openDialog(
                            'confirm',
                            <form className={styles.confirmDeleteTimeSlot}>
                              <div>are you sure you want to remove ?</div>
                              <FormButtonsComponent
                                onCancel={closeDialog}
                                onSubmit={() => {
                                  startLoader();
                                  deleteTimeSlot(room.event.id, timeSlotId)
                                    .then(() => closeDialog())
                                    .then(() => stopLoader())
                                    .then(() => sendToWebsocket({ channel: 'report', room_id: room.id }));
                                }}
                              />
                            </form>
                          );
                        }}
                      />
                    }
                  />
                </Grid>
              }

              {/* Chat */}
              {
                loggedInUser &&
                <Grid item lg={4} md={6} xs={12}>
                  <ExpansionPanelComponent
                    title={
                      <div className={styles.cardTitle}>
                        <div>chat</div>
                      </div>
                    }
                    content={
                      <ChatComponent
                        className={styles.chatContainer}
                        messages={room.messages}
                        onSendMessage={(text) => {
                          sendToWebsocket({
                            channel: 'post_message',
                            text,
                            room_id: room.id
                          });
                        }}
                      />
                    }
                  />
                </Grid>
              }

              {/* Missing voters */}
              {
                report.missing_voters && report.missing_voters.length > 0 &&
                <Grid item lg={4} md={6} xs={12}>
                  <ExpansionPanelComponent
                    title={
                      <div className={styles.cardTitle}>
                        <div>missing voters</div>
                        <div
                          className={styles.lightFont}
                        >
                          {report.missing_voters.length} / {room.members.length}
                        </div>
                      </div>
                    }
                    content={
                      <MissingVotersListComponent voters={report.missing_voters} />
                    }
                  />
                </Grid>
              }
            </Grid>
          </div>
        }
      </div>
    );
  }
}

RoomPage.propTypes = {
  websocket: PropTypes.instanceOf(WebSocket),
  rooms: PropTypes.arrayOf(PropTypes.shape(roomModel)).isRequired,
  report: PropTypes.shape(reportModel).isRequired,
  users: PropTypes.arrayOf(PropTypes.shape(userModel))
};

RoomPage.defaultProps = { websocket: null, users: [] };

function mapStateToProps (state) {
  return {
    websocket: state.websocket.instance,
    rooms: state.room.rooms,
    loggedInUser: state.auth.loggedInUser,
    timeSlots: state.room.timeSlots,
    report: state.room.report,
    users: state.auth.users
  };
}

function mapDispathToProps (dispatch) {
  return {
    sendToWebsocket: data => dispatch(new SendWebsocketAction(data)),
    openDialog: (title, component) => dispatch(new OpenDialogAction(title, component)),
    closeDialog: () => dispatch(new CloseDialogAction()),
    updateRoom: (users, roomId) => dispatch(new UpdateRoomAction(users, roomId)),
    startLoader: () => dispatch(new StartLoaderAction()),
    stopLoader: () => dispatch(new StopLoaderAction()),
    removeUserFromRoom: (roomId, userId) => dispatch(RemoveUserFromRoomAction(roomId, userId)),
    deleteTimeSlot: (eventId, timeSlotId) => dispatch(new DeleteTimeSlotAction(eventId, timeSlotId))
  };
}

export default connect(mapStateToProps, mapDispathToProps)(RoomPage);
