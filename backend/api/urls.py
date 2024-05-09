from django.urls import path
from .import views

urlpatterns = [
    # path('singin/', views.singin, name='singin'),
    # path('admin/', views.admin, name='admin'),
    path('change_password/', views.change_password, name='change_password'),    
    path('user_data/', views.user_data, name='user_data'),
    path('register_student/', views.register_student, name='register_student'),
]
