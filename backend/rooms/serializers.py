from rest_framework import serializers

from backend.accounts.serializers import UserProfileSerializer
from backend.date_matcher.serializers import EventSerializer
from backend.rooms.models import Room, Message


class MessageSerializer(serializers.ModelSerializer):

    creator = UserProfileSerializer()

    class Meta:
        model = Message
        fields = '__all__'


class RoomSerializer(serializers.ModelSerializer):
    active_users = UserProfileSerializer(many=True)
    admins = UserProfileSerializer(many=True)
    creator = UserProfileSerializer()
    members = UserProfileSerializer(many=True)
    messages = MessageSerializer(many=True)
    event = EventSerializer()

    class Meta:
        model = Room
        fields = '__all__'
