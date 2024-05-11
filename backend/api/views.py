from django.shortcuts import render, redirect
# from django.contrib.auth.models import User
from .models import User
from . import models
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def main_teacher(request):
    user= request.user
    data= models.Course.objects.filter(teacher_id= user.id, course_status= 1).values_list('name')
    if data is None:
        return Response({'status': 'non-associated courses'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return data
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def search_teacher(request):
    
    name= request.data.get('seeker')
        
    data= models.User.objects.filter(name__icontains= name, last_name__icontains= name) 
    
    if data is None:
        return Response({'error': 'no matches'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return data
                       

# Vista para hacer pruebas backend
def singin(request):
    if request.method == 'GET':
        return render(request, 'singin.html')
    else:
        user= authenticate(request, code= request.POST['code'], password= request.POST['password'])
        
        if user is None:
            return render(request, 'singin.html')
        
        else:
            login(request,user)
            return redirect(home)
     

def home(request):
    return render(request, 'home.html')

def cursos(request):
    return render(request, 'cursos.html')