import websocketInitialState from './websocket.state';
import { INITIATE_WEBSOCKET } from './websocket.actions';

function websocketReducer (state = websocketInitialState, action) {
  switch (action.type) {
    case INITIATE_WEBSOCKET:
      return { ...state, instance: action.payload };

    default:
      return state;
  }
}

export default websocketReducer;
