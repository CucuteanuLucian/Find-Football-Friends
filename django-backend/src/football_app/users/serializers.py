from django.contrib.auth.models import User
from rest_framework import serializers
from .models import MyUser

# serializer care primeste detalii si creeaza un obiect de tip User (pentru credentiale)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

# serializer care primeste detalii despre utilizator si creeaza un obiect de tip MyUser (cel care pastreaza detaliile despre utilizator)
class UserDetailsSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    distance = serializers.SerializerMethodField()
    class Meta:
        model = MyUser
        fields = ['username', 'name', 'description', 'profile_picture', 'max_distance', 'date_of_birth', 'gender', 'latitude', 'longitude', 'theme', 'team_name', 'distance']

    def get_distance(self, obj):
        return round(getattr(obj, 'distance', 0))