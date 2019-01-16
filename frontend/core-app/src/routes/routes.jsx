import React from 'react';
import { HashRouter as Router, Switch } from 'react-router-dom';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import App from '../app.page.jsx';
import DefaultLayout from './default/default-layout.page.jsx';
import i18n from '../../i18n';
import { ROUTES } from '../common/constants';
import RoomsPage from '../features/pages/rooms/rooms.page.jsx';
import RoomPage from '../features/pages/room/room.page.jsx';
import UpdateProfilePage from '../features/components/update-profile/update-profile.page.jsx';
import NotFoundPage from '../features/pages/not-found/not-found.page.jsx';
import UpdateRoomPage from '../features/pages/update-room/update-room.page.jsx';

const Root = ({ store }) => ({
  render () {
    return (
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <Router>
              <App>
                <Switch>
                  <DefaultLayout exact path={ROUTES.rooms} component={RoomsPage} />
                  <DefaultLayout exact path={ROUTES.room(':roomId')} component={RoomPage} />
                  <DefaultLayout path={ROUTES.roomUpdate(':roomId')} component={UpdateRoomPage} />
                  <DefaultLayout path={ROUTES.updateProfile} component={UpdateProfilePage} />

                  UpdateRoomPage
                  <DefaultLayout path="*" component={NotFoundPage} />
                </Switch>
              </App>
            </Router>
          </MuiPickersUtilsProvider>
        </Provider>
      </I18nextProvider>
    );
  }
});

export default Root;
