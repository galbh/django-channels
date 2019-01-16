import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Button } from '@material-ui/core';
import styles from './form-buttons.component.scss';

const FormButtonsComponent = ({ onCancel, onSubmit }) => (
  <Grid container spacing={24} className={styles.formButtons}>
    <Grid item xs={6}>
      <Button onClick={onSubmit} color="primary" variant="raised">confirm</Button>
    </Grid>
    <Grid item xs={6}>
      <Button onClick={onCancel} color="secondary" variant="raised">dismiss</Button>
    </Grid>
  </Grid>
);

FormButtonsComponent.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default FormButtonsComponent;
