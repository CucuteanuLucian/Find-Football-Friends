from django.contrib.auth.models import User
from rest_framework import generics, viewsets, status

from .serializers import UserSerializer, UserDetailsSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import MyUser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models.signals import post_save
from django.dispatch import receiver
from haversine import haversine, Unit
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import parser_classes
import os

# cand creem un utilizator, un cont, ne creeaza automat si un profil gol, un obiect User creeaza si un obiect MyUser
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        MyUser.objects.create(user=instance)


def save_user_profile(sender, instance, **kwargs):
    try:
        profile = instance.myuser
    except MyUser.DoesNotExist:
        profile = MyUser.objects.create(user=instance)
    profile.save()

# luam detaliile unui utilizator dupa username
@api_view(['GET'])
@permission_classes([AllowAny])
def get_user_details(request, username):
    try:
        user_profile = MyUser.objects.get(user__username=username)
    except MyUser.DoesNotExist:
        return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    serializer = UserDetailsSerializer(user_profile)
    return Response(serializer.data)

# returnam toti utilizatorii care nu sunt in lista de swipe si care sunt in proximitate (distanta este sub max_distance)
@api_view(['GET'])
@permission_classes([AllowAny])
def get_all_users(request, username):
    from matches.views import get_swipes
    try:
        main_user = MyUser.objects.get(user__username=username)
        swiped_users_response = get_swipes(request._request, username)

        swiped_users_data = swiped_users_response.data
        swiped_usernames = [swipe["user_to"] for swipe in swiped_users_data]

        start_point = (main_user.latitude, main_user.longitude)
        users = MyUser.objects.all()
    except MyUser.DoesNotExist:
        return Response({"detail": "No users found."}, status=status.HTTP_404_NOT_FOUND)

    close_users = []
    for user in users:
        if user.user.username != username and user.user.username not in swiped_usernames:     
            if user.latitude is not None and user.longitude is not None:
                end_point = (user.latitude, user.longitude)
                distance = haversine(start_point, end_point, unit=Unit.KILOMETERS)
                if distance < main_user.max_distance:
                    user.distance = distance
                    close_users.append(user)

    serializer = UserDetailsSerializer(close_users, many=True)
    return Response(serializer.data)


# functie de update profile pentru utilizator
@api_view(['PATCH'])
@permission_classes([AllowAny])
def update_user_profile(request, username):
    try:
        user_profile = MyUser.objects.get(user__username=username)
    except MyUser.DoesNotExist:
        return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    serializer = UserDetailsSerializer(user_profile, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def upload_profile_picture(request, username):
    try:
        user = User.objects.get(username=username)
        my_user = user.myuser

        if "profile_picture" in request.FILES:
            new_file = request.FILES["profile_picture"]

            if my_user.profile_picture and os.path.isfile(my_user.profile_picture.path):
                os.remove(my_user.profile_picture.path)

            my_user.profile_picture = new_file
            my_user.save()

            return Response(
                {"profile_picture": my_user.profile_picture.url},
                status=status.HTTP_200_OK,
            )
        return Response({"error": "No file uploaded."}, status=status.HTTP_400_BAD_REQUEST)

    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

