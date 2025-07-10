from django.shortcuts import render

from django.contrib.auth.models import User
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes

from .emails import send_reset_password_email
import json
from rest_framework.permissions import AllowAny

@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def forgot_password(request):

    data = json.loads(request.body)
    email = data.get('email')

    try:
        user = User.objects.get(username=email)
    except User.DoesNotExist:
        return JsonResponse({'message': 'Emailul nu există'}, status=404)

    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)

    reset_link = f'http://localhost:3000/reset-password/{uid}/{token}'
    send_reset_password_email(email, reset_link)
    return JsonResponse({'message': 'Email trimis cu succes'}, status=202)


@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def reset_password_confirm(request):
    data = json.loads(request.body)
    uidb64 = data.get('uid')
    token = data.get('token')
    new_password = data.get('new_password')
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except Exception:
        return JsonResponse({'error': 'Link invalid'}, status=400)

    if not default_token_generator.check_token(user, token):
        return JsonResponse({'error': 'Token invalid sau expirat'}, status=400)

    user.set_password(new_password)
    user.save()
    return JsonResponse({'message': 'Parola resetata succ'})


