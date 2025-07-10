from django.contrib import admin

# Register your models here.

from .models import Team

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'logo')
    search_fields = ('name',)
    list_filter = ('name',)

    def has_add_permission(self, request):
        return False