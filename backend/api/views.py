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

def singin (request):
    if request.method == 'GET':
        return render(request, 'singin.html')
    else:        
        user= models.User.search(request.POST['code'])
        if user is None:
            return render(request, 'singin.html', {
                'error': 'User or password incorrect'
            })
        else:
            if user.rol == 'Admin':
                if user.password == request.POST['password']:
                    return redirect('/admin')
                else:
                    return render(request, 'singin', {
                'error': 'User or password incorrect'
            })
            else:                
                if user.first_login == False:
                    if user.password == request.POST['password']:                        
                        if user.rol == 'Estudiante':
                            return redirect('home')
                        else:
                            return redirect('cursos')
                            
                    else:
                        return render(request, 'singin.html', {
                        "error": 'User or password incorrect'
                    }) 
                else:
                    if user.password == request.POST['password']:
                        request.session['code'] = user.code
                        return redirect('estudiante')
                    else:
                        return render(request, 'singin.html', {
                    'error': 'User or password incorrect'
                })

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Añade el rol del usuario al payload del token
        token['role'] = user.role

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
        return Response({'role': user.groups.first().name})
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

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

def estudiante(request):
    if request.method == 'GET':
        return render(request, 'estudiante.html')
    else:
        if request.POST['password1'] == request.POST['password2']:
            user_id= request.session['code']
            print(user_id)
            models.User.update_password(request.POST['password1'],user_id)
            print("correcto")            
            return redirect('singin')
        else:
            print("incorrecto")
            return render(request, 'estudiante', {
                'error' : 'Passwords incorret'
            })

def home(request):
    return render(request, 'home.html')

def cursos(request):
    return render(request, 'cursos.html')