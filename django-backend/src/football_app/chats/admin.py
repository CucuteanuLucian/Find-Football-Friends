from django.contrib import admin
from .models import Message


# Register your models here.

# Modelul Message inregistrat in pagina Django admin
@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'receiver', 'timestamp', 'content', 'is_read')
    search_fields = ('sender__username', 'receiver__username', 'timestamp')
    list_filter = ('timestamp',)


