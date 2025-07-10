from django.contrib import admin
from .models import Swipe, Match
# Register your models here.

# model in Django Admin pentru Swipes, ca sa fie vzibile detaliile din baza de date in admin
@admin.register(Swipe)
class SwipeAdmin(admin.ModelAdmin):
    list_display = ('user_from', 'user_to', 'swipe_type')
    search_fields = ('user_from__username', 'user_to__username', 'swipe_type')
    list_filter = ('swipe_type',)

# model in Django Admin pentru Matches, ca sa fie vzibile detaliile din baza de date in admin
@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ('user1', 'user2', 'created_at', 'room_id')
    search_fields = ('user1__username', 'user2__username')
    list_filter = ('created_at',)
    ordering = ('-created_at',)
