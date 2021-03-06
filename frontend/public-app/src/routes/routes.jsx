import React from 'react';
import { HashRouter as Router, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import App from '../app.component.jsx';
import DefaultLayout from './default/default-layout.page.jsx';
import i18n from '../../i18n';
import LoginPage from '../features/pages/login/login.page.jsx';
import ResetPassowordPage from '../features/pages/reset-password/reset-password.page.jsx';
import ConfirmResetPassword from '../features/pages/confirm-reset-password/confirm-reset-password.page.jsx';
import SignUpPage from '../features/pages/sign-up/sign-up.page.jsx';

import { routes } from '../common/constants';
import NotFoundPage from '../features/pages/not-found/not-found.page.jsx';

const Root = ({ store }) => ({
  render () {
    return (
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <Router>
            <App>
              <Switch>
                <DefaultLayout path={routes.login} component={LoginPage} />
                <DefaultLayout path={routes.signUp} component={SignUpPage} />
                <DefaultLayout exact path={routes.resetPassword} component={ResetPassowordPage} />
                <DefaultLayout
                  path={routes.confirmResetPassword}
                  component={ConfirmResetPassword}
                />
                <DefaultLayout path={'*'} component={NotFoundPage} />
              </Switch>
            </App>
          </Router>
        </Provider>
      </I18nextProvider>
    );
  }
});

export default Root;
