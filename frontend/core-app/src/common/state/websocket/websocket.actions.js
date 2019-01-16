import { WEBSOCKET_ADDRESS, WEBSOCKET_STATES, WEBSOCKET_CHANNELS_DICT } from '../../constants';
import { ReceiveRoomsAction, ReceiveNotificationAction, ReceiveEventAction, ReceiveReportAction } from '../room/room.actions';
import { ReceiveUsersAction } from '../auth/auth.actions';

export const INITIATE_WEBSOCKET = 'INITIATE_WEBSOCKET';
const LOCALHOST = 'localhost:8000';

export function InitiateWebsocketAction (address) {
  return (dispatch) => {
    const ws = new WebSocket(address);
    dispatch(new RegisterWebsocketAction(ws));
  };
}

export const createAbsoluteWebSocketUrl = (wsUrl) => {
  const l = window.location;
  const getProtocol = p => ((l.protocol === 'https:') ? 'wss://' : 'ws://');
  const protocol = getProtocol(l.protocol);

  if (process.env.NODE_ENV === 'production') {
    return `${protocol}${l.host}${wsUrl}`;
  }

  return `${protocol}${LOCALHOST}${wsUrl}`;
};

function RegisterWebsocketAction (ws) {
  return (dispatch, getState) => {
    /* eslint-disable no-param-reassign */
    ws.onopen = e => dispatch({ type: INITIATE_WEBSOCKET, payload: ws });
    ws.onmessage = e => handleMessage(e.data, dispatch, getState);
    ws.onclose = (e) => {
      dispatch({ type: INITIATE_WEBSOCKET, payload: null });
      reconnect(dispatch, getState);
    };
    ws.onerror = (error) => { throw new Error(error.type); };
    /* eslint-disable no-param-reassign */
  };
}

function reconnect (dispatch, getState) {
  setTimeout(() => {
    const ws = dispatch(new GetWebsocketAction());
    if (!ws) {
      const websocketAddress = createAbsoluteWebSocketUrl(WEBSOCKET_ADDRESS);
      dispatch(new InitiateWebsocketAction(websocketAddress));
    } else {
      reconnect(dispatch, getState);
    }
  }, 3000);
}

export const GetWebsocketAction = () => (dispatch, getState) => {
  const websocket = getState().websocket.instance;
  return websocket && websocket.readyState === WEBSOCKET_STATES.OPEN ? websocket : null;
};

function handleMessage (event, dispatch, getState) {
  const parsed = JSON.parse(event);
  const { channel } = parsed;

  const { rooms } = getState().room;
  const { loggedInUser } = getState().auth;

  const room = parsed.room_id && rooms.find(r => r.id.toString() === parsed.room_id.toString());

  const activate = () => {
    const Action = ACTIONS_DICT[channel];
    dispatch(new Action(parsed));
  };

  if (room) {
    const { members } = room;
    const isMember = loggedInUser
      ? members.find(m => m.id.toString() === loggedInUser.id.toString())
      : true;

    if (!parsed.room_id) activate();
    if (isMember) activate();
  } else if (
    channel === WEBSOCKET_CHANNELS_DICT.room ||
    channel === WEBSOCKET_CHANNELS_DICT.users) {
    activate();
  }
}

const ACTIONS_DICT = {
  rooms: ReceiveRoomsAction,
  notifications: ReceiveNotificationAction,
  post_time_slot: ReceiveNotificationAction,
  event: ReceiveEventAction,
  report: ReceiveReportAction,
  users: ReceiveUsersAction
};

export function SendWebsocketAction (subscription) {
  return (dispatch, getState) => {
    const websocket = dispatch(new GetWebsocketAction());
    if (websocket) {
      websocket.send(JSON.stringify(subscription));
    }
  };
}
