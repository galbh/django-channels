import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, TextField } from '@material-ui/core';
import styles from './update-profile.page.scss';
import userModel from '../../../common/state/auth/auth.models';
import CardComponent from '../../components/card/card.component.jsx';
import FormButtonsComponent from '../form-buttons/form-buttons.component.jsx';
import { UpdateProfileAction, FetchLoggedInUserAction } from '../../../common/state/auth/auth.actions';
import { StartLoaderAction, StopLoaderAction } from '../../../common/state/shared/shared.actions';

class UpdateProfilePage extends Component {
  constructor (props) {
    super(props);
    this.state = {
      username: '',
      full_name: '',
      email: ''
    };
    this.setDefaults = this.setDefaults.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
  }

  componentDidMount () {
    this.setDefaults();
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.loggedInUser !== prevProps.loggedInUser) {
      this.setDefaults();
    }
  }

  setDefaults () {
    const { loggedInUser } = this.props;
    if (!loggedInUser) return;

    Object.keys(loggedInUser).forEach((key) => {
      this.state[key] = loggedInUser[key];
      this.forceUpdate();
    });
  }

  updateProfile (data) {
    const {
      updateProfile, startLoader, stopLoader, fetchLoggedInUser
    } = this.props;

    startLoader();
    updateProfile(data)
      .then(() => fetchLoggedInUser())
      .then(() => stopLoader());
  }

  render () {
    const { loggedInUser } = this.props;
    const { username, full_name, email } = this.state; // eslint-disable-line camelcase

    return (
      <div className={styles.container}>
        <CardComponent
          components={[
            {
              title: 'settings',
              element: (
                <Grid container spacing={24}>
                  <Unit
                    label="username"
                    stateKey="username"
                    value={username}
                    onChange={e => this.setState({ username: e.target.value })}
                    originalValue={loggedInUser && loggedInUser.username}
                    updateProfile={this.updateProfile}
                    onCancel={this.setDefaults}
                  />
                  <Unit
                    label="full name"
                    value={full_name} // eslint-disable-line camelcase
                    stateKey="full_name"
                    onChange={e => this.setState({ full_name: e.target.value })}
                    originalValue={loggedInUser && loggedInUser.full_name}
                    updateProfile={this.updateProfile}
                    onCancel={this.setDefaults}
                  />
                  <Unit
                    type="email"
                    label="email"
                    value={email}
                    stateKey="email"
                    onChange={e => this.setState({ email: e.target.value })}
                    originalValue={loggedInUser && loggedInUser.email}
                    updateProfile={this.updateProfile}
                    onCancel={this.setDefaults}
                  />
                </Grid>
              )
            }
          ]}
        />

      </div>
    );
  }
}

const Unit = ({
  type, label, value, stateKey, onChange, originalValue, updateProfile, onCancel
}) => (
  <Grid item lg={4} md={6} xs={12}>
    <TextField
      fullWidth
      className={styles.input}
      type={type}
      label={label}
      value={value}
      onChange={onChange}
    />
    {
      value !== originalValue &&
        <div className={styles.buttonsContainer}>
          <FormButtonsComponent
            onSubmit={() => updateProfile({ [stateKey]: value })}
            onCancel={onCancel}
          />
        </div>
    }
  </Grid>
);

UpdateProfilePage.propTypes = {
  loggedInUser: PropTypes.shape(userModel)
};

UpdateProfilePage.defaultProps = { loggedInUser: null };

function mapStateToProps (state) {
  return {
    loggedInUser: state.auth.loggedInUser
  };
}

function mapDispatchToProps (dispatch) {
  return {
    updateProfile: data => dispatch(new UpdateProfileAction(data)),
    startLoader: () => dispatch(new StartLoaderAction()),
    stopLoader: () => dispatch(new StopLoaderAction()),
    fetchLoggedInUser: () => dispatch(new FetchLoggedInUserAction())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfilePage);
