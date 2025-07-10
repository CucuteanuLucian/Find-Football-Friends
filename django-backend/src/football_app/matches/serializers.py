from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Swipe, Match

# serializam obiectul primit de la frontend si il transformam intr-un obiect de tip Swipe
class SwipeSerializer(serializers.ModelSerializer):
    user_from = serializers.CharField()
    user_to = serializers.CharField()

    class Meta:
        model = Swipe
        fields = ['user_from', 'user_to', 'swipe_type']

    def create(self, validated_data):
        username_from = validated_data.pop('user_from')
        username_to = validated_data.pop('user_to')

        try:
            user_from = User.objects.get(username=username_from)
            user_to = User.objects.get(username=username_to)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found.")

        swipe = Swipe.objects.create(
            user_from=user_from,
            user_to=user_to,
            **validated_data
        )
        return swipe


class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = '__all__'

