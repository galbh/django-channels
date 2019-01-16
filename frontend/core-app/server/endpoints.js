export default {
  logout: {
    url: '/accounts/logout',
    method: 'GET',
    contentType: 'application/json'
  },

  fetchLoggedInUser: {
    url: '/accounts/logged-in-user',
    method: 'GET',
    contentType: 'application/json'
  },

  createRoom: {
    url: '/room/',
    method: 'POST',
    contentType: 'application/json'
  },

  updateRoom: {
    url: id => `/room/${id}/`,
    method: 'PUT',
    contentType: 'application/json'
  },

  removeUserFromRoom: {
    url: (roomId, userId) => `/room/${roomId}/user/${userId}`,
    method: 'DELETE',
    contentType: 'application/json'
  },

  updateProfile: {
    url: '/accounts/update-profile',
    method: 'PUT',
    contentType: 'application/json'
  },

  deleteTimeSlot: {
    url: (eventId, timeSlotId) => `/event/${eventId}/time-slot/${timeSlotId}`,
    method: 'DELETE',
    contentType: 'application/json'
  },

  deleteRoom: {
    url: roomId => `/room/${roomId}`,
    method: 'DELETE',
    contentType: 'application/json'
  },

  fetchRoomById: {
    url: roomId => `/room/${roomId}`,
    method: 'GET',
    contentType: 'application/json'
  }
};
