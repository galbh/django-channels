# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from rest_framework import generics, mixins
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_201_CREATED, HTTP_404_NOT_FOUND

from backend.accounts.models import UserProfile
from backend.date_matcher.models import Event, TimeSlot
from backend.date_matcher.serializers import EventSerializer, TimeSlotSerializer


class EventsView(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def get(self, request, *args, **kwargs):
        """
        Get a list of all events
        """
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        """
        Create an event
        """
        start_date = request.data.get('start_date')
        address = request.data.get('address')
        description = request.data.get('description')
        duration = request.data.get('duration')

        if start_date:
            event = Event(start_date=start_date)

            if description:
                event.description = description

            if address:
                event.address = address

            if duration:
                event.duration = duration

            event.save()

            return Response('success', status=HTTP_200_OK)
        else:
            return Response('all parameters are required', status=HTTP_400_BAD_REQUEST)


class EventView(mixins.DestroyModelMixin, mixins.RetrieveModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):

    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def get(self, request, *args, **kwargs):
        """
        Get event by id
        """
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        """
        Update event
        """
        return Response('event updated successfully')

    def delete(self, request, *args, **kwargs):
        """
        Delete event
        """
        return self.destroy(self, request, *args, **kwargs)


class TimeSlotsView(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
    queryset = TimeSlot.objects.all()
    serializer_class = TimeSlotSerializer

    def get(self, request, *args, **kwargs):
        """
        Get a list of all time slots for an event
        """
        try:
            event = Event.objects.get(id=kwargs['event_id'])
            try:
                return self.list(event.time_slots.all())
            except TimeSlot.DoesNotExist:
                return Response('time slot does not exist', status=HTTP_404_NOT_FOUND)

        except Event.DoesNotExist:
            return Response('event does not exist', status=HTTP_404_NOT_FOUND)

    def post(self, request, *args, **kwargs):
        """
        Create a new time slot
        """
        user_id = request.data.get('user')
        start_time = request.data.get('start_time')

        try:
            event = Event.objects.get(id=kwargs['event_id'])
        except Event.DoesNotExist:
            return Response('event does not exist', status=HTTP_404_NOT_FOUND)

        try:
            user = UserProfile.objects.get(id=user_id)
            if start_time and user:
                time_slot = TimeSlot.objects.create(start_time=start_time, user=user, event=event)
                return Response(TimeSlotSerializer(time_slot).data, status=HTTP_201_CREATED)
            else:
                return Response('all params are required', status=HTTP_400_BAD_REQUEST)

        except UserProfile.DoesNotExist:
            return Response('user does not exists', status=HTTP_404_NOT_FOUND)


class TimeSlotView(generics.RetrieveAPIView):

    queryset = TimeSlot.objects.all()
    serializer_class = TimeSlotSerializer

    def get(self, request, *args, **kwargs):
        """
        Get time slot by id
        """
        time_slot = TimeSlot.objects.get(id=kwargs['time_slot_id'])
        return Response(TimeSlotSerializer(time_slot).data)

    def put(self, request, *args, **kwargs):
        """
        Update a time slot
        """
        try:
            start_time = request.data.get('start_time')
            user_id = request.data.get('user')
            time_slot_id = kwargs['time_slot_id']
            time_slot = TimeSlot.objects.get(id=time_slot_id)

            if start_time:
                time_slot.start_time = start_time

            if user_id:
                try:
                    time_slot.user = UserProfile.objects.get(id=user_id)
                except UserProfile.DoesNotExist:
                    return Response('user does not exists', status=HTTP_404_NOT_FOUND)

            time_slot.save()

            return Response(TimeSlotSerializer(time_slot).data, status=HTTP_200_OK)
        except TimeSlot.DoesNotExist:
            return Response('time slot does not exists', status=HTTP_404_NOT_FOUND)

    def delete(self, request, *args, **kwargs):
        """
        Delete a time slot
        """
        try:
            time_slot = TimeSlot.objects.get(id=kwargs['time_slot_id'])
            time_slot.delete()

            async_to_sync(get_channel_layer().group_send)('report', {
                'type': 'send.message',
                'room_id': time_slot.event.room.id,
                'channel': 'report',
            })

            return Response('time slot deleted', status=HTTP_200_OK)
        except TimeSlot.DoesNotExist:
            return Response('time slot does not exists', status=HTTP_404_NOT_FOUND)