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
                if user.first_login == False:
                    if user.password == request.POST['password']:                        
                        request.session['user_id'] = user.id
                        if user.rol == 'Estudiante':
                            return redirect('home')
                        else:
                            return redirect('cursos')
                            
                    else:
                        return render(request, 'singin.html', {
                        'error': 'User or password incorrect'
                    }) 
                else:
                    if user.password == request.POST['password']:
                        request.session['user_id'] = user.id
                        return redirect('estudiante')



       

def estudiante(request):
    if request.method == 'GET':
        return render(request, 'estudiante.html')
    else:
        if request.POST['password1'] == request.POST['password2']:
            user_id = request.session.get('user_id')
            if user_id is not None: 
                user = models.User.objects.get(id=user_id)     
                models.User.update_password(request.POST['password1'],user.code)
            print("correcto")            
            return render(request, 'singin.html', {
                'message' : 'Password created successfully'
            })
            

        else:
            print("incorrecto")
            return render(request, 'home.html', {
                'error' : 'Passwords incorret'
            })


            
def home(request):
    return render(request, 'home.html')

def cursos(request):
    return render(request, 'cursos.html')

def estudiante3(request):
    return render(request, 'estudiante.html')

def estudiante4(request):
    if request.method == 'GET':
        return render(request, 'estudiante.html')
    else:
        user= models.User.search(request.POST['code'])
        if request.POST['password1'] == request['password2']:
            print("correcto")

            user.password = request.POST['password1']
            user.first_login = False
            user.save
        return render(request, 'estudiante', {
        'mesagge' : 'Password created successfully'
        })    