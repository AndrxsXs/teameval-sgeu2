from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from . import models

# Create your views here.

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
            if user.first_login == False:
                if user.password == request.POST['password']:
                    return redirect('home')
                else:
                    return render(request, 'singin.html', {
                    'error': 'User or password incorrect'
            }) 
            else:
                if user.password == request.POST['password']:
                    return redirect('estudiante')

                    

def estudiante(request):
    if request.method == 'GET':
        return render(request, 'estudiante')
    else:
        if request.POST['password1'] == request.POST['password2']:
             
            print("correto")
            
            code= request.session['code']
            
            models.User.update_password(request.POST['password1'],code)
            
            return render(request, 'home', {
                'message' : 'Password created successfully'
            })
            
        else:
            print("incorrecto")
            return render(request, 'singin.html', {
                'error' : 'Passwords incorret'
            })


            
def home(request):
    return render(request, 'home.html')

def estudiante(request):
    return render(request, 'estudiante.html')