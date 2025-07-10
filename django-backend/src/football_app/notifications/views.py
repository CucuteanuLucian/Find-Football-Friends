from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Notification
from .serializers import NotificationSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def get_user_notifications_by_username(request, username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    notifications = Notification.objects.filter(receiver=user).order_by('-created_at')
    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def create_notification(request):
    data = request.data
    sender_username = data.get('sender')
    receiver_username = data.get('receiver')
    notification_type = data.get('notification_type')

    if not sender_username or not receiver_username or not notification_type:
        return Response({"error": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        sender = User.objects.get(username=sender_username)
        receiver = User.objects.get(username=receiver_username)
    except User.DoesNotExist:
        return Response({"error": "Sender or receiver does not exist."}, status=status.HTTP_404_NOT_FOUND)

    notification = Notification.objects.create(
        sender=sender,
        receiver=receiver,
        notification_type=notification_type
    )
    serializer = NotificationSerializer(notification)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_notification(request, notification_id):
    try:
        notification = Notification.objects.get(id=notification_id)
    except Notification.DoesNotExist:
        return Response({"error": "Notification not found."}, status=status.HTTP_404_NOT_FOUND)

    notification.delete()
    return Response({"message": "Notification deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_all_notifications(request, username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    notifications = Notification.objects.filter(receiver=user)
    notifications.delete()
    return Response({"message": "All notifications deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
