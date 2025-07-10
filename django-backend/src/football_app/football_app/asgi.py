import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack  # Middleware pentru autentificare
from chats.routing import websocket_urlpatterns

# setarea variabilei de medeiu si rutele pentru ASGI

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'football_app.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})
