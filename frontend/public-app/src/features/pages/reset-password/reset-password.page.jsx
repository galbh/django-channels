import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import { Grid, TextField, Button } from '@material-ui/core';
import styles from './reset-password.page.scss';
import { RequestResetPasswordAction } from '../../../common/state/auth/auth.actions';
import { OpenDialogAction } from '../../../common/state/dialog/dialog.actions';
import { routes } from '../../../common/constants';
import CardComponent from '../../components/card/card.component.jsx';

class ResetPasswordPage extends Component {
  constructor(props) {
    super(props);
    this.state = { email: '' };
  }

  onSubmit(e) {
    e.preventDefault();

    const { requestResetPassword, openDialog, t } = this.props;

    requestResetPassword(this.state.email)
      .then(() => openDialog(t('SUCCESS'), t('EMAIL_WAS_SENT_SUCCESSFULLY')));
  }

  render() {
    const { t } = this.props;

    return (
      <div className={styles.container}>
        <CardComponent
          className={styles.card}
          contentClassName={styles.cardContent}
          components={[
            {
              title: 'reset password',
              element: (
                <form onSubmit={e => this.onSubmit(e)}>
                  <Grid container spacing={24}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label={t('EMAIL')}
                        placeholder={t('RESET_PASSWORD_EMAIL_PLACEHOLDER')}
                        value={this.state.email}
                        onChange={e => this.setState({ email: e.target.value })}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Link to={routes.login}>already signed up? LOGIN</Link>
                    </Grid>

                    <Grid item xs={12}>
                      <Button type="submit" variant="raised" color="primary">{t('SUBMIT')}</Button>
                    </Grid>
                  </Grid>
                </form>
              )
            }
          ]}
        />
      </div>
    );
  }
}

ResetPasswordPage.propTypes = {
  t: PropTypes.func.isRequired,
  requestResetPassword: PropTypes.func.isRequired,
  openDialog: PropTypes.func.isRequired
};

function mapDispatchToProps(dispatch) {
  return {
    requestResetPassword: email => dispatch(new RequestResetPasswordAction(email)),
    openDialog: (title, component) => dispatch(new OpenDialogAction(title, component))
  };
}

export default connect(null, mapDispatchToProps)(translate()(translate()(ResetPasswordPage)));
