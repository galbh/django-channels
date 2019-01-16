import React from 'react';
import moment from 'moment';
import { OPEN_SNACKBAR, CLOSE_SNACKBAR } from '../snackbar/snackbar.actions';
import { OpenDialogAction } from '../dialog/dialog.actions';
import { DATE_FORMAT } from '../../constants';
import createAsyncAction from '../../../createAsyncAction';
import ApiService from '../../services/api.service';
import HttpService from '../../services/http.service';

export const RECEIVE_ROOMS = 'RECEIVE_ROOMS';
export const RECEIVE_NOTIFICATION = 'RECEIVE_NOTIFICATION';
export const RECEIVE_EVENT = 'RECEIVE_EVENT';
export const RECEIVE_REPORT = 'RECEIVE_REPORT';
export const CREATE_ROOM = 'CREATE_ROOM';
export const UPDATE_ROOM = 'UPDATE_ROOM';
export const UPDATE_ROOM_INFO = 'UPDATE_ROOM_INFO';
export const REMOVE_USER_FROM_ROOM = 'REMOVE_USER_FROM_ROOM';
export const DELETE_TIME_SLOT = 'DELETE_TIME_SLOT';
export const DELETE_ROOM = 'DELETE_ROOM';
export const FETCH_ROOM_BY_ID = 'FETCH_ROOM_BY_ID';
export const RESET_SELECTED_ROOM = 'RESET_SELECTED_ROOM';

/**
* Sync actions
* */
export function ReceiveRoomsAction (event) {
  return {
    type: RECEIVE_ROOMS,
    payload: event.data
  };
}

export const ReceiveNotificationAction = notification => (dispatch, getState) => {
  if (JSON.parse(notification.data).sender_id === parseInt(getState().auth.loggedInUser.id, 10)) {
    return;
  }

  const audio = new Audio(`${STATIC_DIR}/audio/ringtone.mp3`);
  audio.play();

  dispatch({
    type: OPEN_SNACKBAR,
    payload: notification.message
  });

  setTimeout(() => {
    dispatch({
      type: CLOSE_SNACKBAR
    });
  }, 5000);

  dispatch({
    type: RECEIVE_NOTIFICATION,
    payload: notification.message
  });
};

export const ReceiveEventAction = event => ({
  type: RECEIVE_EVENT,
  payload: event.data
});

export const ReceiveReportAction = report => (dispatch, getState) => {
  const getMatches = (matches) => {
    if (matches.length === 1) {
      return moment(matches[0]).format(DATE_FORMAT);
    }
    /* eslint-disable */
    return (<div>
      {matches.map(match => <div key={match}>{moment(match).format(DATE_FORMAT)}</div>)}
    </div>);
    /* eslint-disable */
  };

  if (report.data.matches.length) {
    dispatch(new OpenDialogAction(
      'we have a match',
      getMatches(report.data.matches)
    ));
  }

  dispatch({
    type: RECEIVE_REPORT,
    payload: report.data
  });
};

export const CreateRoomAction = createAsyncAction(
  CREATE_ROOM,
  ({ name, address, description, minDate, maxDate }) => {
    const options = ApiService.getOptions('createRoom');
    return HttpService.fetch({
      ...options,
      body: JSON.stringify({ name, address, description, minDate, maxDate })
    });
  });


export const UpdateRoomAction = createAsyncAction(
  UPDATE_ROOM,
  (users, roomId) => {
    const options = ApiService.getOptions('updateRoom');
    return HttpService.fetch({
      ...options,
      url: options.url(roomId),
      body: JSON.stringify({ users })
    });
  });

export const UpdateRoomInfoAction = createAsyncAction(UPDATE_ROOM_INFO, (data) => {
  const options = ApiService.getOptions('updateRoom');
  return HttpService.fetch({ ...options, url: options.url(data.roomId), body: JSON.stringify(data) });
});

export const RemoveUserFromRoomAction = createAsyncAction(
  REMOVE_USER_FROM_ROOM,
  (roomId, userId) => {
    const options = ApiService.getOptions('removeUserFromRoom');
    return HttpService.fetch({ ...options, url: options.url(roomId, userId) });
  });

export const DeleteTimeSlotAction = createAsyncAction(
  DELETE_TIME_SLOT,
  (eventId, timeSlotId) => {
    const options = ApiService.getOptions('deleteTimeSlot');
    return HttpService.fetch({ ...options, url: options.url(eventId, timeSlotId) });
  });

export const DeleteRoomAction = createAsyncAction(
  DELETE_ROOM,
  (roomId) => {
    const options = ApiService.getOptions('deleteRoom');
    return HttpService.fetch({ ...options, url: options.url(roomId) });
  });

export const FetchRoomByIdAction = createAsyncAction(
  FETCH_ROOM_BY_ID,
  (roomId) => {
    const options = ApiService.getOptions('fetchRoomById');
    return HttpService.fetch({ ...options, url: options.url(roomId) });
  });

export const ResetSelectedRoomAction = () => {
  return {
    type: RESET_SELECTED_ROOM
  }
}

