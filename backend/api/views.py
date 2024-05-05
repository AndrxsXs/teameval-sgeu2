from django.shortcuts import render, redirect
# from django.contrib.auth.models import User
from .models import User
from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import authenticate, login
from . import models
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

# Create your views here.

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Añade el rol del usuario al payload del token
        token['role'] = user.role
        token['first_login'] = user.first_login

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['POST'])
def login_view(request):
    code = request.data.get('code')
    password = request.data.get('password')
    user = authenticate(request, code=code, password=password)
    if user:
        login(request, user)
        return Response({'role': user.groups.first().name, 'first_login': user.first_login})
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    password = request.data.get('password')
    if password is None:
        return Response({'error': 'Password not provided'}, status=status.HTTP_400_BAD_REQUEST)

    user = request.user
    user.set_password(password)
    user.first_login = False
    user.save()
    return Response({'status': 'Password changed successfully', 'first_login': user.first_login})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_data(request):
    user = request.user
    role = user.groups.first().name
    data = {
        'username': user.username,
        'email': user.email,
        'role': role
    }
    return Response(data)

def home(request):
    return render(request, 'home.html')

def cursos(request):
    return render(request, 'cursos.html')