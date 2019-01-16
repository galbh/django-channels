import React from 'react';
import PropTypes from 'prop-types';
import Popover from '@material-ui/core/Popover';
import styles from './popover.component.scss';

const PopoverComponent = ({
  anchorEl, open, onClose, content
}) => (
  <div className={styles.popover}>
    <Popover
      id="simple-popper"
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
    >
      {content}
    </Popover>
  </div>

);

PopoverComponent.propTypes = {
  content: PropTypes.element.isRequired,
  anchorEl: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};

PopoverComponent.defaultProps = {
  anchorEl: null
};

export default PopoverComponent;
