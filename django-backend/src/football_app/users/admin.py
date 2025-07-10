from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from .models import MyUser


# inregistram modelul MyUser pentru a putea fi folosit in admin
class MyUserInline(admin.StackedInline):
    model = MyUser
    can_delete = False
    verbose_name_plural = 'User Profile'


class CustomUserAdmin(UserAdmin):
    inlines = (MyUserInline,)

admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)

admin.site.register(MyUser)
