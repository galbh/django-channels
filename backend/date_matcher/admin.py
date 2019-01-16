# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

# Register your models here.
from backend.date_matcher.models import Event, TimeSlot

admin.site.register(Event)
admin.site.register(TimeSlot)
