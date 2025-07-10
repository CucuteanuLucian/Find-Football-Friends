from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# Create your models here.

class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('message', 'Message'),
        ('match', 'Match'),
    ]

    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_notifications')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_notifications')
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)

