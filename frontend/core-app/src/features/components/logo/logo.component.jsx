import React from 'react';
import LogoSrc from '../../../../assets/img/logo.png';
import styles from './logo.component.scss';

const LogoComponent = props => (
  <div role="presentation" className={styles.logo}>
    <img src={LogoSrc} alt="solar edge logo" />
  </div>
);

export default LogoComponent;
