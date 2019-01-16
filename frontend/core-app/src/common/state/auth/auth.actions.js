import createAsyncAction from '../../../createAsyncAction';
import HttpService from '../../services/http.service';
import ApiService from '../../services/api.service';

export const FETCH_LOGGED_IN_USER = 'FETCH_LOGGED_IN_USER';
export const LOGOUT = 'LOGOUT';
export const RECEIVE_USERS = 'RECEIVE_USERS';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';

export const FetchLoggedInUserAction = createAsyncAction(FETCH_LOGGED_IN_USER, () => {
  const options = ApiService.getOptions('fetchLoggedInUser');
  return HttpService.fetch(options);
});

export const LogoutAction = createAsyncAction(LOGOUT, () => {
  const options = ApiService.getOptions('logout');
  return HttpService.fetch(options);
});

export const UpdateProfileAction = createAsyncAction(UPDATE_PROFILE, (data) => {
  const options = ApiService.getOptions('updateProfile');
  return HttpService.fetch({ ...options, body: JSON.stringify(data) });
});

export const ReceiveUsersAction = event => ({
  type: RECEIVE_USERS,
  payload: event.data
});
