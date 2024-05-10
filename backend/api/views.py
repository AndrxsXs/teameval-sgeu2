from django.shortcuts import render, redirect
# from django.contrib.auth.models import User
from .models import User, Teacher
from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import UserSerializer, StudentSerializer, TeacherSerializer, AdminSerializer
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

# creacion de un estudiante
# student creation
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def register_student(request):
    # creacion del usuario
    # user creation
    data = request.data
    
    user_data = {
        'role': User.STUDENT,
        'code': data.get('code'),
        'name': data.get('name'),
        'last_name': data.get('last_name'),
        'email': data.get('email'),
        'password': User.default_password(data.get('name'), data.get('code'), data.get('last_name')),
    }
    # creacion del estudiante
    # student creation
    user = User.objects.create_user(**user_data)
    student_data = {
        'user': user.id,
        'group': None,
    }
    serializer_student = StudentSerializer(data=student_data)
    if serializer_student.is_valid():
        serializer_student.save()
        return Response(serializer_student.data, status=status.HTTP_201_CREATED)
    return Response(serializer_student.errors, status=status.HTTP_400_BAD_REQUEST)

# creacion de un profesor
# teacher creation
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def register_teacher(request):
    # creacion del usuario
    # user creation
    data = request.data
    user_data = {
        'role': User.TEACHER,
        'code': data.get('code'),
        'name': data.get('name'),
        'last_name': data.get('last_name'),
        'email': data.get('email'),
        'password': User.default_password(data.get('name'), data.get('code'), data.get('last_name')),
    }
    # creacion del profesor
    # teacher creation
    user = User.objects.create_user(**user_data)
    teacher_data = {
        'user': user.id,
        'phone': data.get('phone'),        
    }
    serializer_teacher = TeacherSerializer(data=teacher_data)
    if serializer_teacher.is_valid():
        # cambia el estado del profesor a activo la logica fue implementada en serializers.py
        serializer_teacher.save()
        return Response(serializer_teacher.data, status=status.HTTP_201_CREATED)
    return Response(serializer_teacher.errors, status=status.HTTP_400_BAD_REQUEST)

# creacion de un admin
# admin creation
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def register_admin(request):
    # creacion del usuario
    # user creation
    data = request.data
    user_data = {
        'role': User.ADMIN,
        'code': data.get('code'),
        'name': data.get('name'),
        'last_name': data.get('last_name'),
        'email': data.get('email'),
        'password': User.default_password(data.get('name'), data.get('code'), data.get('last_name')),
    }
    # creacion del admin
    # admin creation
    user = User.objects.create_user(**user_data)
    admin_data = {
        'user': user.id,
        'phone': data.get('phone'),        
    }
    serializer_admin = AdminSerializer(data=admin_data)
    if serializer_admin.is_valid():
        # cambia el estado del admin a activo la logica fue implementada en serializers.py
        serializer_admin.save()
        return Response(serializer_admin.data, status=status.HTTP_201_CREATED)
    return Response(serializer_admin.errors, status=status.HTTP_400_BAD_REQUEST)
    




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
        'role': role,
        'name': user.name,
        'last_name': user.last_name
    }
    return Response(data)

def home(request):
    return render(request, 'home.html')

def cursos(request):
    return render(request, 'cursos.html')