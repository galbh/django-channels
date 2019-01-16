import React from 'react';
import propTypes from 'prop-types';
import LogoSrc from '../../../../assets/img/logo.png';
import styles from './logo.component.scss';

const LogoComponent = props => (
  <div role="presentation" className={styles.logo}>
    <img src={LogoSrc} alt="solar edge logo" />
  </div>
);

LogoComponent.propTypes = {
  history: propTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
};

export default LogoComponent;
