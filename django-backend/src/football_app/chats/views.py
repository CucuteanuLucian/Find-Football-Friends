from django.contrib.auth.models import User
from django.db.models import Q
from django.shortcuts import render, redirect
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
from .models import Message

# Create your views here.

# functie ce construieste un mesaj cu datele obtinute din request (din frontend)
@api_view(['POST'])
@permission_classes([AllowAny])
def create_message(request):
    data = request.data
    sender_username = data.get('sender')
    receiver_username = data.get('receiver')
    content = data.get('content')
    if not sender_username or not receiver_username or not content:
        return Response({"error": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)
    try:
        sender = User.objects.get(username=sender_username)
        receiver = User.objects.get(username=receiver_username)
    except User.DoesNotExist:
        return Response({"error": "Sender or receiver does not exist."}, status=status.HTTP_404_NOT_FOUND)
    message = Message.objects.create(
        sender=sender,
        receiver=receiver,
        content=content
    )

    return Response({
        "sender": sender.username,
        "receiver": receiver.username,
        "content": message.content,
        "timestamp": message.timestamp
    }, status=status.HTTP_201_CREATED)

# functie ce returneaza mesajele dintre 2 utilizatori ( aici se face si analiza de sentiment cu modelul NLP )
@api_view(['GET'])
@permission_classes([AllowAny])
def get_messages(request, sender_username, receiver_username):
    try:
        model_name = "clapAI/modernBERT-base-multilingual-sentiment"
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForSequenceClassification.from_pretrained(model_name)
        sentiment_pipeline = pipeline("sentiment-analysis", model=model, tokenizer=tokenizer, device=-1)
        sender = User.objects.get(username=sender_username)
        receiver = User.objects.get(username=receiver_username)
    except User.DoesNotExist:
        return Response({"error": "Sender or receiver does not exist."}, status=status.HTTP_404_NOT_FOUND)
    messages = Message.objects.filter(
        Q(sender=sender, receiver=receiver) | Q(sender=receiver, receiver=sender)
    ).order_by('timestamp')
    message_list = []
    for message in messages:
        message_list.append({
            "sender": message.sender.username,
            "receiver": message.receiver.username,
            "content": message.content,
            "timestamp": message.timestamp,
            "is_read": message.is_read
        })
    last_10_messages = messages.order_by("-timestamp")[:10]
    message_list_for_sentiment_analysis = "\n".join(
        message.content for message in last_10_messages
    )
    sentiment = sentiment_pipeline(message_list_for_sentiment_analysis)[0]
    message_list.append({
        "message:": message_list_for_sentiment_analysis,
        "sentiment": sentiment
    })
    return Response(message_list, status=status.HTTP_200_OK)
