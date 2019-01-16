import React from 'react';
import propTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Drawer, MenuItem } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import styles from './drawer.component.scss';
import { ROUTES } from '../../../common/constants';
import LogoComponent from '../logo/logo.component.jsx';

const DrawerComponent = ({
  currentRoute, open, closeDrawer, t, logout
}) => {
  const getClassName = route => (currentRoute === route ? styles.active : null);
  return (
    <Drawer
      open={open}
      className={styles.container}
      variant="temporary"
      onClose={() => closeDrawer()}
    >
      <div className={styles.drawer}>

        <div className={styles.logo}><LogoComponent /></div>

        <DrawerLink
          to={ROUTES.rooms}
          iconSrc="home"
          label={t('ROOMS_PAGE')}
          className={getClassName(ROUTES.rooms)}
          closeDrawer={closeDrawer}
        />

        <DrawerLink
          iconSrc="exit_to_app"
          label={t('LOGOUT')}
          className={getClassName(ROUTES.rooms)}
          closeDrawer={closeDrawer}
          onClick={logout}
        />

      </div>
    </Drawer>
  );
};

const DrawerLink = ({
  to, label, iconSrc, closeDrawer, onClick
}) => (
  to
    ? (
      <NavLink
        activeClassName={styles.active}
        to={to}
      >
        <MenuItem onClick={onClick || closeDrawer}>
          <i className={`${styles.icon} material-icons`}>{iconSrc}</i>
          <span>{label}</span>
        </MenuItem>
      </NavLink>
    )
    : (
      <a>
        <MenuItem onClick={onClick || closeDrawer}>
          <i className={`${styles.icon} material-icons`}>{iconSrc}</i>
          <span>{label}</span>
        </MenuItem>
      </a>
    )

);

DrawerLink.propTypes = {
  to: propTypes.string,
  iconSrc: propTypes.string.isRequired,
  label: propTypes.string.isRequired,
  onClick: propTypes.func,
  closeDrawer: propTypes.func.isRequired
};

DrawerLink.defaultProps = { onClick: null, to: null };

DrawerComponent.propTypes = {
  currentRoute: propTypes.string,
  t: propTypes.func.isRequired,
  open: propTypes.bool.isRequired,
  closeDrawer: propTypes.func.isRequired,
  logout: propTypes.func.isRequired
};

DrawerComponent.defaultProps = { currentRoute: ROUTES.empty };

export default translate()(DrawerComponent);
