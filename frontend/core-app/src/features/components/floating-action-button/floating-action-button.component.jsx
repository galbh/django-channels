import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import styles from './floating-action-button.component.scss';

const FloatingActionButtonComponent = ({
  icon, onClick, className, mini, color, title
}) => (
  <Button
    variant="fab"
    color={color}
    aria-label="Add"
    className={`${styles.button} ${className}`}
    onClick={onClick}
    mini={mini}
    title={title}
  >
    {icon}
  </Button>
);

FloatingActionButtonComponent.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  mini: PropTypes.bool,
  color: PropTypes.oneOf(['primary', 'secondary']),
  title: PropTypes.string,
  icon: PropTypes.element
};

FloatingActionButtonComponent.defaultProps = {
  icon: <AddIcon />,
  className: '',
  mini: false,
  color: 'secondary',
  title: null
};

export default FloatingActionButtonComponent;
