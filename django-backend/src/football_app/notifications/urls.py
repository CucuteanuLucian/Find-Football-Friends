from django.urls import path
from .views import get_user_notifications_by_username, create_notification, delete_notification, delete_all_notifications

urlpatterns = [
    path('create-notification/', create_notification, name='create-notification'),
    path('get-notifications-for/<str:username>/', get_user_notifications_by_username, name='get-user-notifications-by-username'),
    path('delete-notification/<int:notification_id>/', delete_notification, name='delete-notification'),
    path('delete-all-notifications/<str:username>/', delete_all_notifications, name='delete-all-notifications')
]
