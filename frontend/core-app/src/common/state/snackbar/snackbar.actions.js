export const OPEN_SNACKBAR = 'OPEN_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';

/**
* Sync actions
* */
export function OpenSnackbarAction (message) {
  return {
    type: OPEN_SNACKBAR,
    payload: message
  };
}

export function CloseSnackbarAction () {
  return {
    type: CLOSE_SNACKBAR,
    message: ''
  };
}
