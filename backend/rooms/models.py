# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.db.models.deletion import CASCADE

from backend.accounts.models import UserProfile
from backend.date_matcher.models import Event


class Message(models.Model):
    text = models.TextField()
    creator = models.ForeignKey(UserProfile, null=True, on_delete=CASCADE)

    def __str__(self):
        return self.text[0:20]


class Room(models.Model):
    name = models.CharField(max_length=200)
    active_users = models.ManyToManyField(UserProfile, blank=True, related_name='active_users')
    members = models.ManyToManyField(UserProfile, blank=True, related_name='members')
    admins = models.ManyToManyField(UserProfile, blank=True, related_name='admins')
    creator = models.ForeignKey(UserProfile, null=True, on_delete=CASCADE, related_name='creator', blank=True)
    event = models.OneToOneField(Event, null=True, on_delete=CASCADE)
    messages = models.ManyToManyField(Message, blank=True)

    def __str__(self):
        return self.name
