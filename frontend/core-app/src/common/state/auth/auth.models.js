import PropTypes from 'prop-types';

const stringOrBool = PropTypes.oneOfType([PropTypes.bool, PropTypes.string]);

const userModel = {
  id: PropTypes.string,
  username: PropTypes.string,
  is_staff: stringOrBool,
  is_superuser: stringOrBool,
  email: PropTypes.string,
  full_name: PropTypes.string
};

export default userModel;
