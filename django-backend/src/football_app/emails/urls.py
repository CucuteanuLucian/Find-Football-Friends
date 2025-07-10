from django.urls import path
from .views import forgot_password, reset_password_confirm

urlpatterns = [
    path('forgot-password/', forgot_password, name='forgot-password'),
    path('reset-password-confirm/', reset_password_confirm, name='reset-password-confirm'),
]