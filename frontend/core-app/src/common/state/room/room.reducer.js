import initialState from './room.state';
import { RECEIVE_ROOMS, RECEIVE_NOTIFICATION, RECEIVE_EVENT, RECEIVE_REPORT, FETCH_ROOM_BY_ID, RESET_SELECTED_ROOM } from './room.actions';
import { SUCCESS_SUFFIX } from '../../constants';

const RoomReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_ROOMS:
      return { ...state, rooms: action.payload };

    case RECEIVE_NOTIFICATION:
      return { ...state, notification: action.payload };

    case RECEIVE_EVENT:
      return { ...state, timeSlots: action.payload.time_slots, event: action.payload.event };

    case RECEIVE_REPORT:
      return { ...state, report: action.payload };

    case `${FETCH_ROOM_BY_ID}${SUCCESS_SUFFIX}`:
      return { ...state, selectedRoom: action.payload };

    case RESET_SELECTED_ROOM:
      return { ...state, selectedRoom: null };

    default: return state;
  }
};

export default RoomReducer;
