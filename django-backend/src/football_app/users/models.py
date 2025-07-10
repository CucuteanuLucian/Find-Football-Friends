from django.db import models
from django.contrib.auth.models import User
import os



def user_profile_picture_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"{instance.user.username}.{ext}"
    return os.path.join('profile_pics', filename)

# model ce extinde User-ul din Django pentru a salva mai multe detalii despre utilizator
class MyUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100, blank=True, null=True)
    team_name = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(max_length=200, blank=True)
    profile_picture = models.ImageField(upload_to=user_profile_picture_path, blank=True, null=True)
    max_distance = models.IntegerField(default=100)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.TextField(max_length=10, blank=True, null=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    theme = models.CharField(max_length=5, default='light')

    def __str__(self):
        return self.user.username
