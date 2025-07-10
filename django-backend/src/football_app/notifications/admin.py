from django.contrib import admin
from .models import Notification

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('sender', 'receiver', 'notification_type', 'created_at')
    list_filter = ('notification_type', 'created_at')
    search_fields = ('sender__username', 'receiver__username')
