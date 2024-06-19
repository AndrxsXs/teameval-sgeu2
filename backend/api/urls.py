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
    
    path('restore_password/', views.restore_password, name='restore_password'), #Enviar correo para restablecer contraseña
    
    path('report_datailed/<int:evaluation_id>', views.report_detailed , name='report_detailed'), #Informe detallado
    
    path('main_report', views.main_report, name='main_report'), #Main informes
    
    path('report_general/', views.report_general , name='report_general'), #Informe general

    path('teacher-rubrics/', views.get_teacher_rubrics, name='get_teacher_rubrics'), #Luisa

    #Muestra los cursos del estudiante 
    path('student_courses/', views.student_courses, name='student_courses'), #Luisa

    #Obtener estudiantes de mi grupo
    path('group_members', views.group_members, name='group_members'), #Luisa

    #Muestra la informacion de una rubrica
    path('info_rubric/<int:rubric_id>/', views.info_rubric, name='info_rubric'), #Luisa
    
    #Muestra la informacion completa del administrador
    path('admin_info/<str:admin_code>/', views.admin_info, name='admin_info'), #Luisa

    #Muestra la informacion completa del profesor
    path('teacher_info/<str:teacher_code>/', views.teacher_info, name='teacher_info'), #Luisa

    #Muestra la informacion completa del curso, profesor y estudiantes que pertenecen al curso
    path('course_info/<str:course_code>/', views.course_info, name='course_info'), #Luisa 
    
    #Crea un grupo
    path('create_group/<str:course_code>/', views.create_group, name='create_group'), #Luisa 

    #Lista de estudiantes sin grupo
    path('ungrouped_students/<str:course_code>/', views.ungrouped_students, name='ungrouped_students'), #Luisa
    
    #Evaluaciones disponibles para que el estudiante realice
    path('available_evaluations', views.available_evaluations, name='available_evaluations'), #Luisa

    #Muestra al estudiante las evaluaciones finalizadas
    path('completed_evaluations', views.completed_evaluations, name='completed_evaluations'), #Luisa

    #Editar user (profesor o admin)
    # path('update_user/<str:user_code>/', views.update_user, name='update_user'), #Luisa
    path('update_user', views.update_user, name='update_user'), #Luisa

    #Editar estudiante
    # path('update_student/<str:student_code>/', views.update_student, name='update_student'), #Luisa
    path('update_student', views.update_student, name='update_student'), #Luisa

    #Deshabilitar estudiante del curso y grupo
    path('unregister_student/<str:course_code>/', views.unregister_student, name='unregister_student'), #Luisa 

    #Habilita estudiante al curso
    path('enable_student/<str:course_code>/', views.enable_student, name='enable_student'), #Luisa

    #Editar curso
    path('update_course', views.update_course, name='update_course'), #Luisa

    #Editar rubrica
    path('update_rubric', views.update_rubric, name='update_rubric'), #Luisa

    #Deshabilitar curso con la excepción de que no puede tener evaluaciones en curso
    path('disable_course/<str:course_code>/', views.disable_course, name='disable_course'), #Luisa
    
    #Crear rubrica global por parte del admin
    path('create_global_rubric', views.create_global_rubric, name='create_global_rubric'), #Luisa

    #Editar rubrica global por parte del admin
    path('update_global_rubric/<int:rubric_id>', views.update_global_rubric, name='update_global_rubric'),

    #Mostrar rubrica global al administrador
    path('get_global_rubric/', views.get_global_rubric, name='get_global_rubric'), #Luisa

    #Habilitar curso
    path('enable_course/<str:course_code>/', views.enable_course, name='enable_course'),

    #path('teacher_course_groups/<int:course_id>/', views.teacher_course_groups, name='teacher_course_groups'),
    
    path('scale_rubric/', views.scale_rubric, name='scale_rubric'), #karol
  #  path('create_rubric/', views.create_rubric, name='create_rubric'),
    # el profesor crea una rubrica para ese curso
    # path('create_rubric/<str:course_code>/<int:scale_id>/', views.create_rubric, name='create_rubric'), #karol
    path('create_rubric', views.create_rubric, name='create_rubric'),
    path('courses/<str:course_code>/register_student/', views.register_student, name='register_student'), #karol
    path('rubrics/<int:rubric_id>/', views.get_rubric, name='get_rubric'), #karol
    #muestra la lista de todos los grupos que hay en un curso
    path('group_list/<str:course_code>/', views.group_list, name='group_list'), #karol
    #cuando le da clic encima de un grupo muestra informacion detallada de este
    path('group_detail/<str:course_code>/<int:group_id>/', views.group_detail, name='group_detail'), #karol
    
    #crea la rubrica usando params 
    path('create_rubric_params/', views.create_rubric_params, name='create_rubric_params'), #karol
    #estudiante con params
    path('register_student_params/', views.register_student_params, name='register_student_params'), #karol
    #obtener rubrica con params
    path('get_rubric_params/', views.get_rubric_params, name='get_rubric_params'), #karol
    #obtener la lista de rubricas con cuerpo
    path('list_rubric/<str:course_code>/', views.list_rubric, name='list_rubric'),
    #realiza la evaluacion el estudiante
    path('evaluate_student/', views.evaluate_student, name='evaluate_student'),
    #crea la evaluacion que van a usar los estudiantes
    path('create_evaluation', views.create_evaluation, name='create_evaluation'),
    #deshabilita admin y profesor
    path('disable_user/', views.disable_user, name='disable_user'),
    #habilita admin y profesor
    path('enable_user/', views.enable_user, name='enable_user'),
    #obtiene la nota del estudiante en anonimo
    path('evaluation_results/', views.evaluation_results, name='evaluation_results'),
    #cambia el estado de por iniciar a iniciado (inicializa una evaluacion)
    path('start_evaluation/', views.start_evaluation, name='start_evaluation'),
    #cambia el estado de por iniciado a finalizado (finaliza una evaluacion)
    path('finish_evaluation/', views.finish_evaluation, name='finish_evaluation'),
    #muestra la rubrica que va a usar para evaluar
    path('rubric_evaluate', views.rubric_evaluate, name='rubric_evaluate'),
    #muestra los cursos con evaluaciones finalizadas
    path('courses_evaluations_completed', views.courses_evaluations_completed, name='courses_evaluations_completed'),
    
]
