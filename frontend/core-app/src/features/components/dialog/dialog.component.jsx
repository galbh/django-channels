import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import { DialogTitle, DialogContent } from '@material-ui/core';
import { CloseDialogAction } from '../../../common/state/dialog/dialog.actions';
import styles from './dialog.component.scss';

const DialogComponent = props => (
  <Dialog
    className={styles.dialog}
    style={props.isRtl ? { direction: 'rtl' } : null}
    open={props.open}
    onClose={() => props.dispatch(new CloseDialogAction())}
  >
    <DialogTitle>{props.title}</DialogTitle>

    <DialogContent className={styles.content}>
      {props.text}
    </DialogContent>

  </Dialog>
);

DialogComponent.propTypes = {
  open: propTypes.bool.isRequired,
  title: propTypes.string,
  text: propTypes.oneOfType([propTypes.string, propTypes.element]),
  dispatch: propTypes.func.isRequired,
  isRtl: propTypes.bool
};

DialogComponent.defaultProps = { title: '', text: '', isRtl: false };

export default connect()(DialogComponent);
