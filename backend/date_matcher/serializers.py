from rest_framework import serializers

from backend.accounts.serializers import UserProfileSerializer
from backend.date_matcher.models import Event, TimeSlot


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        exclude = ('calculated_date', )


class TimeSlotSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer()

    class Meta:
        model = TimeSlot
        exclude = ('event', )
