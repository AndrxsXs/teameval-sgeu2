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
    path('courses_teacher/', views.main_teacher, name='courses_teacher'),
    path('student_list/', views.student_list, name='student_list'), #Enlistar los estudiantes de un curso, dado un codigo de un curso
    

    path('teacher-rubrics/', views.get_teacher_rubrics, name='get_teacher_rubrics'), #Luisa
    path('student_courses/', views.student_courses, name='student-courses'), #Luisa
    path('group_members/', views.group_members, name='group_members'), #Luisa
    path('create_group/<int:course_id>/', views.create_group, name='create_group'), #Luisa
    path('create_group/', views.create_group2, name='create_group'), #Luisa
    path('info_rubrics/<int:rubric_id>/', views.info_rubric, name='info_rubric'), #Luisa
    path('courses/<int:course_id>/unregister/', views.unregister_student, name='unregister_student'), #Luisa
    path('course_info/<int:course_id>/', views.course_info, name='course_info'), #Luisa
    path('admin_info/<int:admin_id>/', views.admin_info, name='admin_info'), #Luisa
    path('teacher_info/<int:teacher_id>/', views.teacher_info, name='teacher_info'), #Luisa
    path('update_teacher/<int:teacher_id>/', views.update_teacher, name='update_teacher'), #Luisa probar con el super usuario
    path('update_student/<int:student_id>/', views.update_student, name='update_student'), #Luisa probar con el super usuario

    #path('update_course/<int:course_id>/', views.update_course, name='update_course'), #Luisa no sirve bien
    #path('list_user_teachers/', views.list_user_teachers, name='list_user_teachers'), #Luisa no importante

    #path('teacher_course_groups/<int:course_id>/', views.teacher_course_groups, name='teacher_course_groups'),

    path('scale_rubric/', views.scale_rubric, name='scale_rubric'), #karol
  #  path('create_rubric/', views.create_rubric, name='create_rubric'),
    path('courses/<int:course_id>/create_rubric/', views.create_rubric, name='create_rubric'), #karol
    path('courses/<int:course_id>/register_student/', views.register_student, name='register_student'), #karol
    path('rubrics/<int:rubric_id>/', views.get_rubric, name='get_rubric'), #karol
    path('group_list/', views.group_list, name='group_list'), #karol
    path('group_detail/', views.group_detail, name='group_detail'), #karol
    
    #crea la rubrica usando params 
    path('create_rubric_params/', views.create_rubric_params, name='create_rubric_params'), #karol
    #estudiante con params
    path('register_student_params/', views.register_student_params, name='register_student_params'), #karol
    #obtener rubrica con params
    path('get_rubric_params/', views.get_rubric_params, name='get_rubric_params'), #karol
    #obtener la lista de rubricas con cuerpo
    path('list_rubric/<int:course_id>/', views.list_rubric, name='list_rubric'),

    

    
]
