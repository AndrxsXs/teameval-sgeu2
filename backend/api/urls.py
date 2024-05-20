from django.urls import path
from .import views

urlpatterns = [
    # path('singin/', views.singin, name='singin'),
    # path('admin/', views.admin, name='admin'),
    path('change_password/', views.change_password, name='change_password'),    
    path('user_data/', views.user_data, name='user_data'),
    path('register_student/', views.register_student, name='register_student'),
    path('register_teacher/', views.register_teacher, name='register_teacher'),
    path('register_admin/', views.register_admin, name='register_admin'),
    path('user_list/', views.user_list, name='user_list'),
    path('course_list/', views.course_list, name='course_list'),
    path('create_course/', views.create_course, name='create_course'),
    path('import_student/', views.import_student, name='import_student'),
    path('import_teacher/', views.import_teacher, name='import_teacher'),
]
