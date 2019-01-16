import { combineReducers } from 'redux';
import authReducer from './state/auth/auth.reducer';
import sharedReducer from './state/shared/shared.reducer';
import dialogReducer from './state/dialog/dialog.reducer';
import drawerReducer from './state/drawer/drawer.reducer';
import websocketReducer from './state/websocket/websocket.reducer';
import roomReducer from './state/room/room.reducer';
import snackbarReducer from './state/snackbar/snackbar.reducer';

const rootReducer = combineReducers({
  auth: authReducer,
  shared: sharedReducer,
  dialog: dialogReducer,
  drawer: drawerReducer,
  websocket: websocketReducer,
  room: roomReducer,
  snackbar: snackbarReducer
});

export default rootReducer;
