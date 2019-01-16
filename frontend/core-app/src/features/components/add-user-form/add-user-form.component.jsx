import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Chip, MenuItem, Select } from '@material-ui/core';
import styles from './add-user-form.component.scss';
import userModel from '../../../common/state/auth/auth.models';
import FormButtonsComponent from '../form-buttons/form-buttons.component.jsx';

class AddUserFormComponent extends Component {
  constructor (props) {
    super(props);
    this.state = { users: [] };
  }

  render () {
    const { users, onCancel, onSubmit } = this.props;

    return (
      <div className={styles.container}>
        <Select
          fullWidth
          multiple
          className={styles.select}
          value={this.state.users}
          placeholder="select users"
          onChange={e => this.setState({ users: e.target.value })}
          renderValue={selected => (
            <div>
              {selected.map(value => (
                <Chip key={value} label={users.find(u => u.id === value).full_name} />
              ))}
            </div>
          )}
        >
          {
            users.map(user => (
              <MenuItem key={user.id} value={user.id}>{user.username}</MenuItem>
            ))
          }
        </Select>

        <FormButtonsComponent
          onCancel={onCancel}
          onSubmit={() => onSubmit(this.state.users)}
        />
      </div>
    );
  }
}

AddUserFormComponent.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(PropTypes.shape(userModel)).isRequired
};

export default AddUserFormComponent;
