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