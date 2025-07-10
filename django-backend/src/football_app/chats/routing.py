from django.urls import path
from chats.consumers import ChatConsumer

# ruta pentru websocket (roomid cu uuid unic)
websocket_urlpatterns = [
    path('ws/chat/<str:room_name>/', ChatConsumer.as_asgi()),
]
