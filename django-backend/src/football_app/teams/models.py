from django.db import models

# Create your models here.

from django.db import models

class Team(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    logo = models.URLField()

    def __str__(self):
        return self.name
