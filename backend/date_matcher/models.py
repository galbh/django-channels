# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from datetime import datetime, timedelta

from django.db import models
from django.db.models.deletion import CASCADE

from backend.accounts.models import UserProfile


class Event(models.Model):
    calculated_date = models.DateTimeField(null=True)
    duration = models.IntegerField(default=60)
    min_date = models.DateTimeField(null=True, default=datetime.now())
    max_date = models.DateTimeField(null=True, default=datetime.now() + timedelta(days=7))
    address = models.CharField(max_length=200, blank=True)
    description = models.TextField(null=True, blank=True, default='')

    def __str__(self):
        if self.description:
            return self.description[0:20]
        else:
            return 'New Event'


class TimeSlot(models.Model):
    start_time = models.DateTimeField()
    user = models.ForeignKey(UserProfile, blank=True, on_delete=CASCADE)
    event = models.ForeignKey(Event, null=True, on_delete=CASCADE, related_name='time_slots')

    def __str__(self):
        return self.user.full_name


