import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.contrib.auth.models import User

from backend.accounts.models import UserProfile
from backend.accounts.serializers import UserProfileSerializer
from backend.date_matcher.calculate import calculate_date
from backend.date_matcher.models import TimeSlot
from backend.date_matcher.serializers import EventSerializer, TimeSlotSerializer
from backend.rooms.models import Room, Message
from backend.rooms.serializers import RoomSerializer
from backend.rooms.views import send_notification


class WebSocketConsumer(WebsocketConsumer):
    groups = ('notifications', 'rooms', 'event', 'report', 'users')

    def connect(self):
        self.add_groups()
        self.accept()

    def disconnect(self, close_code):
        self.remove_groups()
        pass

    def receive(self, **kwargs):
        data = json.loads(kwargs['text_data'])
        self.send_message(data)

    def add_groups(self):
        for group in self.groups:
            async_to_sync(self.channel_layer.group_add)(group, self.channel_name)

    def remove_groups(self):
        for group in self.groups:
            async_to_sync(self.channel_layer.group_discard)(group, self.channel_name)

    def send_to_client(self, data):
        self.send(text_data=json.dumps(data))

    def get_data(self, client_data):
        channel = client_data['channel']
        return self.commands[channel](self, client_data)

    # Receive message from room group
    def send_message(self, event):
        data = self.get_data(event)
        response = {'data': data, 'channel': event['channel']}

        if 'message' in event:
            response['message'] = event['message']

        if 'room_id' in event:
            response['room_id'] = event['room_id']

        self.send_to_client(response)

    def post_message(self, event):
        user = self.scope['user']
        text = event['text']
        room_id = event['room_id']

        if text and len(text) > 0 and user:
            message = Message.objects.create(text=text, creator=UserProfile.objects.get(user=user))
            room = Room.objects.get(id=room_id)
            room.messages.add(message)
            room.save()
            send_notification('{} says: {}'.format(user.username, text), room.id, user.id)
            self.send_updated_rooms(room.id)

    # Handlers
    def rooms(self, event):
        rooms = Room.objects.filter(members__pk=self.scope['user'].id)
        return RoomSerializer(rooms, many=True).data

    def notifications(self, event):
        return json.dumps(event)

    def join_room(self, event):
        self.user_entrance(event['room_id'], 1)
        self.send_updated_rooms(event['room_id'])

    def leave_room(self, event):
        self.user_entrance(event['room_id'], 0)
        self.send_updated_rooms(event['room_id'])

    def user_entrance(self, room_id, add_or_remove):
        try:
            room = Room.objects.get(id=room_id)
            user = UserProfile.objects.get(user=self.scope['user'])

            if add_or_remove == 1:
                room.active_users.add(user)
            if add_or_remove == 0:
                room.active_users.remove(user)

        except Room.DoesNotExist:
            return 'room does not exist'

    def post_time_slot(self, event):
        time_slot = event['time_slot']
        user = UserProfile.objects.get(id=event['user_id'])
        room = Room.objects.get(id=event['room_id'])

        TimeSlot.objects.create(
            start_time=time_slot['start_time'],
            user=user,
            event=room.event
        )

        send_notification('{} submitted new available time slot'.format(
            User.objects.get(id=event['user_id']).username), room.id, user.id
        )

        self.send_updated_report(room.id)
        self.send_updated_event(room.id)

        return '{} submitted new available time slot'.format(user.full_name)

    def get_event(self, event):
        room = Room.objects.get(id=event['room_id'])
        time_slots = room.event.time_slots.all()
        return {"event": EventSerializer(room.event).data, "time_slots": TimeSlotSerializer(time_slots, many=True).data}

    def get_report(self, event):
        room = Room.objects.get(id=event['room_id'])
        return calculate_date(room.event.time_slots.all(), event)

    def get_users(self, event):
        return UserProfileSerializer(UserProfile.objects.all(), many=True).data

    def send_updated_event(self, room_id=None):
        async_to_sync(self.channel_layer.group_send)('event', {
            'type': 'send.message',
            'room_id': room_id,
            'channel': 'event',
        })

    def send_updated_rooms(self, room_id=None):
        async_to_sync(self.channel_layer.group_send)('rooms', {
            'type': 'send.message',
            'room_id': room_id,
            'channel': 'rooms',
        })

    def send_updated_report(self, room_id=None):
        async_to_sync(self.channel_layer.group_send)('report', {
            'type': 'send.message',
            'room_id': room_id,
            'channel': 'report',
        })

    commands = {
        'rooms': rooms,
        'notifications': notifications,
        'join_room': join_room,
        'leave_room': leave_room,
        'post_message': post_message,
        'post_time_slot': post_time_slot,
        'event': get_event,
        'report': get_report,
        'users': get_users
    }
