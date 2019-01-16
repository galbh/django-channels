import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon, IconButton, Grid, List, ListItem } from '@material-ui/core';
import styles from './rooms.page.scss';
import { SendWebsocketAction } from '../../../common/state/websocket/websocket.actions';
import roomModel from '../../../common/state/room/room.models';
import CardComponent from '../../components/card/card.component.jsx';
import { ROUTES } from '../../../common/constants';
import FloatingActionButtonComponent from '../../components/floating-action-button/floating-action-button.component.jsx';
import { OpenDialogAction, CloseDialogAction } from '../../../common/state/dialog/dialog.actions';
import AddRoomFormComponent from '../../components/add-room-form/add-room-form.component.jsx';
import { CreateRoomAction, DeleteRoomAction } from '../../../common/state/room/room.actions';
import { StartLoaderAction, StopLoaderAction } from '../../../common/state/shared/shared.actions';
import userModel from '../../../common/state/auth/auth.models';
import PopoverComponent from '../../components/popover/popover.component.jsx';
import FormButtonsComponent from '../../components/form-buttons/form-buttons.component.jsx';

class RoomsPage extends Component {
  constructor (props) {
    super(props);
    this.state = { anchorEl: null, selectedRoom: null };
  }

  componentDidMount () {
    if (this.props.websocket) {
      this.initiate();
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.websocket !== prevProps.websocket) {
      this.initiate();
    }
  }

  initiate () {
    this.props.sendToWebsocket({ channel: 'rooms' });
  }

  render () {
    const {
      rooms, history, openDialog, loggedInUser, deleteRoom,
      startLoader, stopLoader, closeDialog, createRoom
    } = this.props;

    const { selectedRoom } = this.state;

    return (
      <Grid container spacing={24} className={styles.container}>
        {
          rooms.map(room => (
            // Rooms list
            <Grid
              item
              key={room.id}
              lg={4}
              md={6}
              xs={12}
            >
              <ListItem
                button
                className={styles.listItem}
                onClick={() => history.push(ROUTES.room(room.id))}
              >
                <CardComponent
                  components={[{
                    title: (
                      room.name !== room.event.description
                        ? `${room.name} - ${room.event.description}`
                        : room.name
                    ),
                    element: (
                      <div>
                        {/* More options button */}
                        {
                          loggedInUser && loggedInUser.id === room.creator.id &&
                          <IconButton
                            className={styles.moreOptionsBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              this.setState({ anchorEl: e.currentTarget, selectedRoom: room });
                            }}
                          >
                            <Icon>more_vert</Icon>
                          </IconButton>
                        }

                        {
                          room.active_users.length > 0 &&
                          <div>
                            {/* Online users list */}
                            <div className={styles.subtitle}>
                              online {room.active_users.length > 1 ? 'users' : 'user'}
                            </div>
                            <div className={styles.onlineUsers}>
                              {
                                room.active_users.map(user =>
                                  <div key={user.id}>{user.username}</div>)}
                            </div>
                          </div>
                        }
                      </div>
                    )
                  }]}
                />
              </ListItem>
            </Grid>
          ))
        }

        {/* More options popup */}
        <PopoverComponent
          anchorEl={this.state.anchorEl}
          onClose={() => this.setState({ anchorEl: null, selectedRoom: null })}
          open={Boolean(this.state.anchorEl)}
          content={
            <List className={styles.moreOptionsList}>
              <ListItem
                button
                onClick={() => {
                  this.setState({ anchorEl: null });
                  openDialog(
                    'confirm',
                    <form className={styles.confirmDeleteRoom}>
                      <div>are you sure you want to delete {selectedRoom.name}</div>
                      <FormButtonsComponent
                        onCancel={closeDialog}
                        onSubmit={() => {
                          startLoader();
                          deleteRoom(selectedRoom.id)
                            .then(() => closeDialog())
                            .then(() => stopLoader());
                        }}
                      />
                    </form>
                  );
                }}
              >
                <Icon className={styles.icon}>delete</Icon>
                <label>delete</label>
              </ListItem>

              <ListItem button onClick={() => history.push(`/rooms/${selectedRoom.id}/update`)}>
                <Icon className={styles.icon}>edit</Icon>
                <label>edit</label>
              </ListItem>
            </List>
          }
        />

        {
          loggedInUser && loggedInUser.is_superuser === 'True' &&
          <FloatingActionButtonComponent
            onClick={() => {
              openDialog(
                'Create a new room',
                <AddRoomFormComponent
                  closeDialog={closeDialog}
                  onSubmit={(data) => {
                    startLoader();
                    createRoom(data)
                      .then((room) => {
                        stopLoader();
                        closeDialog();
                        history.push(`/rooms/${room.id}`);
                      });
                  }}
                />
              );
            }}
          />
        }
      </Grid>
    );
  }
}

RoomsPage.propTypes = {
  rooms: PropTypes.arrayOf(PropTypes.shape(roomModel)),
  websocket: PropTypes.instanceOf(WebSocket),
  loggedInUser: PropTypes.shape(userModel)
};

RoomsPage.defaultProps = { rooms: [], websocket: null, loggedInUser: null };

function mapStateToProps (state) {
  return {
    websocket: state.websocket.instance,
    rooms: state.room.rooms,
    loggedInUser: state.auth.loggedInUser
  };
}

function mapDispatchToProps (dispatch) {
  return {
    sendToWebsocket: data => dispatch(new SendWebsocketAction(data)),
    openDialog: (title, component) => dispatch(new OpenDialogAction(title, component)),
    closeDialog: () => dispatch(new CloseDialogAction()),
    createRoom: data => dispatch(new CreateRoomAction(data)),
    startLoader: () => dispatch(new StartLoaderAction()),
    stopLoader: () => dispatch(new StopLoaderAction()),
    deleteRoom: roomId => dispatch(new DeleteRoomAction(roomId))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomsPage);
