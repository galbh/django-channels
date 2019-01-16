# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from asgiref.sync import async_to_sync
from rest_framework import generics, mixins, permissions
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response
from rest_framework.status import HTTP_404_NOT_FOUND, HTTP_200_OK, HTTP_400_BAD_REQUEST

from backend.accounts.models import UserProfile
from backend.date_matcher.models import Event
from backend.rooms.constants import Constants

from backend.rooms.models import Room

from backend.rooms.serializers import RoomSerializer
from channels.layers import get_channel_layer

channel_layer = get_channel_layer()


class RoomsView(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
    permission_classes = (permissions.IsAdminUser, )
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

    def get(self, request, *args, **kwargs):
        """
        Get a list of all rooms
        """
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        """
        Create a room
        """
        name = request.data.get('name')
        description = request.data.get('description')
        address = request.data.get('address')
        min_date = request.data.get('minDate')
        max_date = request.data.get('maxDate')

        if name and len(name) > 0:
            creator = UserProfile.objects.get(user=request.user)
            room = Room(name=name, creator=creator)
            room.save()
            room.admins.add(creator)
            room.members.add(creator)
            e = Event.objects.create(description=room.name)

            if description:
                e.description = description

            if address:
                e.address = address

            if min_date:
                e.min_date = min_date

            if max_date:
                e.max_date = max_date

            e.save()

            room.event = e
            room.save()

            update('room {} has been created'.format(name))

            return Response(RoomSerializer(room).data, status=HTTP_200_OK)
        else:
            return Response(Constants().ERRORS['NAME_IS_REQUIRED'], status=HTTP_400_BAD_REQUEST)


class RoomView(generics.RetrieveAPIView, generics.GenericAPIView):
    permission_classes = (permissions.AllowAny, )
    serializer_class = RoomSerializer
    queryset = Room.objects.all()

    def get(self, request, *args, **kwargs):
        """
        Get room by id
        """
        return self.retrieve(kwargs['pk'])

    def put(self, request, *args, **kwargs):
        """
        Update room
        """
        name = request.data.get('name')
        description = request.data.get('description')
        duration = request.data.get('duration')
        users = request.data.get('users')
        max_date = request.data.get('max_date')

        try:
            room = Room.objects.get(id=kwargs['pk'])

            if name and len(name) > 0:
                room.name = name
                room.event.description = name
                room.event.save()

            if users:
                for user_id in users:
                    user = UserProfile.objects.get(id=user_id)
                    room.members.add(user)

            if duration:
                room.event.duration = duration

            if description:
                room.event.description = description

            if max_date:
                room.event.max_date = max_date

            room.event.save()
            room.save()

            update(message='room {} has been updated'.format(room))

            return Response('success', status=HTTP_200_OK)
        except Room.DoesNotExist:
            return Response(Constants().ERRORS['ROOM_NOT_FOUND'], status=HTTP_404_NOT_FOUND)

    @staticmethod
    def delete(request, *args, **kwargs):
        """
        Delete room
        """
        try:
            room = Room.objects.get(id=kwargs['pk'])
            room.messages.all().delete()
            room.event.delete()
            room.delete()

            update(message='room {} has been deleted'.format(room))

            return Response('success', status=HTTP_200_OK)
        except Room.DoesNotExist:
            return Response(Constants().ERRORS['ROOM_NOT_FOUND'], status=HTTP_404_NOT_FOUND)


class RemoveUserFromRoom(generics.DestroyAPIView):
    serializer_class = RoomSerializer
    queryset = Room.objects.all()

    def delete(self, request, *args, **kwargs):
        try:
            room = Room.objects.get(id=kwargs.get('room_id'))

            try:
                user = UserProfile.objects.get(id=kwargs.get('user_id'))
                if room.creator.id == request.user.id:
                    room.members.remove(user)
                    update_client_rooms_list()
                    return Response('user removed successfully', status=HTTP_200_OK)
                else:
                    return Response(Constants().ERRORS['USER_IS_NOT_CREATOR'], status=HTTP_404_NOT_FOUND)
            except UserProfile.DoesNotExist:
                return Response(Constants().ERRORS['USER_NOT_FOUND'], status=HTTP_404_NOT_FOUND)
        except Room.DoesNotExist:
            return Response(Constants().ERRORS['ROOM_NOT_FOUND'], status=HTTP_404_NOT_FOUND)


def update(message):
    update_client_rooms_list()
    send_notification(message)


def update_client_rooms_list():
    async_to_sync(channel_layer.group_send)('rooms', {
        'type': 'send.message',
        'channel': 'rooms',
    })


def send_notification(message, room_id=None, sender_id=None):
    response = {
        'type': 'send.message',
        'channel': 'notifications',
        'message': message
    }

    if room_id:
        response['room_id'] = room_id

    if sender_id:
        response['sender_id'] = sender_id

    async_to_sync(channel_layer.group_send)('notifications', response)
