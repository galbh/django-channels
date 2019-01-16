export const STARTED_SUFFIX = '_STARTED';
export const FAILED_SUFFIX = '_FAILED';
export const SUCCESS_SUFFIX = '_SUCCESS';

export const ROUTES = {
  empty: '/',
  rooms: '/rooms',
  updateProfile: '/update-profile',
  room: id => `/rooms/${id}`,
  roomUpdate: id => `/rooms/${id}/update`
};

export const WEBSOCKET_CHANNEL_EVENT_TYPES = [];

export const WEBSOCKET_CHANNELS_DICT = {
  room: 'rooms',
  notifications: 'notifications',
  event: 'event',
  report: 'report',
  users: 'users'
};

export const WEBSOCKET_CHANNELS = [
  WEBSOCKET_CHANNELS_DICT.room,
  WEBSOCKET_CHANNELS_DICT.notifications
];

export const WEBSOCKET_ADDRESS = '/ui-channel';

export const WEBSOCKET_STATES = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3
};

export const DATE_FORMAT = 'DD/MM/YYYY hh:mm A';

export const mobileMaxWidth = 1023;
