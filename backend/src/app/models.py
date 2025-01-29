from django.contrib.auth.models import User
from django.db import models


class Player(models.Model):
    user = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    color = models.CharField(max_length=100)
    group_id = models.CharField(max_length=50, null=True)
    is_ready = models.BooleanField(default=False)
    is_winner = models.BooleanField(default=False)
    
    def is_available(self):
        return self.is_ready and not self.group_id 
    


class GroupStatus(models.IntegerChoices):
    WAITING = 1, 'Waiting'
    PLAYING = 2, 'Playing'
    FINISHED = 3, 'Finished'
class Group(models.Model):
    players = models.ManyToManyField(Player)
    status = models.CharField(max_length=50, blank=True, null=True)
    status = models.IntegerField(choices=GroupStatus.choices, default=GroupStatus.WAITING)
    