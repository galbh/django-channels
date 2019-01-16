import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, Snackbar } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import styles from './snackbar.component.scss';

const SnackbarComponent = ({ isRender, onClose, message }) => (
  <Snackbar
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left'
    }}
    open={isRender}
    autoHideDuration={6000}
    onClose={onClose}
    ContentProps={{
      'aria-describedby': 'message-id'
    }}
    message={<span id="message-id">{message}</span>}
    action={[
      <IconButton
        key="close"
        aria-label="Close"
        color="inherit"
        className={styles.closeBtn}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
    ]}
  />
);

SnackbarComponent.propTypes = {
  isRender: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired
};

export default SnackbarComponent;
