from django.conf.urls import url

from backend.date_matcher.views import EventsView, TimeSlotsView, TimeSlotView, EventView

urlpatterns = [
    url(r'^$', view=EventsView.as_view()),
    url(r'^(?P<pk>[0-9]+)/$', view=EventView.as_view()),
    url(r'^(?P<event_id>[0-9]+)/time-slot$', view=TimeSlotsView.as_view()),
    url(r'^(?P<event_id>[0-9]+)/time-slot/(?P<time_slot_id>[0-9]+)/$', view=TimeSlotView.as_view()),
]
