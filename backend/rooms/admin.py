# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

# Register your models here.
from backend.rooms.models import Room, Message

admin.site.register(Room)
admin.site.register(Message)
