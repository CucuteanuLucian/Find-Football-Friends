from .views import create_message, get_messages
from django.urls import path

# endpoint-uri url pentru crea (adauga in baza de date) mesaje si pentru a le obtine

urlpatterns = [
    path('create-message/', create_message, name='create_message'),
    path('get-messages/<str:sender_username>/<str:receiver_username>/', get_messages, name='get_messages')
]
