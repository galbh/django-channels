import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import propTypes from 'prop-types';
import styles from './app.page.scss';
import SpinnerComponent from './features/components/spinner/spinner.component.jsx';
import DialogComponent from './features/components/dialog/dialog.component.jsx';
import DrawerComponent from './features/components/drawer/drawer.component.jsx';
import { ROUTES, WEBSOCKET_ADDRESS } from './common/constants';
import { StartLoaderAction, StopLoaderAction } from './common/state/shared/shared.actions';
import { FetchLoggedInUserAction, LogoutAction } from './common/state/auth/auth.actions';
import { InitiateWebsocketAction, createAbsoluteWebSocketUrl } from './common/state/websocket/websocket.actions';
import SnackbarComponent from './features/components/snackbar/snackbar.component.jsx';
import { OpenSnackbarAction, CloseSnackbarAction } from './common/state/snackbar/snackbar.actions';
import { CloseDrawerAction } from './common/state/drawer/drawer.actions';

class App extends Component {
  componentDidMount () {
    this.initiateData();

    // redirect to homepage if route is empty
    if (this.props.location.pathname === ROUTES.empty) {
      this.props.history.push(ROUTES.rooms);
    }
  }

  initiateData () {
    const {
      startLoader, stopLoader, fetchLoggedInUser, initiateWebsocket
    } = this.props;

    // initiate websocket
    const websocketAddress = createAbsoluteWebSocketUrl(WEBSOCKET_ADDRESS);
    initiateWebsocket(websocketAddress);

    // Fetch logged in user
    startLoader();
    fetchLoggedInUser().then(user => stopLoader());
  }

  render () {
    const {
      isRtl, loading, children, isDialogRender, dialogComponent,
      closeSnackbar, closeDrawer, startLoader, dialogTitle,
      dialogType, isDrawerRender, location, isSnackbarRender,
      notification, logout
    } = this.props;

    return (
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        className={styles.container}
      >
        {/* Loader */}
        {loading && <SpinnerComponent />}

        {/* Routes */}
        {children}

        {/* Dialog */}
        <DialogComponent
          open={isDialogRender}
          title={dialogTitle}
          type={dialogType}
          text={dialogComponent}
        />

        {/* Drawer menu */}
        <DrawerComponent
          open={isDrawerRender}
          openSecondary={isRtl}
          currentRoute={location.pathname}
          closeDrawer={closeDrawer}
          logout={() => { startLoader(); logout(); }}
        />

        {/* Snackbar */}
        <SnackbarComponent
          isRender={isSnackbarRender}
          message={notification}
          onClose={closeSnackbar}
        />
      </div>
    );
  }
}

App.propTypes = {
  loading: propTypes.bool.isRequired,
  children: propTypes.element.isRequired,
  isDialogRender: propTypes.bool.isRequired,
  dialogComponent: propTypes.oneOfType([propTypes.element, propTypes.string]),
  dialogTitle: propTypes.string.isRequired,
  dialogType: propTypes.string,
  isDrawerRender: propTypes.bool.isRequired,
  isRtl: propTypes.bool.isRequired,
  isSnackbarRender: propTypes.bool.isRequired,
  notification: propTypes.string
};

App.defaultProps = {
  dialogComponent: '',
  dialogType: null,
  notification: null
};

function mapStateToProps (state) {
  return {
    loading: state.shared.loading,
    isDialogRender: state.dialog.isRender,
    dialogTitle: state.dialog.title,
    dialogComponent: state.dialog.component,
    dialogType: state.dialog.type,
    isDrawerRender: state.drawer.isRender,
    isRtl: state.shared.isRtl(),
    isSnackbarRender: state.snackbar.isRender,
    notification: state.snackbar.message
  };
}

function mapDispatchToProps (dispatch) {
  return {
    startLoader: () => dispatch(new StartLoaderAction()),
    stopLoader: () => dispatch(new StopLoaderAction()),
    fetchLoggedInUser: () => dispatch(new FetchLoggedInUserAction()),
    initiateWebsocket: address => dispatch(new InitiateWebsocketAction(address)),
    openSnackbar: notification => dispatch(new OpenSnackbarAction(notification)),
    closeSnackbar: () => dispatch(new CloseSnackbarAction()),
    logout: () => dispatch(new LogoutAction()),
    closeDrawer: () => dispatch(new CloseDrawerAction())
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
