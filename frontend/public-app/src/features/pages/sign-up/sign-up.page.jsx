import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import styles from './sign-up.page.scss';
import CardComponent from '../../components/card/card.component.jsx';
import { Button, TextField, Grid } from '@material-ui/core';
import { routes } from '../../../common/constants';
import { StartLoaderAction, StopLoaderAction } from '../../../common/state/shared/shared.actions';
import { SignUpAction } from '../../../common/state/auth/auth.actions';

class SignUpPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    };
  }

  render() {

    const { t, signUp, startLoader, stopLoader } = this.props;

    return (
      <div className={styles.container}>
        <CardComponent
          className={styles.card}
          contentClassName={styles.cardContent}
          components={[
            {
              title: 'sign up',
              element: (
                <form                  
                  onSubmit={e => {
                    e.preventDefault();
                    startLoader();
                    signUp(this.state.username, this.state.password)
                  }}
                >
                  <Grid container spacing={24}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label={t('USERNAME')}
                        value={this.state.username}
                        onChange={e => this.setState({ username: e.target.value })}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        type="password"
                        autoComplete="new-password"
                        label={t('PASSWORD')}
                        value={this.state.password}
                        onChange={e => this.setState({ password: e.target.value })}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Link to={routes.login}>already signed up? LOGIN</Link>
                    </Grid>

                    <Grid item xs={12}>
                      <Button type='submit' variant='raised' color='primary'>submit</Button>
                    </Grid>

                  </Grid>
                </form>
              )
            }
          ]}
        />
      </div>
    )
  }
}

SignUpPage.propTypes = {
  t: PropTypes.func.isRequired
};

function mapStateToProps(dispatch) {
  return {
    startLoader: () => dispatch(new StartLoaderAction()),
    stopLoader: () => dispatch(new StopLoaderAction()),
    signUp: (username, password) => dispatch(new SignUpAction(username, password))
  }
}

export default connect(null, mapStateToProps)(translate()(SignUpPage));
