import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import { MenuItem, Toolbar, Icon, IconButton } from '@material-ui/core';
import styles from './header.component.scss';
import userModel from '../../../common/state/auth/auth.models';
import PopoverComponent from '../popover/popover.component.jsx';

class HeaderComponent extends Component {
  constructor (props) {
    super(props);
    this.state = { userMenu: null };
  }

  closeUserMenu () {
    this.setState({ userMenu: null });
  }

  render () {
    const { openDrawer, loggedInUser, history } = this.props;
    const { userMenu } = this.state;
    const isUserMenuRender = Boolean(userMenu);

    return (
      <div>
        <AppBar position="static" className={styles.header}>
          <Toolbar>

            {/* Hamburger menu */}
            <IconButton onClick={() => openDrawer()}>
              <Icon className={styles.hamburgerBtn}>menu</Icon>
            </IconButton>

            <div className={styles.actions}>
              {/* User menu */}
              {
                loggedInUser &&
                <div className={styles.userMenuButton}>
                  <div onClick={e => this.setState({ userMenu: e.currentTarget })}>
                    <div>{loggedInUser.username}</div>
                    {
                      <Icon>
                        {isUserMenuRender ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                      </Icon>
                    }
                  </div>

                  <PopoverComponent
                    open={isUserMenuRender}
                    className={styles.popover}
                    anchorEl={userMenu}
                    onClose={() => this.closeUserMenu()}
                    content={
                      <div className={styles.userMenu}>
                        <MenuItem onClick={() => {
                          history.push('/update-profile');
                          this.closeUserMenu();
                        }}
                        >
                          <Icon className={styles.icon}>settings</Icon>
                          <div>Settings</div>
                        </MenuItem>
                      </div>
                    }
                  />
                </div>

              }

            </div>

          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

HeaderComponent.propTypes = {
  openDrawer: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape(userModel),
  history: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
};

HeaderComponent.defaultProps = { loggedInUser: null };

export default withRouter(HeaderComponent);
