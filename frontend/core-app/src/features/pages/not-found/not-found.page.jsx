import React from 'react';
import { Redirect } from 'react-router-dom';
import styles from './not-found.page.scss';
import { ROUTES } from '../../../common/constants';

const NotFoundPage = () => (
  <div className={styles.container}>
    <Redirect to={ROUTES.rooms} />
  </div>
);

export default NotFoundPage;
