# teams/urls.py
from django.urls import path
from .views import create_team, search_teams, get_team_photo_by_name

urlpatterns = [
    path('teams/', search_teams, name='sync_teams'),
    path('create-team/', create_team, name='team_create'),
    path('get-team-photo/<str:team_name>/', get_team_photo_by_name, name='get_team_photo_by_name'),
]
