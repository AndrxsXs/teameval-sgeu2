from django.urls import path
from .import views

urlpatterns = [
    # path('singin/', views.singin, name='singin'),
    # path('admin/', views.admin, name='admin'),
    path('change_password/', views.change_password, name='change_password'),    
    path('user_data/', views.user_data, name='user_data'),
    #path('register_student/', views.register_student, name='register_student'),
    path('register_teacher/', views.register_teacher, name='register_teacher'),
    path('register_admin/', views.register_admin, name='register_admin'),
    path('user_list/', views.user_list, name='user_list'),
    path('course_list/', views.course_list, name='course_list'),
    path('create_course/', views.create_course, name='create_course'),
    path('import_student/', views.import_student, name='import_student'),
    path('import_teacher/', views.import_teacher, name='import_teacher'),
    path('teacher-rubrics/', views.get_teacher_rubrics, name='get_teacher_rubrics'),
    path('student_courses/', views.student_courses, name='student-courses'),
    path('group_members/', views.group_members, name='group_members'),
    path('create_group/', views.create_group, name='create_group'),
     path('courses_teacher/', views.main_teacher, name='create_group'),

    #path('teacher_course_groups/<int:course_id>/', views.teacher_course_groups, name='teacher_course_groups'),

    path('scale_rubric/', views.scale_rubric, name='scale_rubric'),
  #  path('create_rubric/', views.create_rubric, name='create_rubric'),
    path('courses/<int:course_id>/create_rubric/', views.create_rubric, name='create_rubric'),
    path('courses/<int:course_id>/register_student/', views.register_student, name='register_student'),
    #path('rubrics/<int:rubric_id>/', views.get_rubric, name='get_rubric'),
    path('group_list/', views.group_list, name='group_list'),
    path('group_detail/', views.group_detail, name='group_detail'),
    
    #crea la rubrica usando params 
    path('create_rubric_params/', views.create_rubric_params, name='create_rubric_params'),
    #estudiante con params
    path('register_student_params/', views.register_student_params, name='register_student_params'),
    #obtener rubrica con params
    path('get_rubric_params/', views.get_rubric_params, name='get_rubric_params'),

    
]
