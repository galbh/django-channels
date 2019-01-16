import PropTypes from 'prop-types';
import userModel from '../auth/auth.models';

const arrayOfUsers = PropTypes.arrayOf(PropTypes.shape(userModel));
const stringOrNumber = PropTypes.oneOfType([PropTypes.number, PropTypes.string]);

export const messageModel = {
  text: PropTypes.string,
  creator: PropTypes.shape(userModel),
  id: stringOrNumber
};

export const timeSlotModel = {
  start_date: PropTypes.string,
  end_date: PropTypes.string,
  user: PropTypes.shape(userModel)
};

export const eventModel = {
  id: PropTypes.number,
  start_time: PropTypes.string,
  end_time: PropTypes.string,
  address: PropTypes.string,
  description: PropTypes.string
};

export const reportModel = {
  submissions: PropTypes.shape({
    [PropTypes.string]: PropTypes.shape({
      votes_count: PropTypes.number,
      voters: PropTypes.arrayOf(PropTypes.shape(userModel))
    })
  }),
  matches: PropTypes.arrayOf(PropTypes.string)
};

const roomModel = {
  name: PropTypes.string,
  active_users: arrayOfUsers,
  admins: arrayOfUsers,
  members: arrayOfUsers,
  creator: PropTypes.shape(userModel),
  messages: PropTypes.arrayOf(PropTypes.shape(messageModel)),
  id: stringOrNumber,
  event: PropTypes.shape(eventModel)
};

export default roomModel;
