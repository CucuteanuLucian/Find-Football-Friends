import uuid

from django.db import models
from django.contrib.auth.models import User

# model Swipe ce contine detaliile unui Swipe
class Swipe(models.Model):
    user_from = models.ForeignKey(User, related_name='swipes_made', on_delete=models.CASCADE)
    user_to = models.ForeignKey(User, related_name='swipes_received', on_delete=models.CASCADE)
    swipe_type = models.CharField(max_length=10, null=True)

    class Meta:
        unique_together = ('user_from', 'user_to')

# model Match ce contine detaliile unui Match
class Match(models.Model):
    user1 = models.ForeignKey(User, related_name='matches_initiated', on_delete=models.CASCADE)
    user2 = models.ForeignKey(User, related_name='matches_received', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    room_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    class Meta:
        unique_together = ('user1', 'user2')
