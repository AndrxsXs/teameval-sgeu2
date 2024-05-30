import csv
import io
from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError
from rest_framework.exceptions import ValidationError
from django.utils import timezone
# from django.contrib.auth.models import User
from .models import User, Course, Scale, Rubric, Standard,Student, Group, Evaluation
from .models import User
from . import models
from rest_framework import generics, status 
from rest_framework.response import Response
from .serializers import (
    UserSerializer,
    StudentSerializer,
    TeacherSerializer,
    AdminSerializer,
    CourseSerializer,
    GroupSerializer,
    RubricSerializer,
    StandardSerializer,
    RubricDetailSerializer,
    InfoRubricSerializer,
    RatingSerializer,
    EvaluationSerializer,
)
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import authenticate, login
from . import models
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.core.mail import EmailMultiAlternatives
from backend import settings
import pytz

# Create your views here.


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


#Luisa
#Los cursos del estudiante 
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def student_courses(request):
    user = request.user
    if user.role != models.User.STUDENT:
        return Response({"error": "El usuario no es un estudiante"}, status=status.HTTP_403_FORBIDDEN)

    student = models.Student.objects.get(user=user)
    courses = student.courses_user_student.all()

    if courses.exists():
        course_data = [
            {
                "code": course.code,
                "name": course.name,
                "teacher": f"{course.user_teacher.name} {course.user_teacher.last_name}",
                "academic_period": course.academic_period,
            }
            for course in courses
        ]
        return Response(course_data)
    else:
        return Response({"status": "No hay cursos inscritos"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_student(request, student_id):
    try:
        student = models.Student.objects.get(pk=student_id).user

        # Verificar que el usuario que hace la solicitud sea el mismo que el estudiante que se va a actualizar
        if request.user != student:
            return Response({"error": "You are not authorized to update this student"}, status=status.HTTP_403_FORBIDDEN)

        serializer = StudentSerializer(student.student, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except models.Student.DoesNotExist:
        return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)

#Luisa
#Editar profesor
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_teacher(request, teacher_id):
    try:
        teacher = models.Teacher.objects.get(pk=teacher_id).user

        # Verificar que el usuario que hace la solicitud sea el mismo que el profesor que se va a actualizar
        if request.user != teacher:
            return Response({"error": "No estas autorizado para actualizar la información"}, status=status.HTTP_403_FORBIDDEN)

        serializer = TeacherSerializer(teacher.teacher, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except models.Teacher.DoesNotExist:
        return Response({"error": "Profesor no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    
#Luisa
#Informacion profesor
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def teacher_info(request, teacher_code):
    try:
        teacher = models.Teacher.objects.get(user__code=teacher_code).user
        teacher_info = {
            "id": teacher.id,
            "code": teacher.code,
            "name": teacher.name,
            "last_name": teacher.last_name,
            "email": teacher.email,
            "status": teacher.status,
        }
        if hasattr(teacher, 'teacher'):
            teacher_info["phone"] = teacher.teacher.phone
        else:
            teacher_info["phone"] = None
        return Response(teacher_info)
    except models.Teacher.DoesNotExist:
        return Response({"error": "Profesor no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    
#Luisa
#Informacion administrador
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_info(request, admin_code):
    try:
        admin = models.Admi.objects.get(user__code=admin_code).user
        admin_info = {
            "id": admin.id,
            "code": admin.code,
            "name": admin.name,
            "last_name": admin.last_name,
            "email": admin.email,
            "status": admin.status,
        }
        if hasattr(admin, 'admi'):
            admin_info["phone"] = admin.admi.phone
        else:
            admin_info["phone"] = None
        return Response(admin_info)
    except models.Admi.DoesNotExist:
        return Response({"error": "Administrador no encontrado"}, status=status.HTTP_404_NOT_FOUND)

#Luisa
#Detalle del curso
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def course_info(request, course_code):
    try:
        course = models.Course.objects.get(code=course_code)
        students = course.user_students.all()

        student_info = []
        for student in students:
            student_info.append({
                "id": student.user.id,
                "code": student.user.code,
                "name": student.user.name,
                "last_name": student.user.last_name,
                "email": student.user.email,
                "status": student.user.status,
            })

        course_info = {
            "name": course.name,
            "code": course.code,
            "academic_period": course.academic_period,
            "student_status": course.student_status,
            "course_status": course.course_status,
            "teacher": {
                "code": course.user_teacher.code if course.user_teacher else None,
                "name": f"{course.user_teacher.name} {course.user_teacher.last_name}" if course.user_teacher else "No asignado"
            },
            "students": student_info
        }
        return Response(course_info)
    except models.Course.DoesNotExist:
        return Response({"error": "Curso no encontrado"}, status=status.HTTP_404_NOT_FOUND)    
#No es importante
@api_view(["GET"])
def list_user_teachers(request):
    teachers = User.objects.filter(role=User.TEACHER)
    serializer = UserSerializer(teachers, many=True)
    return Response(serializer.data)

#Luisa
#editar los datos del curso
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_course(request, course_id):
    data = request.data
    print("Datos recibidos:", data)  # Depuración: imprimir datos recibidos

    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return Response(
            {"error": "El curso con el ID proporcionado no existe."},
            status=status.HTTP_404_NOT_FOUND,
        )

    if "user_teacher" in data:
        try:
            user_teacher = User.objects.get(code=data.get("user_teacher"))
            print("Usuario encontrado:", user_teacher)  # Depuración: imprimir usuario encontrado
            course.user_teacher = user_teacher
        except User.DoesNotExist:
            print("Código de usuario no encontrado:", data.get("user_teacher"))  # Depuración: imprimir código no encontrado
            return Response(
                {"error": "El código de usuario proporcionado no es válido."},
                status=status.HTTP_400_BAD_REQUEST,
            )

    course.name = data.get("name", course.name)
    course.code = data.get("code", course.code)
    course.academic_period = data.get("academic_period", course.academic_period)

    serializer_course = CourseSerializer(course, data=request.data, partial=True)
    if serializer_course.is_valid():
        serializer_course.save()
        return Response(serializer_course.data, status=status.HTTP_200_OK)
    
    return Response(serializer_course.errors, status=status.HTTP_400_BAD_REQUEST)

#Luisa
#Deshabilitar estudiante de un curso
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def unregister_student(request, course_id):
    data = request.data
    student_code = data.get("code")
    
    # Obtiene el estudiante usando el código del estudiante proporcionado
    student = get_object_or_404(Student, user__code=student_code)

    # Obtiene el curso usando el ID del curso proporcionado
    course = get_object_or_404(Course, id=course_id)

    # Verifica si el estudiante está inscrito en el curso
    if course not in student.courses_user_student.all():
        return Response({"message": "El estudiante no está inscrito en este curso"}, status=status.HTTP_404_NOT_FOUND)

    # Elimina la relación entre el estudiante y el curso específico
    student.courses_user_student.remove(course)
    course.user_students.remove(student)

    # Deshabilita al estudiante del curso en todos los grupos
    groups = course.groups.all()
    for group in groups:
        if student in group.students.all():
            group.students.remove(student)

    return Response({"message": "Estudiante deshabilitado del curso y grupos correctamente"}, status=status.HTTP_200_OK)

#Luisa
#informacion completa de la rubrica
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def info_rubric(request, rubric_id):
    try:
        rubric = Rubric.objects.get(id=rubric_id)
    except Rubric.DoesNotExist:
        return Response({'error': 'Rúbrica no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = InfoRubricSerializer(rubric)
    return Response(serializer.data, status=status.HTTP_200_OK)

#Luisa
#
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_teacher_rubrics(request):
    user = request.user
    
    if user.role != User.TEACHER:
        return Response({"error": "El usuario no es un profesor"}, status=status.HTTP_403_FORBIDDEN)
    
    courses = Course.objects.filter(user_teacher=user)
    rubrics = Rubric.objects.filter(courses__in=courses).distinct()
    
    if not rubrics.exists():
        return Response({"message": "No se encuentran rubricas para el profesor"}, status=status.HTTP_200_OK)
    
    serializer = RubricSerializer(rubrics, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def import_student(request):
    csv_file = request.FILES[
        "csv_file"
    ]  # Asi se debe llamar el nombre del campo en front
    decoded_file = csv_file.read().decode("utf-8")
    io_string = io.StringIO(decoded_file)
    reader = csv.reader(io_string, delimiter=";", quotechar="|")
    next(reader)
    for row in reader:
        try:
            student_data = {
                "name": row[0],
                "last_name": row[1],
                "code": row[2],
                "email": row[3],
            }
        except IndexError:
            return Response(
                {"message": "El archivo CSV tiene un formato incorrecto"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer_student = StudentSerializer(data=student_data)
        if serializer_student.is_valid():
            try:
                serializer_student.save()
            except:
                return Response(
                    {"message": f"El usuario con el código {row[2]} ya existe"},
                    status=status.HTTP_409_CONFLICT,
                )
        else:
            return Response(
                serializer_student.errors, status=status.HTTP_400_BAD_REQUEST
            )
    return Response(
        {"message": "Estudiantes importados exitosamente"},
        status=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def import_teacher(request):
    csv_file = request.FILES["csv_file"]
    decoded_file = csv_file.read().decode("utf-8")
    io_string = io.StringIO(decoded_file)
    reader = csv.reader(io_string, delimiter=";", quotechar="|")
    next(reader)
    for row in reader:
        try:
            teacher_data = {
                "name": row[0],
                "last_name": row[1],
                "code": row[2],
                "email": row[3],
                "phone": row[4],
            }
        except IndexError:
            return Response(
                {"message": "El archivo CSV tiene un formato incorrecto"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer_teacher = TeacherSerializer(data=teacher_data)
        if serializer_teacher.is_valid():
            try:
                serializer_teacher.save()
            except:
                return Response(
                    {"message": f"El usuario con el código {row[2]} ya existe"},
                    status=status.HTTP_409_CONFLICT,
                )
        else:
            return Response(
                serializer_teacher.errors, status=status.HTTP_400_BAD_REQUEST
            )
    return Response(
        {"message": "Profesores importados exitosamente"},
        status=status.HTTP_201_CREATED,
    )


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Añade el rol del usuario al payload del token
        token["role"] = user.role
        token["first_login"] = user.first_login

        # Puse lo siguiente para recibir info del usuario temporalmente
        # Esto debe ser otra api view, actualmente es la user_data()
        # token['name'] = user.name
        # token['last_name'] = user.last_name
        # token['email'] = user.email

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# creacion de un estudiante
# student creation
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def register_student2(request):
    data = request.data
    password = User.default_password(
        data.get("name"), data.get("code"), data.get("last_name")
    )
    student_data = {
        "name": data.get("name"),
        "last_name": data.get("last_name"),
        "code": data.get("code"),
        "email": data.get("email"),
        "group": None,
        "password": password,
    }
    serializer_student = StudentSerializer(data=student_data)
    if serializer_student.is_valid():
        try:
            student = serializer_student.save()
            course_id = data.get('course_id')
            course = Course.objects.get(id=course_id)
            if course in student.course_set.all():
                return Response({"message": "El estudiante ya esta en este curso"}, status=status.HTTP_409_CONFLICT)
            student.course_set.add(course)
            course.user_students.add(student)
            return Response(
                {"message": "User created successfully"}, status=status.HTTP_201_CREATED
            )
        except:
            return Response(
                {"message": "User with this code already exists"},
                status=status.HTTP_409_CONFLICT,
            )
    return Response(serializer_student.errors, status=status.HTTP_400_BAD_REQUEST)

# creacion de un estudiante
# student creation
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def register_student(request, course_code):
    data = request.data
    password = User.default_password(
        data.get("name"), data.get("code"), data.get("last_name")
    )
    student_data = {
        "name": data.get("name"),
        "last_name": data.get("last_name"),
        "code": data.get("code"),
        "email": data.get("email"),
        "group": None,
        "password": password,
    }
    try:
        # Verifica si el estudiante ya existe
        student = Student.objects.get(user__code=student_data["code"])
    except Student.DoesNotExist:
        # Si el estudiante no existe, crea uno nuevo
        serializer_student = StudentSerializer(data=student_data)
        if serializer_student.is_valid():
            student = serializer_student.save()
        else:
            return Response(serializer_student.errors, status=status.HTTP_400_BAD_REQUEST)

    # Obtiene el curso
    try:
        course = Course.objects.get(code=course_code)
    except Course.DoesNotExist:
        return Response({"message": "Curso no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    # Verifica si el estudiante ya está en el curso
    if course in student.courses_user_student.all():
        return Response({"message": "El estudiante ya está en este curso"}, status=status.HTTP_409_CONFLICT)

    # Agrega el estudiante al curso
    student.courses_user_student.add(course)
    course.user_students.add(student)

    return Response(
        {"message": "Estudiante agregado exitosamente"}, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def register_student_params(request):    
    course_id = request.GET.get("course")
    if not course_id:
        return Response({'error': 'ID del curso no proporcionado.'}, status=status.HTTP_400_BAD_REQUEST)

    data = request.data
    password = User.default_password(
        data.get("name"), data.get("code"), data.get("last_name")
    )
    student_data = {
        "name": data.get("name"),
        "last_name": data.get("last_name"),
        "code": data.get("code"),
        "email": data.get("email"),
        "group": None,
        "password": password,
    }
    try:
        # Verifica si el estudiante ya existe
        student = Student.objects.get(user__code=student_data["code"])
    except Student.DoesNotExist:
        # Si el estudiante no existe, crea uno nuevo
        serializer_student = StudentSerializer(data=student_data)
        if serializer_student.is_valid():
            student = serializer_student.save()
        else:
            return Response(serializer_student.errors, status=status.HTTP_400_BAD_REQUEST)

    # Obtiene el curso
    course = Course.objects.get(code=course_id)

    # Verifica si el estudiante ya está en el curso
    if course in student.courses_user_student.all():
        return Response({"message": "El estudiante ya esta en este curso"}, status=status.HTTP_409_CONFLICT)

    # Agrega el estudiante al curso
    student.courses_user_student.add(course)
    course.user_students.add(student)

    return Response(
        {"message": "Estudiante agregado exitosamente"}, status=status.HTTP_201_CREATED)


#crea la escala de la rubrica
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def scale_rubric(request):
    upper_limit = int(request.data.get('upper_limit'))
    lower_limit = 1 # limite inferior es 1
    
    scale = Scale.objects.create(Upper_limit=upper_limit, Lower_limit=lower_limit)
    
    return Response({'message': f'Escala creada con éxito con ID {scale.id}.'}, status=status.HTTP_201_CREATED)

#el profesor crea la rubrica
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_rubric1(request, course_id):    
  #  print(request.data)
  #  print(f"course_id: {course_id}") 
    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return Response({'error': 'Curso no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
    
    request.data['courses'] = [course_id]
    serializer = RubricSerializer(data=request.data)
    if serializer.is_valid():
        rubric = serializer.save()
        return Response({'message': f'Rúbrica creada con éxito con ID {rubric.id} y asociada al curso {course.name}.'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_rubric(request, course_code, scale_id):
    try:
        course = Course.objects.get(code=course_code)
    except Course.DoesNotExist:
        return Response({'error': 'Curso no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

    # Asegúrate de que la escala exista
    try:
        scale = Scale.objects.get(id=scale_id)
    except Scale.DoesNotExist:
        return Response({'error': 'Escala no encontrada.'}, status=status.HTTP_404_NOT_FOUND)

    # Crear los estándares primero
    standards_data = request.data.get('standards')
    standards = []
    for standard_data in standards_data:
        standard_serializer = StandardSerializer(data=standard_data)
        if standard_serializer.is_valid():
            standard = standard_serializer.save()
            standards.append(standard)
        else:
            return Response(standard_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Crear la rúbrica y asociar los estándares a ella
    rubric_data = {
        'name': request.data.get('name'),
        'scale': scale.id,
        'courses': [course.id],
        'standards': [standard.id for standard in standards]
    }
    rubric_serializer = RubricSerializer(data=rubric_data)
    if rubric_serializer.is_valid():
        rubric_serializer.save()
        return Response({'message': f'Rúbrica y estándares creados con éxito y asociados al curso {course.name}.'}, status=status.HTTP_201_CREATED)
    else:
        return Response(rubric_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#crea la evaluacion que se realiza a los estudiantes
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_evaluation(request, course_code):
    try:
        # Obtener el curso utilizando el código recibido en la URL
        course = Course.objects.get(code=course_code)
    except Course.DoesNotExist:
        return Response({'error': 'Curso no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

    data = request.data
    rubric_name = data.get('rubric_name')
    name = data.get('name')
    date_start = data.get('date_start')
    date_end = data.get('date_end')

    if not rubric_name or not name or not date_start or not date_end:
        return Response({'error': 'Faltan datos necesarios.'}, status=status.HTTP_400_BAD_REQUEST)

    # Obtener la rúbrica por nombre
    try:
        rubric = Rubric.objects.get(name=rubric_name)
    except Rubric.DoesNotExist:
        return Response({'error': 'Rúbrica no encontrada.'}, status=status.HTTP_404_NOT_FOUND)

    # Convertir las fechas a objetos datetime conscientes de la zona horaria de Bogotá
    bogota_tz = pytz.timezone('America/Bogota')
    date_start = timezone.datetime.fromisoformat(date_start).astimezone(bogota_tz)
    date_end = timezone.datetime.fromisoformat(date_end).astimezone(bogota_tz)

    # Determinar el estado inicial basado en las fechas
    current_time = timezone.now().astimezone(bogota_tz)
    if current_time < date_start:
        estado = Evaluation.TO_START
    elif date_start <= current_time <= date_end:
        estado = Evaluation.INITIATED
    else:
        estado = Evaluation.FINISHED

    # Crear la evaluación asociada al curso
    evaluation_data = {
        'estado': estado,
        'date_start': date_start,
        'date_end': date_end,
        'name': name,
        'rubric': rubric.id,
        'course': course.id, 
        'report': None,
        'completed': False
    }
    serializer = EvaluationSerializer(data=evaluation_data)
    if serializer.is_valid():
        serializer.save()
        
        return Response({'message': 'Evaluación creada con éxito.'}, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_rubric_params(request):    
    course_id = request.GET.get("course")
    scale_id = request.GET.get("scale")

    if not course_id or not scale_id:
        return Response({'error': 'ID del curso y de la escala son requeridos.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return Response({'error': 'Curso no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
    
    try:
        scale = Scale.objects.get(id=scale_id)
    except Scale.DoesNotExist:
        return Response({'error': 'Escala no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
    
    # Crear los estándares primero
    standards_data = request.data.get('standards')
    standards = []
    for standard_data in standards_data:
        standard_serializer = StandardSerializer(data=standard_data)
        if standard_serializer.is_valid():
            standard = standard_serializer.save()
            standards.append(standard)
        else:
            return Response(standard_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Crear la rúbrica y asociar los estándares a ella
    rubric_data = {
        'name': request.data.get('name'),
        'scale': scale.id,
        'courses': [course_id],
        'standards': [standard.id for standard in standards]
    }
    rubric_serializer = RubricSerializer(data=rubric_data)
    if rubric_serializer.is_valid():
        rubric_serializer.save()
    else:
        return Response(rubric_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    return Response({'message': f'Rúbrica y estándares creados con éxito y asociados al curso {course.name}.'}, status=status.HTTP_201_CREATED)

#obtiene la informacion de la rubrica para poder evaluar un estudiante
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_rubric(request, rubric_id):
    try:
        rubric = Rubric.objects.get(id=rubric_id)
    except Rubric.DoesNotExist:
        return Response({'error': 'Rúbrica no encontrada.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = RubricDetailSerializer(rubric)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_rubric_params(request):    
    rubric_id = request.GET.get("rubric")
    if not rubric_id:
        return Response({'error': 'ID de la rúbrica no proporcionado.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        rubric = Rubric.objects.get(id=rubric_id)
    except Rubric.DoesNotExist:
        return Response({'error': 'Rúbrica no encontrada.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = RubricDetailSerializer(rubric)
    return Response(serializer.data)

#obtener la informacion de todas las rubricas que tiene un curso
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_rubric(request, course_code):
    # Obtiene el curso por su código
    course = get_object_or_404(Course, code=course_code)

    # Obtiene todas las rúbricas asociadas a este curso
    rubrics = Rubric.objects.filter(courses=course)
    serializer = RubricDetailSerializer(rubrics, many=True)

    return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def register_admin(request):
    data = request.data
    password = User.default_password(
        data.get("name"), data.get("code"), data.get("last_name")
    )
    admin_data = {
        "name": data.get("name"),
        "last_name": data.get("last_name"),
        "code": data.get("code"),
        "email": data.get("email"),
        "phone": data.get("phone"),
        "password": password,
    }
    serializer_admin = AdminSerializer(data=admin_data)
    if serializer_admin.is_valid():
        try:
            serializer_admin.save()
            return Response(
                {"message": "Administrador creado exitosamente"}, status=status.HTTP_201_CREATED
            )
        except:
            return Response(
                {"message": "Un administrador con esta cedula ya existe"},
                status=status.HTTP_409_CONFLICT,
            )
    return Response(
        {"message": "Error al crear administrador"}, status=status.HTTP_400_BAD_REQUEST
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def register_teacher(request):
    data = request.data
    password = User.default_password(
        data.get("name"), data.get("code"), data.get("last_name")
    )
    teacher_data = {
        "name": data.get("name"),
        "last_name": data.get("last_name"),
        "code": data.get("code"),
        "email": data.get("email"),
        "phone": data.get("phone"),
        "password": password,
    }
    serializer_teacher = TeacherSerializer(data=teacher_data)
    if serializer_teacher.is_valid():
        try:
            serializer_teacher.save()
            return Response(
                {"message": "Profesor creado exitosamente"}, status=status.HTTP_201_CREATED
            )
        except:
            return Response(
                {"message": "Un profesor con esta cedula ya existe"},
                status=status.HTTP_409_CONFLICT,
            )
    return Response(
        {"message": "Error al crear profesor"}, status=status.HTTP_400_BAD_REQUEST
    )

#Luisa
#obtener estudiantes de mi grupo
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def group_members(request):
    try:
        student = Student.objects.get(user=request.user)
    except Student.DoesNotExist:
        return Response({"error": "El estudiante no existe"}, status=status.HTTP_404_NOT_FOUND)

    # Obtener el grupo al que pertenece el estudiante
    try:
        group = Group.objects.get(students=student)
    except Group.DoesNotExist:
        return Response({"error": "La estudiante no es miembro de ningún grupo."}, status=status.HTTP_404_NOT_FOUND)

    # Obtener los integrantes del grupo excluyendo al estudiante autenticado
    group_members = group.students.exclude(pk=student.pk)
    serializer = StudentSerializer(group_members, many=True)
    return Response(serializer.data)

#obtener estudiantes del grupo
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def group_members_no(request, student_id):
    try:
        student = Student.objects.get(pk=student_id)
    except Student.DoesNotExist:
        return Response({"error": "Student does not exist"}, status=status.HTTP_404_NOT_FOUND)

    # Obtener el grupo al que pertenece el estudiante
    try:
        group = Group.objects.get(students=student)
    except Group.DoesNotExist:
        return Response({"error": "Student is not a member of any group"}, status=status.HTTP_404_NOT_FOUND)

    # Obtener los integrantes del grupo
    group_members = group.students.all()
    serializer = StudentSerializer(group_members, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def group_list(request):
    course_id = request.GET.get("course")
    
    if course_id:
        course = Course.objects.get(id=course_id)
        groups = Group.objects.filter(course=course)
    
    group_data = [
        {
            "id": group.id,
            "name": group.name,
            "assigned_project": group.assigned_project,
            "student_count": group.students.count(),            
        }
        for group in groups
    ]
    
    return Response(group_data)

#Luisa
#Lista de estudiantes que no pertenecen a un grupo@api_view(["GET"])
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def ungrouped_students(request, course_code):
    try:
        print(f"Buscando curso con código: {course_code}")
        course = Course.objects.get(code=course_code)
        print(f"Curso encontrado: {course}")
        
        all_students = set(course.user_students.all())
        print(f"Todos los estudiantes del curso: {all_students}")
        
        # Corregir la consulta para obtener estudiantes agrupados
        grouped_students = set(Student.objects.filter(students__course=course))
        print(f"Estudiantes agrupados: {grouped_students}")
        
        ungrouped_students = all_students - grouped_students
        print(f"Estudiantes no agrupados: {ungrouped_students}")

        student_info = [
            {
                "id": student.user.id,
                "code": student.user.code,
                "name": student.user.name,
                "last_name": student.user.last_name,
                "email": student.user.email,
                "status": student.user.status,
            }
            for student in ungrouped_students
        ]
        
        print(f"Información de estudiantes no agrupados: {student_info}")
        
        return Response(student_info, status=status.HTTP_200_OK)
    except Course.DoesNotExist:
        print("Curso no encontrado")
        return Response({"error": "Curso no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error inesperado: {str(e)}")
        return Response({"error": "Error inesperado"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


#Luisa
#Creación del grupo
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_group(request, course_code):
    try:
        print("Buscando curso...")
        course = Course.objects.get(code=course_code)
        print("Curso encontrado:", course)
    except Course.DoesNotExist:
        print("Curso no encontrado")
        return Response({"error": "Curso no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    student_codes = request.data.get("students", [])  # Obtener los códigos de estudiante de la solicitud POST

    print("Estudiantes recibidos:")
    for code in student_codes:
        print("Código de estudiante:", code)

    # Agregamos el curso al diccionario de datos
    request.data["course"] = course.id

    serializer = GroupSerializer(data=request.data)
    if serializer.is_valid():
        try:
            serializer.save()
        except ValidationError as e:
            # Manejar la excepción ValidationError del serializador
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": "Grupo creado correctamente"}, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def evaluate_student(request, student_code, rubric_id):
    student = get_object_or_404(Student, user__code=student_code)
    rubric = get_object_or_404(Rubric, id=rubric_id)
    
    try:
        evaluation = Evaluation.objects.get(evaluated=student, report__course=rubric.courses.first())
    except Evaluation.DoesNotExist:
        return Response({'message': 'No se encontró una evaluación previa para este estudiante y rúbrica.'}, status=status.HTTP_404_NOT_FOUND)
    
    standards = rubric.standards.all()
    
    if request.method == "POST":
        for standard in standards:
            score = request.data.get(f"standard_{standard.id}")
            if score is not None:
                rating_data = {'standard': standard.id, 'evaluation': evaluation.id, 'score': int(score)}
                rating_serializer = RatingSerializer(data=rating_data)
                if rating_serializer.is_valid():
                    rating_serializer.save()
                else:
                    return Response(rating_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        evaluation.completed = True
        evaluation.save()
        
        return Response({'message': 'Evaluación completada con éxito.'}, status=status.HTTP_200_OK)

    # Renderizar la plantilla con la rúbrica y los estándares
    return Response({'message': 'Envía las calificaciones para cada estándar.'}, status=status.HTTP_200_OK)
    

#muestra la lista de grupos de ese curso
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def group_list(request, course_code):
    course = get_object_or_404(Course, code=course_code)
    groups = Group.objects.filter(course=course)
    
    group_data = [
        {
            "id": group.id,
            "name": group.name,
            "assigned_project": group.assigned_project,
            "student_count": group.students.count(),
        }
        for group in groups
    ]
    
    return Response(group_data)
    
#muestra la informacion de un grupo
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def group_detail(request, course_code, group_id):
    group = get_object_or_404(Group, id=group_id, course__code=course_code)
    
    student_data = [
        {
            "student_code": student.user.code,
            "student_name": f"{student.user.name} {student.user.last_name}",
        }
        for student in group.students.all()
    ]
    
    group_data = {
        "group_id": group.id,
        "course_id": group.course.code,
        "assigned_project": group.assigned_project,
        "students": student_data,
    }
    
    return Response(group_data)

# creacion de un profesor
# teacher creation
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def register_teacher1(request):
    # creacion del usuario
    # user creation
    data = request.data
    user_data = {
        "role": User.TEACHER,
        "code": data.get("code"),
        "name": data.get("name"),
        "last_name": data.get("last_name"),
        "email": data.get("email"),
        "password": User.default_password(
            data.get("name"), data.get("code"), data.get("last_name")
        ),
    }
    # creacion del profesor
    # teacher creation
    serializer_user = UserSerializer(data=user_data)
    if serializer_user.is_valid():
        user = serializer_user.save()
        teacher_data = {
            "user": user,
            # 'email': user.email,
            "name": user.name,
            "last_name": user.last_name,
            "code": user.code,
            "phone": data.get("phone"),
        }
        serializer_teacher = TeacherSerializer(data=teacher_data)
        if serializer_teacher.is_valid():
            # cambia el estado del profesor a activo la logica fue implementada en serializers.py
            serializer_teacher.save()
            return Response(serializer_teacher.data, status=status.HTTP_201_CREATED)
        return Response(serializer_teacher.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer_user.errors, status=status.HTTP_400_BAD_REQUEST)


# creacion de un admin
# admin creation
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def register_admin1(request):
    # creacion del usuario
    # user creation
    data = request.data
    user_data = {
        "role": User.ADMIN,
        "code": data.get("code"),
        "name": data.get("name"),
        "last_name": data.get("last_name"),
        "email": data.get("email"),
        "password": User.default_password(
            data.get("name"), data.get("code"), data.get("last_name")
        ),
    }
    # creacion del admin
    # admin creation
    serializer_user = UserSerializer(data=user_data)
    if serializer_user.is_valid():
        user = serializer_user.save()
        admin_data = {
            "user": user,
            #   "email": user.email,
            "name": user.name,
            "last_name": user.last_name,
            "code": user.code,
            "phone": data.get("phone"),
        }
        serializer_admin = AdminSerializer(data=admin_data)
        if serializer_admin.is_valid():
            # cambia el estado del admin a activo la logica fue implementada en serializers.py
            serializer_admin.save()
            return Response(serializer_admin.data, status=status.HTTP_201_CREATED)
        return Response(serializer_admin.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer_user.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def login_view(request):
    code = request.data.get("code")
    password = request.data.get("password")
    user = authenticate(request, code=code, password=password)
    if user:
        login(request, user)
        return Response(
            {"role": user.groups.first().name, "first_login": user.first_login}
        )
    else:
        return Response(
            {"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):
    password = request.data.get("password")
    if password is None:
        return Response(
            {"error": "Password not provided"}, status=status.HTTP_400_BAD_REQUEST
        )

    user = request.user
    user.set_password(password)
    user.first_login = False
    user.save()
    return Response(
        {"status": "Password changed successfully", "first_login": user.first_login}
    )


# obtiene una lista de usuarios
# gets a list of users
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_list(request):
    role = request.GET.get("role")
    course_id = request.GET.get("course")

    users = User.objects.all()

    if role:
        users = users.filter(role=role)

    if course_id:
        course = Course.objects.get(id=course_id)
        users = users.filter(student__courses_user_student=course)

    user_data = [
        {
            "role": user.role,
            "code": user.code,
            "name": user.name,
            "last_name": user.last_name,
            "email": user.email,
            "status": user.status,
        }
        for user in users
    ]

    return Response(user_data)


# obtiene una lista de estudiantes
# gets a list of students
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def student_list(request):
    course_id = request.GET.get("course")
    try:
        course= Course.objects.get(code= course_id)
    except Course.DoesNotExist:
        return Response(
            {"error": "No exite un curso con el codigo proporcionado."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    students= course.user_students.all()

    user_data = [
        {
            "name": student.user.name,
            "last_name": student.user.last_name,
            "code": student.user.code,
            "email": student.user.email,
            "status": student.user.status,
        }
        for student in students
    ]
    return Response(user_data)
    
# obtiene una lista de cursos
# gets a list of course
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def course_list(request):
    courses = Course.objects.all()
    course_data = []
    for course in courses:
        students = course.user_students.values(
            "user__name", "user__last_name", "user__code", "user__email"
        )
        course_data.append(
            {
                "code": course.code,
                "name": course.name,
                "teacher": course.teacher_name,
                "academic_period": course.academic_period,
                "student_count": course.student_count,
                "students": list(students),
            }
        )
    return Response(course_data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_data(request):
    user = request.user
    # role = user.groups.first().name
    role = user.role
    data = {
        "code": user.code,
        "email": user.email,
        "role": role,
        "name": user.name,
        "last_name": user.last_name,
    }
    return Response(data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def main_teacher(request):
    user= request.user
    print(user.id)
    courses = Course.objects.filter(
        user_teacher= user.id)
    print(courses)
    course_data = []
    for course in courses:
        students = course.user_students.values(
           "user__name", "user__last_name", "user__code", "user__email")
        course_data.append(
            {
                "code": course.code,
                "name": course.name,
                "teacher": course.teacher_name,
                "students": list(students),
                "academic_period": course.academic_period,
            }
        )
    return Response(course_data)
    #else:
    return Response(
            {"status": "El docente actualmente no tiene cursos"}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def search_user(request):
    name = request.data.get("seeker")
    data = models.User.objects.filter(name__icontains=name, last_name__icontains=name)
    if data is None:
        return Response({"error": "no matches"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        user_data = [
            {
                "code": user.code,
                "name": user.name,
                "last_name": user.last_name,
                "email": user.email,
                "role": user.role,
                # recorre cada usuario de la lista
            }
            for user in data
        ]
    return Response(user_data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_course(request):
    data = request.data
    try:
        user = models.User.objects.get(code=data.get("user_teacher"))
    except User.DoesNotExist:
        return Response(
            {"error": "El código de usuario proporcionado no es válido."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    course_data = {
        "name": data.get("name"),
        "code": data.get("code"),
        "academic_period": data.get("academic_period"),
        "user_teacher": user.id,
    }

    serializer_course = CourseSerializer(data=course_data)
    if serializer_course.is_valid():
        serializer_course.save()
        return Response(serializer_course.data, status=status.HTTP_201_CREATED)

    return Response(serializer_course.errors, status=status.HTTP_400_BAD_REQUEST)


# def create_course(request):
#     data = {
#         "name": request.data.get("name"),
#         "code": request.data.get("code"),
#         "academic_period": request.data.get("academic_period"),
#         "teacher": request.data.get("teacher"),
#     }
#     serializer_course = CourseSerializer(data)
#     if serializer_course.is_valid():
#         serializer_course.save()
#         return Response(serializer_course.data, status=status.HTTP_201_CREATED)
#     return Response(serializer_course.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_mail(request):
    q = request.POST.get("user_mail", "")
    subject = "Restablecer contraseña"
    if models.User.objects.filter(email__icontains=q).exists():
        message = EmailMultiAlternatives(
            subject,  # Titulo
            "Hola, para restablecer su contraseña ingrese al siguiente link ....",
            settings.EMAIL_HOST_USER,  # Remitente
            [q],
        )  # Destinatario
        message.send()
        return Response(
            {"message": "Correo enviado correctamente"}, status=status.HTTP_200_OK
        )
    else:
        return Response(
            {"error": "No existe un usuario con esta direccion de correo electronico"},
            status=status.HTTP_400_BAD_REQUEST,
        )

#Boceto idea metodo para realizar evaluacion
# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def evaluar(request):
#     data= request.data
#     user= request.user
#     evaluator= models.Student.objects.get(user_code =  user.code)
    
#     try:
#         evaluated= models.Student.objects.get(user_code =  data.get("evaluated"))
#         #user = models.User.objects.get(code=data.get("user_teacher"))
#     except User.DoesNotExist:
#         return Response(
#             {"error": "El código de usuario proporcionado no es válido."},
#             status=status.HTTP_400_BAD_REQUEST,
#         )
    
#     number_standars= models.Standard.objects.filter(rubric_id= data.get("")).count
    
#     for calificacion in range(0, number_standars):
#         models.Evaluation.objects.create(qualification= data.get(calificacion), standar= )
    
    
#     course_data = {
#         "evaluated": evaluated.id,
#         "evaluator": evaluator.id,
#     }
    
# Vista para hacer pruebas backend
def singin(request):
    if request.method == "GET":
        return render(request, "singin.html")
    else:
        user = authenticate(
            request, code=request.POST["code"], password=request.POST["password"]
        )

        if user is None:
            return render(request, "singin.html")

        else:
            login(request, user)
            return redirect(home)


def home(request):
    return render(request, "home.html")


def prueba(request):
    curso = models.Course.objects.get(id=2)
    return render(
        request,
        "prueba.html",
        {
            "name": curso.name,
            "code": curso.code,
            "teacher": curso.user_teacher.name + " " + curso.user_teacher.last_name,
        },
    )


