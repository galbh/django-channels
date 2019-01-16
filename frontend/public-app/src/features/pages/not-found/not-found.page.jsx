import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import styles from './not-found.page.scss';
import { routes } from '../../../common/constants';

class NotFoundPage extends Component {
  render() {
    return (
      <div className={styles.container}>
        <Redirect to={routes.login} />
      </div>
    )
  }
}

export default NotFoundPage;
