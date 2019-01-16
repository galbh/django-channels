from .models import UserProfile
from django.contrib import admin


class UserAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'id']


admin.site.register(UserProfile, UserAdmin)
