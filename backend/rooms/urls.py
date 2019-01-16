from django.conf.urls import url
from backend.rooms.views import RoomsView, RoomView, RemoveUserFromRoom

urlpatterns = [
    url(r'^$', view=RoomsView.as_view()),
    url(r'^(?P<pk>[0-9]+)/$', view=RoomView.as_view()),
    url(r'^(?P<room_id>[0-9]+)/user/(?P<user_id>[0-9]+)$', view=RemoveUserFromRoom.as_view()),
]
