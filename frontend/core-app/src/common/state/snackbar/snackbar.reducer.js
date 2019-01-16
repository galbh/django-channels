import initialState from './snackbar.state';
import { OPEN_SNACKBAR, CLOSE_SNACKBAR } from './snackbar.actions';

const SnackbarReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_SNACKBAR:
      return { ...state, isRender: true, message: action.payload };

    case CLOSE_SNACKBAR:
      return { ...state, isRender: false };

    default: return state;
  }
};

export default SnackbarReducer;
