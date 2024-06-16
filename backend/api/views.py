import csv
import io
import re
from django.db.models import Q
from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError
from rest_framework.exceptions import ValidationError
from django.utils import timezone
from django.core.validators import RegexValidator
from rest_framework import serializers
from django.core.validators import validate_email


# from django.contrib.auth.models import User
from .models import (
    User,
    Course,
    Scale,
    Rubric,
    Standard,
    Student,
    Group,
    Evaluation,
    Teacher,
    EvaluationCompleted,
    Rating,
)
from .models import User
from . import models
from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import (
    GlobalRubricSerializer,
    ScaleSerialiazer,
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
    EvaluationSerializerE,
    TeacherSerializerUpdate,
    AdminSerializerUpdate,
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
import random
import string

# Create your views here.


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


# Luisa
# Los cursos del estudiante
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def student_courses(request):
    user = request.user
    if user.role != models.User.STUDENT:
        return Response(
            {"error": "El usuario no es un estudiante"},
            status=status.HTTP_403_FORBIDDEN,
        )

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
        return Response(
            {"status": "No hay cursos inscritos"}, status=status.HTTP_400_BAD_REQUEST
        )


def validate_email_format(email):
    """
    Valida que el email siga el formato correcto.
    """
    try:
        validate_email(email)
        return True
    except ValidationError:
        return False


def validate_name(name):
    """
    Valida que el nombre solo contenga letras y espacios.
    """
    return bool(re.fullmatch(r"[A-Za-z\s]+", name))


def validate_name(value):
    if not re.match(r"^[a-zA-Z\s]+$", value):
        raise serializers.ValidationError(
            "El campo solo debe contener letras y espacios"
        )


def validate_code(value):
    if not value.isdigit():
        raise serializers.ValidationError("El código debe ser solo números")


def validate_email(value):
    try:
        serializers.EmailField().run_validation(value)
    except serializers.ValidationError:
        raise serializers.ValidationError(
            "El email debe seguir el formato correcto (@example.com)"
        )


def validate_phone(value):
    if value is not None and not value.isdigit():
        raise serializers.ValidationError("El teléfono debe ser solo números")


# Luisa
# Editar profesor y administrador
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_user(request):
    user_code = request.query_params.get("user_code")

    # Verificar si el usuario que realiza la solicitud es un administrador
    if not request.user.is_superuser:
        return Response(
            {"error": "No tiene permiso para realizar esta acción"},
            status=status.HTTP_403_FORBIDDEN,
        )

    try:
        # Buscar al usuario por código
        user = User.objects.get(code=user_code)

        # Obtener los datos a actualizar del request
        name = request.data.get("name", user.name)
        last_name = request.data.get("last_name", user.last_name)
        email = request.data.get("email", user.email)
        code = request.data.get("code", user.code)

        # Validar los datos
        try:
            validate_name(name)
            validate_name(last_name)
            validate_code(code)
            validate_email(email)
        except serializers.ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # Actualizar los datos del usuario
        user_data = {
            "name": name,
            "last_name": last_name,
            "email": email,
            "code": code,
        }
        user_serializer = TeacherSerializer(user, data=user_data, partial=True)
        if user_serializer.is_valid():
            user_serializer.save()

            # Verificar y actualizar datos específicos del profesor o administrador
            if hasattr(user, "teacher"):
                teacher = user.teacher
                teacher_serializer = TeacherSerializerUpdate(
                    teacher, data=request.data, partial=True
                )
                if teacher_serializer.is_valid():
                    teacher_serializer.save()
                else:
                    return Response(
                        teacher_serializer.errors, status=status.HTTP_400_BAD_REQUEST
                    )
            elif hasattr(user, "admi"):
                admin = user.admi
                admin_serializer = AdminSerializerUpdate(
                    admin, data=request.data, partial=True
                )
                if admin_serializer.is_valid():
                    admin_serializer.save()
                else:
                    return Response(
                        admin_serializer.errors, status=status.HTTP_400_BAD_REQUEST
                    )

            return Response(
                {"message": "Los datos del usuario han sido actualizados exitosamente"},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response(
            {"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND
        )


# Luisa
# Informacion profesor
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
        if hasattr(teacher, "teacher"):
            teacher_info["phone"] = teacher.teacher.phone
        else:
            teacher_info["phone"] = None
        return Response(teacher_info)
    except models.Teacher.DoesNotExist:
        return Response(
            {"error": "Profesor no encontrado"}, status=status.HTTP_404_NOT_FOUND
        )


# Luisa
# Informacion administrador
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
        if hasattr(admin, "admi"):
            admin_info["phone"] = admin.admi.phone
        else:
            admin_info["phone"] = None
        return Response(admin_info)
    except models.Admi.DoesNotExist:
        return Response(
            {"error": "Administrador no encontrado"}, status=status.HTTP_404_NOT_FOUND
        )


# Luisa
# Detalle del curso
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def course_info(request, course_code):
    try:
        course = models.Course.objects.get(code=course_code)
        students = course.user_students.all()

        student_info = []
        for student in students:
            student_info.append(
                {
                    "id": student.user.id,
                    "code": student.user.code,
                    "name": student.user.name,
                    "last_name": student.user.last_name,
                    "email": student.user.email,
                    "status": student.user.status,
                }
            )

        course_info = {
            "name": course.name,
            "code": course.code,
            "academic_period": course.academic_period,
            "student_status": course.student_status,
            "course_status": course.course_status,
            "teacher": {
                "code": course.user_teacher.code if course.user_teacher else None,
                "name": (
                    f"{course.user_teacher.name}"
                    if course.user_teacher
                    else "No asignado"
                ),
                "last_name": (
                    f"{course.user_teacher.last_name}"
                    if course.user_teacher
                    else "No asignado"
                ),
            },
            "students": student_info,
        }
        return Response(course_info)
    except models.Course.DoesNotExist:
        return Response(
            {"error": "Curso no encontrado"}, status=status.HTTP_404_NOT_FOUND
        )


# No es importante
@api_view(["GET"])
def list_user_teachers(request):
    teachers = User.objects.filter(role=User.TEACHER)
    serializer = UserSerializer(teachers, many=True)
    return Response(serializer.data)


# Luisa
# Deshabilitar estudiante de un curso
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def unregister_student(request, course_code):
    student_code = request.query_params.get("user_code")

    # Obtiene el estudiante usando el código del estudiante proporcionado
    student = get_object_or_404(Student, user__code=student_code)

    # Obtiene el curso usando el código del curso proporcionado
    course = get_object_or_404(Course, code=course_code)

    # Verifica si el estudiante está inscrito en el curso
    if course not in student.courses_user_student.all():
        return Response(
            {"message": "El estudiante no está inscrito en este curso"},
            status=status.HTTP_404_NOT_FOUND,
        )

    # Verifica si el estudiante ha completado alguna evaluación en el curso
    has_completed_evaluation = EvaluationCompleted.objects.filter(
        Q(evaluated=student) & Q(evaluation__course=course) & Q(completed=True)
    ).exists()

    if has_completed_evaluation:
        return Response(
            {
                "message": "El estudiante ya ha completado una evaluación en este curso y no puede deshabilitarse"
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Elimina la relación entre el estudiante y el curso específico
    student.courses_user_student.remove(course)
    course.user_students.remove(student)

    # Deshabilita al estudiante del curso en todos los grupos
    groups = course.groups.all()
    for group in groups:
        if student in group.students.all():
            group.students.remove(student)

    return Response(
        {"message": "Estudiante deshabilitado del curso y grupos correctamente"},
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def enable_student(request, course_code):
    data = request.data
    student_code = data.get("code")

    # Obtiene el estudiante usando el código del estudiante proporcionado
    student = get_object_or_404(Student, user__code=student_code)

    # Obtiene el curso usando el código del curso proporcionado
    course = get_object_or_404(Course, code=course_code)

    # Verifica si el estudiante ya está inscrito en el curso
    if course in student.courses_user_student.all():
        return Response(
            {"message": "El estudiante ya está inscrito en este curso"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Vuelve a habilitar al estudiante para el curso
    student.courses_user_student.add(course)

    return Response(
        {"message": "Estudiante habilitado en el curso correctamente"},
        status=status.HTTP_200_OK,
    )


# Luisa
# informacion completa de la rubrica
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def info_rubric(request, rubric_id):
    try:
        rubric = Rubric.objects.get(id=rubric_id)
    except Rubric.DoesNotExist:
        return Response(
            {"error": "Rúbrica no encontrada."}, status=status.HTTP_404_NOT_FOUND
        )

    serializer = InfoRubricSerializer(rubric)
    return Response(serializer.data, status=status.HTTP_200_OK)


# Luisa
# Obtener rubricas profesor
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_teacher_rubrics(request):
    user = request.user

    if user.role != User.TEACHER:
        return Response(
            {"error": "El usuario no es un profesor"}, status=status.HTTP_403_FORBIDDEN
        )

    courses = Course.objects.filter(user_teacher=user)
    rubrics = Rubric.objects.filter(courses__in=courses).distinct()

    if not rubrics.exists():
        return Response(
            {"message": "No se encuentran rubricas para el profesor"},
            status=status.HTTP_200_OK,
        )

    serializer = RubricSerializer(rubrics, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# Luisa
# Evaluaciones disponibles para que el estudiante las realice
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def available_evaluations(request):
    student_code = request.query_params.get("student_code")
    if not student_code:
        return Response(
            {"error": "No se proporcionó el código del estudiante."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        # Obtener el estudiante por código
        student = Student.objects.get(user__code=student_code)
    except Student.DoesNotExist:
        return Response(
            {"error": "Estudiante no encontrado."}, status=status.HTTP_404_NOT_FOUND
        )

    # Filtrar las evaluaciones que están en estado "iniciado" para el estudiante
    evaluations = Evaluation.objects.filter(
        course__user_students=student, estado=Evaluation.INITIATED
    )

    # Preparar los datos para la respuesta
    data = [EvaluationSerializerE(evaluation).data for evaluation in evaluations]

    return Response(
        {"data": data}, status=status.HTTP_200_OK
    )

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def rubric_evaluate(request):
    course_code = request.query_params.get("course_code")
    if not course_code:
        return Response(
            {"error": "No se proporcionó el código del curso."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        # Obtener el curso por código
        course = Course.objects.get(code=course_code)
    except Course.DoesNotExist:
        return Response(
            {"error": "Curso no encontrado."}, status=status.HTTP_404_NOT_FOUND
        )

    try:
        # Obtener la evaluación que está en estado "iniciado" para el curso
        evaluation = Evaluation.objects.get(course=course, estado=Evaluation.INITIATED)
    except Evaluation.DoesNotExist:
        return Response(
            {"error": "No se encontró una evaluación en estado 'iniciado' para el curso."},
            status=status.HTTP_404_NOT_FOUND
        )

    # Serializar la evaluación
    evaluation_serializer = EvaluationSerializerE(evaluation)

    return Response(
        {"data": evaluation_serializer.data}, status=status.HTTP_200_OK
    )




# Luisa
# Muestra al estudiante las evaluaciones finalizadas
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def completed_evaluations(request):
    student_code = request.query_params.get("student_code")
    course_code = request.query_params.get("course_code")
    if not student_code or not course_code:
        return Response(
            {"error": "No se proporcionó el código del estudiante o del curso."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        # Obtener el estudiante y el curso por código
        student = Student.objects.get(user__code=student_code)
        course = Course.objects.get(code=course_code)
    except (Student.DoesNotExist, Course.DoesNotExist):
        return Response(
            {"error": "Estudiante o curso no encontrado."},
            status=status.HTTP_404_NOT_FOUND,
        )

    # Filtrar las evaluaciones que están en estado "finalizado" para el estudiante en el curso
    evaluations = Evaluation.objects.filter(
        course=course, course__user_students=student, estado=Evaluation.FINISHED
    )

    # Preparar los datos para la respuesta
    data = [EvaluationSerializerE(evaluation).data for evaluation in evaluations]

    return Response(
        {"data": data}, status=status.HTTP_200_OK
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def import_student(request):
    csv_file = request.FILES["csv_file"]
    course_code = request.GET.get("course_code")
    if not course_code:
        return Response(
            {"message": "El código del curso es obligatorio"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        course = Course.objects.get(code=course_code)
    except Course.DoesNotExist:
        return Response(
            {"message": "Curso no encontrado"}, status=status.HTTP_404_NOT_FOUND
        )

    decoded_file = csv_file.read().decode("utf-8")
    io_string = io.StringIO(decoded_file)

    # Detectar el delimitador utilizado en el archivo CSV
    sniffer = csv.Sniffer()
    dialect = sniffer.sniff(io_string.read(1024))
    io_string.seek(0)

    reader = csv.reader(io_string, delimiter=dialect.delimiter)
    next(reader)  # Saltar la cabecera del CSV

    omitted_students = []

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
                {"error": "El archivo CSV tiene un formato incorrecto"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validaciones
        # if not student_data["name"].isalpha():
        #     return Response({"message": "El nombre debe ser solo letras"}, status=status.HTTP_400_BAD_REQUEST)
        # if not student_data["last_name"].isalpha():
        #     return Response({"message": "El apellido debe ser solo letras"}, status=status.HTTP_400_BAD_REQUEST)
        if not student_data["code"].isdigit() or int(student_data["code"]) <= 0:
            return Response(
                {"error": "El código debe ser solo números mayores a cero"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            serializers.EmailField().run_validation(student_data["email"])
        except serializers.ValidationError:
            return Response(
                {"error": "El email debe seguir el formato correcto (@email.co)"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            student = Student.objects.get(user__code=student_data["code"])
        except Student.DoesNotExist:
            password = User.default_password(
                student_data["name"], student_data["code"], student_data["last_name"]
            )
            user_data = student_data.copy()
            user_data["role"] = User.STUDENT
            user_data["password"] = password
            user_serializer = UserSerializer(data=user_data)
            if user_serializer.is_valid():
                user = user_serializer.save()
                student = Student.objects.create(user=user)
            else:
                return Response(
                    user_serializer.errors, status=status.HTTP_400_BAD_REQUEST
                )

        if course not in student.courses_user_student.all():
            student.courses_user_student.add(course)
        else:
            omitted_students.append(
                f"{student_data['name']} {student_data['last_name']}"
            )

    message = "Estudiantes importados exitosamente."
    if omitted_students:
        message += " Sin embargo, se han omitido estudiantes repetidos."

    return Response(
        {"message": message},
        status=status.HTTP_201_CREATED,
    )



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def import_teacher(request):
    csv_file = request.FILES["csv_file"]
    decoded_file = csv_file.read().decode("utf-8")
    io_string = io.StringIO(decoded_file)

    # Detectar el delimitador utilizado en el archivo CSV
    sniffer = csv.Sniffer()
    dialect = sniffer.sniff(io_string.read(1024))
    io_string.seek(0)

    reader = csv.reader(io_string, delimiter=dialect.delimiter)
    next(reader)  # Saltar la cabecera del CSV

    omitted_teachers = []

    for row in reader:
        try:
            teacher_data = {
                "name": row[0],
                "last_name": row[1],
                "code": row[2],
                "email": row[3],
                "phone": row[4] if len(row) > 4 else None,  # phone es opcional
            }
        except IndexError:
            return Response(
                {"error": "El archivo CSV tiene un formato incorrecto"},
                status=status.HTTP_400_BAD_REQUEST,
            )


        try:
            user = User.objects.get(code=teacher_data["code"])
            omitted_teachers.append(
                f"{teacher_data['name']} {teacher_data['last_name']}"
            )
        except User.DoesNotExist:
            user_data = teacher_data.copy()
            user_data["role"] = User.TEACHER
            user_data["password"] = User.default_password(
                teacher_data["name"], teacher_data["code"], teacher_data["last_name"]
            )
            user_serializer = UserSerializer(data=user_data)

            if user_serializer.is_valid():
                user = user_serializer.save()
                Teacher.objects.create(user=user, phone=teacher_data["phone"])
            else:
                return Response(
                    user_serializer.errors, status=status.HTTP_400_BAD_REQUEST
                )

    message = "Profesores importados exitosamente."
    if omitted_teachers:
        message += " Sin embargo, se han omitido profesores repetidos."

    return Response(
        {"message": message},
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
            course_id = data.get("course_id")
            course = Course.objects.get(id=course_id)
            if course in student.course_set.all():
                return Response(
                    {"message": "El estudiante ya esta en este curso"},
                    status=status.HTTP_409_CONFLICT,
                )
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
            return Response(
                serializer_student.errors, status=status.HTTP_400_BAD_REQUEST
            )

    # Obtiene el curso
    try:
        course = Course.objects.get(code=course_code)
    except Course.DoesNotExist:
        return Response(
            {"message": "Curso no encontrado"}, status=status.HTTP_404_NOT_FOUND
        )

    # Verifica si el estudiante ya está en el curso
    if course in student.courses_user_student.all():
        return Response(
            {"message": "El estudiante ya está en este curso"},
            status=status.HTTP_409_CONFLICT,
        )

    # Agrega el estudiante al curso
    student.courses_user_student.add(course)
    course.user_students.add(student)

    return Response(
        {"message": "Estudiante agregado exitosamente"}, status=status.HTTP_201_CREATED
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def register_student_params(request):
    data = request.data
    course_id = data.get("course")
    if not course_id:
        return Response(
            {"error": "ID del curso no proporcionado."},
            status=status.HTTP_400_BAD_REQUEST,
        )

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
            return Response(
                serializer_student.errors, status=status.HTTP_400_BAD_REQUEST
            )

    # Obtiene el curso
    course = Course.objects.get(code=course_id)

    # Verifica si el estudiante ya está en el curso
    if course in student.courses_user_student.all():
        return Response(
            {"message": "El estudiante ya esta en este curso"},
            status=status.HTTP_409_CONFLICT,
        )

    # Agrega el estudiante al curso
    student.courses_user_student.add(course)
    course.user_students.add(student)

    return Response(
        {"message": "Estudiante agregado exitosamente"}, status=status.HTTP_201_CREATED
    )


# Luisa
# Edita estudainte
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_student(request):
    student_code = request.query_params.get("student_code")

    if not student_code:
        return Response(
            {"error": "El parámetro 'student_code' es requerido en la URL."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        user = User.objects.get(code=student_code)
    except User.DoesNotExist:
        return Response(
            {"error": "Estudiante no encontrado"}, status=status.HTTP_404_NOT_FOUND
        )

    data = request.data
    user_data = {
        "name": data.get("name", user.name),
        "last_name": data.get("last_name", user.last_name),
        "code": data.get("code", user.code),
        "email": data.get("email", user.email),
    }

    try:
        validate_name(user_data["name"])
        validate_name(user_data["last_name"])
        validate_code(user_data["code"])
        validate_email(user_data["email"])
    except serializers.ValidationError as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    serializer_user = UserSerializer(instance=user, data=user_data, partial=True)
    if serializer_user.is_valid():
        serializer_user.save()
        return Response(
            {
                "message": "Estudiante actualizado exitosamente",
                "data": serializer_user.data,
            },
            status=status.HTTP_200_OK,
        )
    return Response(
        {"error": serializer_user.errors}, status=status.HTTP_400_BAD_REQUEST
    )


# crea la escala de la rubrica
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def scale_rubric(request):
    upper_limit = int(request.data.get("upper_limit"))
    lower_limit = 1  # limite inferior es 1

    scale = Scale.objects.create(Upper_limit=upper_limit, Lower_limit=lower_limit)

    return Response(
        {"message": f"Escala creada con éxito con ID {scale.id}."},
        status=status.HTTP_201_CREATED,
    )


# el profesor crea la rubrica
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_rubric1(request, course_id):
    #  print(request.data)
    #  print(f"course_id: {course_id}")
    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return Response(
            {"error": "Curso no encontrado."}, status=status.HTTP_404_NOT_FOUND
        )

    request.data["courses"] = [course_id]
    serializer = RubricSerializer(data=request.data)
    if serializer.is_valid():
        rubric = serializer.save()
        return Response(
            {
                "message": f"Rúbrica creada con éxito con ID {rubric.id} y asociada al curso {course.name}."
            },
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Luisa
# Editar rubrica global
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_global_rubric(request):
    try:
        rubric_id = request.query_params.get("rubric_id")
        rubric = Rubric.objects.get(pk=rubric_id, is_global=True)
    except Rubric.DoesNotExist:
        return Response(
            {"error": "Rúbrica global no encontrada."}, status=status.HTTP_404_NOT_FOUND
        )

    rubric_data = request.data

    # Actualizar el nombre de la rúbrica si se proporciona
    if "name" in rubric_data:
        rubric.name = rubric_data["name"]

    # Actualizar la escala de la rúbrica si se proporciona
    if "scale" in rubric_data:
        scale_data = rubric_data["scale"]
        scale_serializer = ScaleSerialiazer(rubric.scale, data=scale_data)
        if scale_serializer.is_valid():
            scale_serializer.save()
        else:
            return Response(
                {
                    "error": "Error al actualizar la escala.",
                    "details": scale_serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

    # Actualizar los estándares de la rúbrica
    if "standards" in rubric_data:
        standards_data = rubric_data["standards"]
        existing_standard_ids = [standard.id for standard in rubric.standards.all()]
        updated_standards = []

        for standard_data in standards_data:
            if "id" in standard_data:
                # Si el estándar ya existe, actualizarlo
                try:
                    standard = Standard.objects.get(pk=standard_data["id"])
                    standard.description = standard_data.get(
                        "description", standard.description
                    )
                    standard.scale_description = standard_data.get(
                        "scale_description", standard.scale_description
                    )
                    standard.save()
                    updated_standards.append(standard)
                except Standard.DoesNotExist:
                    return Response(
                        {
                            "error": f'No se encontró el estándar con id {standard_data["id"]}.'
                        },
                        status=status.HTTP_404_NOT_FOUND,
                    )
            else:
                # Si no tiene ID, es un nuevo estándar que se va a crear
                standard_serializer = StandardSerializer(data=standard_data)
                if standard_serializer.is_valid():
                    standard = standard_serializer.save(rubric=rubric)
                    updated_standards.append(standard)
                else:
                    return Response(
                        {
                            "error": "Error al crear un nuevo estándar.",
                            "details": standard_serializer.errors,
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

        # Eliminar estándares que ya no están en la nueva lista
        for standard_id in existing_standard_ids:
            if standard_id not in [std.id for std in updated_standards]:
                Standard.objects.get(pk=standard_id).delete()

        # Asignar los estándares actualizados a la rúbrica
        rubric.standards.set(updated_standards)

    # Guardar la rúbrica actualizada
    rubric.save()

    # Serializar y devolver la rúbrica actualizada
    rubric_serializer = GlobalRubricSerializer(rubric)
    return Response(
        {
            "message": "Rúbrica global actualizada con éxito.",
            "rubric": rubric_serializer.data,
        },
        status=status.HTTP_200_OK,
    )


# Luisa
# Mostrar rubrica global al administrador
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_global_rubric(request, rubric_id):
    try:
        rubric = Rubric.objects.get(id=rubric_id, is_global=True)
    except Rubric.DoesNotExist:
        return Response(
            {"error": "La rúbrica global solicitada no existe."},
            status=status.HTTP_404_NOT_FOUND,
        )

    rubric_serializer = GlobalRubricSerializer(rubric)
    return Response(rubric_serializer.data, status=status.HTTP_200_OK)


# Luisa
# Crear rubrica global
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_global_rubric(request):
    rubric_data = request.data

    # Crear la escala primero
    scale_serializer = ScaleSerialiazer(data=rubric_data.get("scale"))
    if scale_serializer.is_valid():
        scale = scale_serializer.save()
    else:
        return Response(
            {"error": "Error al crear la escala.", "details": scale_serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Crear los estándares (criterios) asociados a la escala
    standards_data = rubric_data.get("standards")
    standards = []
    for standard_data in standards_data:
        standard_data["scale"] = scale.id  # Asociar la escala a cada estándar
        standard_serializer = StandardSerializer(data=standard_data)
        if standard_serializer.is_valid():
            standard = standard_serializer.save()
            standards.append(standard)
        else:
            return Response(
                {
                    "error": "Error al crear un estándar.",
                    "details": standard_serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

    # Crear la rúbrica global sin asociar cursos aún
    rubric_creation_data = {
        "name": rubric_data.get("name"),
        "scale": scale.id,
        "standards": [standard.id for standard in standards],  # Asociar los estándares
        "is_global": True,  # Establecer is_global en True
    }
    rubric_serializer = GlobalRubricSerializer(data=rubric_creation_data)
    if rubric_serializer.is_valid():
        rubric = rubric_serializer.save()

        # Asociar la rúbrica a todos los cursos
        all_courses = Course.objects.all()
        for course in all_courses:
            course.rubrics.add(rubric)

        return Response(
            {
                "message": "Rúbrica global creada y asignada a todos los cursos con éxito.",
                "rubric": rubric_serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )
    else:
        return Response(
            {
                "error": "Error al crear la rúbrica global.",
                "details": rubric_serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_rubric(request):
    course_code = request.query_params.get("course_code")
    try:
        course = Course.objects.get(code=course_code)
    except Course.DoesNotExist:
        return Response(
            {"error": "Curso no encontrado."}, status=status.HTTP_404_NOT_FOUND
        )

    rubric_data = request.data

    # Crear la escala primero
    scale_data = rubric_data.get("scale")
    scale_serializer = ScaleSerialiazer(data=scale_data)
    if scale_serializer.is_valid():
        scale = scale_serializer.save()
    else:
        return Response(scale_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Crear los estándares (criterios)
    standards_data = rubric_data.get("standards")
    standards = []
    for standard_data in standards_data:
        standard_data["rubric"] = scale.id  # Asociar la escala a cada estándar
        standard_serializer = StandardSerializer(data=standard_data)
        if standard_serializer.is_valid():
            standard = standard_serializer.save()
            standards.append(standard)
        else:
            return Response(
                standard_serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )

    # Crear la rúbrica y asociar la escala y los estándares
    rubric_data = {
        "name": rubric_data.get("name"),
        "scale": scale.id,
        "courses": [course.id],
        "standards": [standard.id for standard in standards],
    }
    rubric_serializer = RubricSerializer(data=rubric_data)
    if rubric_serializer.is_valid():
        rubric_serializer.save()
        return Response(
            {
                "message": f"Rúbrica, escala y estándares creados con éxito y asociados al curso {course.name}."
            },
            status=status.HTTP_201_CREATED,
        )
    else:
        return Response(rubric_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Luisa
# Editar rubrica
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_rubric(request):
    try:
        rubric_id = request.query_params.get("rubric_id")
        rubric = Rubric.objects.get(pk=rubric_id)
    except Rubric.DoesNotExist:
        return Response(
            {"error": "Rúbrica no encontrada."}, status=status.HTTP_404_NOT_FOUND
        )

    # Verificar si la rúbrica ha sido usada en alguna evaluación
    if Evaluation.objects.filter(rubric=rubric).exists():
        return Response(
            {
                "error": "No se puede modificar la rúbrica porque ya ha sido utilizada en una evaluación."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    rubric_data = request.data

    # Verificar si la rúbrica es global
    if rubric.is_global:
        # Crear una nueva rúbrica basada en la original pero con los cambios aplicados
        new_rubric = Rubric.objects.create(
            name=rubric_data.get("name", rubric.name), scale=rubric.scale
        )
        new_rubric.is_global = False  # La nueva rúbrica no es global

        # Clonar y actualizar los estándares
        standards_data = rubric_data.get("standards", [])
        for standard in rubric.standards.all():
            new_standard = Standard.objects.create(
                description=standard.description,
                rubric=new_rubric,
                scale_description=standard.scale_description,
            )

        for standard_data in standards_data:
            standard_serializer = StandardSerializer(data=standard_data)
            if standard_serializer.is_valid():
                new_standard = standard_serializer.save(rubric=new_rubric)
            else:
                return Response(
                    standard_serializer.errors, status=status.HTTP_400_BAD_REQUEST
                )

        new_rubric.save()
        # Asociar la nueva rúbrica a los cursos que tenía la original
        for course in rubric.courses.all():
            course.rubrics.add(new_rubric)

        rubric_serializer = RubricSerializer(new_rubric)
        return Response(rubric_serializer.data, status=status.HTTP_201_CREATED)
    else:
        # Si la rúbrica no es global, actualizar la rúbrica existente
        if "name" in rubric_data:
            rubric.name = rubric_data["name"]

        if "scale" in rubric_data:
            scale_data = rubric_data["scale"]
            scale_serializer = ScaleSerialiazer(data=scale_data)
            if scale_serializer.is_valid():
                scale = scale_serializer.save()
                rubric.scale = scale
            else:
                return Response(
                    scale_serializer.errors, status=status.HTTP_400_BAD_REQUEST
                )

        if "standards" in rubric_data:
            standards_data = rubric_data["standards"]
            updated_standards = []

            for standard_data in standards_data:
                if "id" in standard_data:
                    try:
                        standard = Standard.objects.get(pk=standard_data["id"])
                        standard.description = standard_data.get(
                            "description", standard.description
                        )
                        standard.scale_description = standard_data.get(
                            "scale_description", standard.scale_description
                        )
                        standard.save()
                        updated_standards.append(standard)
                    except Standard.DoesNotExist:
                        return Response(
                            {
                                "error": f'No se encontró el estándar con id {standard_data["id"]}.'
                            },
                            status=status.HTTP_404_NOT_FOUND,
                        )
                else:
                    standard_serializer = StandardSerializer(data=standard_data)
                    if standard_serializer.is_valid():
                        standard = standard_serializer.save(rubric=rubric)
                        updated_standards.append(standard)
                    else:
                        return Response(
                            standard_serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST,
                        )

            rubric.standards.set(updated_standards)

        rubric.save()
        rubric_serializer = RubricSerializer(rubric)
        return Response(rubric_serializer.data, status=status.HTTP_200_OK)


# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def create_rubric(request, course_code, scale_id):
#     try:
#         course = Course.objects.get(code=course_code)
#     except Course.DoesNotExist:
#         return Response({'error': 'Curso no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

#     # Asegúrate de que la escala exista
#     try:
#         scale = Scale.objects.get(id=scale_id)
#     except Scale.DoesNotExist:
#         return Response({'error': 'Escala no encontrada.'}, status=status.HTTP_404_NOT_FOUND)

#     # Crear los estándares primero
#     standard_data = request.data.get('standard')
#     standard = []
#     for standard_data in standard_data:
#         standard_serializer = StandardSerializer(data=standard_data)
#         if standard_serializer.is_valid():
#             standard = standard_serializer.save()
#             standard.append(standard)
#         else:
#             return Response(standard_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     # Crear la rúbrica y asociar los estándares a ella
#     rubric_data = {
#         'name': request.data.get('name'),
#         'scale': scale.id,
#         'courses': [course.id],
#         'standard': [standard.id for standard in standard]
#     }
#     rubric_serializer = RubricSerializer(data=rubric_data)
#     if rubric_serializer.is_valid():
#         rubric_serializer.save()
#         return Response({'message': f'Rúbrica y estándares creados con éxito y asociados al curso {course.name}.'}, status=status.HTTP_201_CREATED)
#     else:
#         return Response(rubric_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# crea la evaluacion que se realiza a los estudiantes
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_evaluation(request):
    course_code = request.query_params.get("course_code")
    try:
        course = Course.objects.get(code=course_code)
    except Course.DoesNotExist:
        return Response(
            {"error": "Curso no encontrado."}, status=status.HTTP_404_NOT_FOUND
        )

    data = request.data
    rubric_name = data.get("rubric_name")
    name = data.get("name")
    estado = data.get("estado")

    if not rubric_name or not name or not estado:
        return Response(
            {"error": "Faltan datos necesarios."}, status=status.HTTP_400_BAD_REQUEST
        )

    if estado == Evaluation.FINISHED:
        return Response(
            {"error": "No se puede crear una evaluación en estado finalizado."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if estado == Evaluation.INITIATED:
        initiated_evaluations = Evaluation.objects.filter(
            course=course, estado=Evaluation.INITIATED
        )
        if initiated_evaluations.exists():
            return Response(
                {
                    "error": 'Ya existe una evaluación en estado "iniciado" para este curso.'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

    try:
        rubric = Rubric.objects.get(name=rubric_name)
        if rubric.is_global:
            return Response(
                {"error": "No puede seleccionar una rúbrica global, intente con otra."},
                status=status.HTTP_400_BAD_REQUEST,
            )
    except Rubric.DoesNotExist:
        return Response(
            {"error": "Rúbrica no encontrada."}, status=status.HTTP_404_NOT_FOUND
        )

    evaluation_data = {
        "estado": estado,
        "name": name,
        "rubric": rubric.id,
        "course": course.id,
        "report": None,
        "completed": False,
    }

    serializer = EvaluationSerializer(data=evaluation_data)
    if serializer.is_valid():

        serializer.save()

        return Response(
            {"message": "Evaluación creada con éxito."}, status=status.HTTP_201_CREATED
        )

    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# una evaluacion por iniciar cambia a iniciada
@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def start_evaluation(request):
    evaluation_id = request.query_params.get("evaluation_id")
    if not evaluation_id:
        return Response(
            {"error": "No se proporcionó el ID de la evaluación."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        evaluation = Evaluation.objects.get(id=evaluation_id)
    except Evaluation.DoesNotExist:
        return Response(
            {"error": "Evaluación no encontrada."}, status=status.HTTP_404_NOT_FOUND
        )

    if evaluation.estado != Evaluation.TO_START:
        return Response(
            {"error": 'La evaluación no está en estado "por iniciar".'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    initiated_evaluations = Evaluation.objects.filter(
        course=evaluation.course, estado=Evaluation.INITIATED
    )
    if initiated_evaluations.exists():
        return Response(
            {"error": 'Ya existe una evaluación en estado "iniciado" para este curso.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    evaluation.estado = Evaluation.INITIATED
    evaluation.save()

    return Response(
        {"message": "Evaluación iniciada con éxito."}, status=status.HTTP_200_OK
    )


# una evaluacion iniciada cambia a finalizada
@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def finish_evaluation(request):
    evaluation_id = request.query_params.get("evaluation_id")
    if not evaluation_id:
        return Response(
            {"error": "No se proporcionó el ID de la evaluación."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        evaluation = Evaluation.objects.get(id=evaluation_id)
    except Evaluation.DoesNotExist:
        return Response(
            {"error": "Evaluación no encontrada."}, status=status.HTTP_404_NOT_FOUND
        )

    if evaluation.estado != Evaluation.INITIATED:
        return Response(
            {"error": 'La evaluación no está en estado "iniciado".'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    evaluation.estado = Evaluation.FINISHED
    evaluation.save()

    return Response(
        {"message": "Evaluación finalizada con éxito."}, status=status.HTTP_200_OK
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_rubric_params(request):
    course_id = request.GET.get("course")
    scale_id = request.GET.get("scale")

    if not course_id or not scale_id:
        return Response(
            {"error": "ID del curso y de la escala son requeridos."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return Response(
            {"error": "Curso no encontrado."}, status=status.HTTP_404_NOT_FOUND
        )

    try:
        scale = Scale.objects.get(id=scale_id)
    except Scale.DoesNotExist:
        return Response(
            {"error": "Escala no encontrada."}, status=status.HTTP_404_NOT_FOUND
        )

    # Crear los estándares primero
    standards_data = request.data.get("standards")
    standards = []
    for standard_data in standards_data:
        standard_serializer = StandardSerializer(data=standard_data)
        if standard_serializer.is_valid():
            standard = standard_serializer.save()
            standards.append(standard)
        else:
            return Response(
                standard_serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )

    # Crear la rúbrica y asociar los estándares a ella
    rubric_data = {
        "name": request.data.get("name"),
        "scale": scale.id,
        "courses": [course_id],
        "standards": [standard.id for standard in standards],
    }
    rubric_serializer = RubricSerializer(data=rubric_data)
    if rubric_serializer.is_valid():
        rubric_serializer.save()
    else:
        return Response(rubric_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    return Response(
        {
            "message": f"Rúbrica y estándares creados con éxito y asociados al curso {course.name}."
        },
        status=status.HTTP_201_CREATED,
    )


# obtiene la informacion de la rubrica para poder evaluar un estudiante
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_rubric(request, rubric_id):
    try:
        rubric = Rubric.objects.get(id=rubric_id)
    except Rubric.DoesNotExist:
        return Response(
            {"error": "Rúbrica no encontrada."}, status=status.HTTP_404_NOT_FOUND
        )

    serializer = RubricDetailSerializer(rubric)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_rubric_params(request):
    rubric_id = request.GET.get("rubric")
    if not rubric_id:
        return Response(
            {"error": "ID de la rúbrica no proporcionado."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        rubric = Rubric.objects.get(id=rubric_id)
    except Rubric.DoesNotExist:
        return Response(
            {"error": "Rúbrica no encontrada."}, status=status.HTTP_404_NOT_FOUND
        )

    serializer = RubricDetailSerializer(rubric)
    return Response(serializer.data)


# obtener la informacion de todas las rubricas que tiene un curso
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

    # Validaciones
    name = data.get("name")
    last_name = data.get("last_name")
    code = data.get("code")
    email = data.get("email")
    phone = data.get("phone")

    # Validar que el nombre y apellido sean solo letras
    if not name.isalpha():
        return Response(
            {"error": "El nombre debe ser solo letras"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    if not last_name.isalpha():
        return Response(
            {"error": "El apellido debe ser solo letras"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Validar que el código sean solo números mayores a cero
    if not code.isdigit() or int(code) <= 0:
        return Response(
            {"error": "El código debe ser solo números mayores a cero"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Validar que el email siga el formato correcto
    try:
        serializers.EmailField().run_validation(email)
    except serializers.ValidationError:
        return Response(
            {"error": "El email debe seguir el formato correcto (@email.co)"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Validar que el teléfono sean solo números mayores a cero (si se proporciona)
    if phone is not None:
        if not phone.isdigit() or int(phone) <= 0:
            return Response(
                {"error": "El teléfono debe ser solo números mayores a cero"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    admin_data = {
        "name": name,
        "last_name": last_name,
        "code": code,
        "email": email,
        "phone": phone,
        "password": password,
    }

    serializer_admin = AdminSerializer(data=admin_data)
    if serializer_admin.is_valid():
        try:
            serializer_admin.save()
            return Response(
                {"message": "Administrador creado exitosamente"},
                status=status.HTTP_201_CREATED,
            )
        except:
            return Response(
                {"message": "Un administrador con esta cedula ya existe"},
                status=status.HTTP_409_CONFLICT,
            )
    return Response(
        {"error": "Error al crear administrador"}, status=status.HTTP_400_BAD_REQUEST
    )


from django.core.validators import RegexValidator
from rest_framework import serializers

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def register_teacher(request):
    data = request.data
    password = User.default_password(
        data.get("name"), data.get("code"), data.get("last_name")
    )

    # Validaciones
    name = data.get("name")
    last_name = data.get("last_name")
    code = data.get("code")
    email = data.get("email")
    phone = data.get("phone")

    # Validar que el nombre y apellido sean solo letras
    if not name.isalpha():
        return Response({"message": "El nombre debe ser solo letras"}, status=status.HTTP_400_BAD_REQUEST)
    if not last_name.isalpha():
        return Response({"message": "El apellido debe ser solo letras"}, status=status.HTTP_400_BAD_REQUEST)

    # Validar que el código sean solo números mayores a cero
    if not code.isdigit() or int(code) <= 0:
        return Response({"message": "El código debe ser solo números mayores a cero"}, status=status.HTTP_400_BAD_REQUEST)

    # Validar que el email siga el formato correcto
    try:
        serializers.EmailField().run_validation(email)
    except serializers.ValidationError:
        return Response({"message": "El email debe seguir el formato correcto (@email.co)"}, status=status.HTTP_400_BAD_REQUEST)

    # Validar que el teléfono sean solo números mayores a cero
    # if not phone.isdigit() or int(phone) <= 0:
    #     return Response({"message": "El teléfono debe ser solo números mayores a cero"}, status=status.HTTP_400_BAD_REQUEST)

    teacher_data = {
        "name": name,
        "last_name": last_name,
        "code": code,
        "email": email,
        "phone": phone,
        "password": password,
    }

    serializer_teacher = TeacherSerializer(data=teacher_data)
    if serializer_teacher.is_valid():
        try:
            serializer_teacher.save()
            return Response(
                {"message": "Profesor creado exitosamente"},
                status=status.HTTP_201_CREATED,
            )
        except:
            return Response(
                {"message": "Un profesor con esta cedula ya existe"},
                status=status.HTTP_409_CONFLICT,
            )
    return Response(
        {"error": "Error al crear profesor"}, status=status.HTTP_400_BAD_REQUEST
    )


# Luisa
# obtener estudiantes de mi grupo
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def group_members(request):
    student_code = request.query_params.get("student_code")
    course_code = request.query_params.get("course_code")

    if not student_code or not course_code:
        return Response(
            {"error": "Falta student_code o course_code"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        # Obtener el estudiante usando el código
        student = Student.objects.get(user__code=student_code)
    except Student.DoesNotExist:
        return Response(
            {"error": "El estudiante no existe"}, status=status.HTTP_404_NOT_FOUND
        )

    try:
        # Obtener el curso usando el código
        course = Course.objects.get(code=course_code)
    except Course.DoesNotExist:
        return Response(
            {"error": "El curso no existe"}, status=status.HTTP_404_NOT_FOUND
        )

    try:
        # Obtener el grupo al que pertenece el estudiante en el curso específico
        group = Group.objects.get(students=student, course=course)
    except Group.DoesNotExist:
        return Response(
            {"error": "El estudiante no es miembro de ningún grupo en este curso"},
            status=status.HTTP_404_NOT_FOUND,
        )

    # Obtener los integrantes del grupo
    group_members = group.students.all()

    # Filtrar los miembros del grupo que aún no han sido evaluados por el estudiante y que no son el estudiante que hace la solicitud
    group_members = [member for member in group_members if member != student and not EvaluationCompleted.objects.filter(evaluated=member, evaluator=student, evaluation__course=course, completed=True).exists()]

    serializer = StudentSerializer(group_members, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# obtener estudiantes del grupo
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def group_members_no(request, student_id):
    try:
        student = Student.objects.get(pk=student_id)
    except Student.DoesNotExist:
        return Response(
            {"error": "Student does not exist"}, status=status.HTTP_404_NOT_FOUND
        )

    # Obtener el grupo al que pertenece el estudiante
    try:
        group = Group.objects.get(students=student)
    except Group.DoesNotExist:
        return Response(
            {"error": "Student is not a member of any group"},
            status=status.HTTP_404_NOT_FOUND,
        )

    # Obtener los integrantes del grupo
    group_members = group.students.all()
    serializer = StudentSerializer(group_members, many=True)
    return Response(serializer.data)


@api_view(["GET"])
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


# Luisa
# Lista de estudiantes que no pertenecen a un grupo
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
        return Response(
            {"error": "Curso no encontrado"}, status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        print(f"Error inesperado: {str(e)}")
        return Response(
            {"error": "Error inesperado"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# Luisa
# Creación del grupo
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_group(request, course_code):
    try:
        print("Buscando curso...")
        course = Course.objects.get(code=course_code)
        print("Curso encontrado:", course)
    except Course.DoesNotExist:
        print("Curso no encontrado")
        return Response(
            {"error": "Curso no encontrado"}, status=status.HTTP_404_NOT_FOUND
        )

    student_codes = request.data.get(
        "student_codes", []
    )  # Obtener los códigos de estudiante de la solicitud POST
    request.data["students"] = student_codes

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
        return Response(
            {"message": "Grupo creado correctamente"}, status=status.HTTP_201_CREATED
        )
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# evalua a un estudiante
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def evaluate_student(request):
    data = request.data
    try:
        evaluation = Evaluation.objects.get(id=data.get("id_evaluation"))
    except Evaluation.DoesNotExist:
        return Response(
            {"error": "No se encontró una evaluación pendiente."},
            status=status.HTTP_404_NOT_FOUND,
        )

    standards = evaluation.rubric.standards.all()

    evaluation_completed = EvaluationCompleted(
        evaluated=get_object_or_404(Student, user__code=data.get("evaluated")),
        evaluator=get_object_or_404(Student, user__code=data.get("evaluator")),
        evaluation=evaluation,
    )

    evaluation_completed.save()

    for standard in standards:
        score = request.data.get(str(standard.id))  # Buscar la calificación en el objeto principal
        if score is not None:
            rating_data = {
                "standard": standard.id,
                "evaluationCompleted": evaluation_completed.id,
                "qualification": int(score),
            }
            rating_serializer = RatingSerializer(data=rating_data)
            if rating_serializer.is_valid():
                rating_serializer.save()
            else:
                return Response(
                    rating_serializer.errors, status=status.HTTP_400_BAD_REQUEST
                )

    comment = request.data.get("comment")
    if comment:
        evaluation_completed.comment = comment

    evaluation_completed.completed = True

    evaluation_completed.evaluated = get_object_or_404(
        Student, user__code=data.get("evaluated")
    )

    evaluation_completed.evaluator = get_object_or_404(
        Student, user__code=data.get("evaluator")
    )

    evaluation_completed.save()

    return Response(
        {"message": "Evaluación completada con éxito."}, status=status.HTTP_200_OK
    )


# obtiene la nota definitiva de un estudiante en especifico y sus compañeros estan en anonimo
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def evaluation_results(request):
    student_code = request.GET.get("student_code")
    evaluation_id = request.GET.get("evaluation_id")

    try:
        student = Student.objects.get(user__code=student_code)
        evaluation = Evaluation.objects.get(id=evaluation_id)
    except (Student.DoesNotExist, Evaluation.DoesNotExist):
        return Response(
            {"error": "Estudiante o evaluación no encontrado."},
            status=status.HTTP_404_NOT_FOUND,
        )

    evaluation_completed_list = EvaluationCompleted.objects.filter(
        evaluated=student, evaluation=evaluation
    )

    if not evaluation_completed_list.exists():
        return Response(
            {"error": "No hay evaluaciones completadas para este estudiante."},
            status=status.HTTP_404_NOT_FOUND,
        )

    results = []
    total_score = 0
    total_standards = 0
    all_comments = []
    group_students = evaluation.course.user_students.exclude(user__code=student_code)
    num_group_students = group_students.count()

    for standard in evaluation.rubric.standards.all():
        ratings = Rating.objects.filter(
            evaluationCompleted__in=evaluation_completed_list, standard=standard
        )
        num_ratings = ratings.count()
        sum_ratings = sum(rating.qualification for rating in ratings)
        average_rating = sum_ratings / num_ratings if num_ratings > 0 else 0
        total_score += average_rating
        total_standards += 1

        individual_ratings = [rating.qualification for rating in ratings]
        # Agregar ceros para los estudiantes que no calificaron
        individual_ratings += [0] * (num_group_students - num_ratings)

        results.append(
            {
                "standard_description": standard.description,
                "average_rating": average_rating,
                "individual_ratings": individual_ratings,
            }
        )

    final_score = total_score / total_standards if total_standards > 0 else 0

    # Concatenar comentarios
    for ec in evaluation_completed_list:
        if ec.comment:
            all_comments.append(ec.comment)

    comments = "\n".join(all_comments)

    return Response(
        {
            "final_score": final_score,
            "standards": results,
            "comments": comments,
            "total_count": total_standards,
            "total_ratings_count": num_group_students,
        }
    )


# muestra la lista de grupos de ese curso
@api_view(["GET"])
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


# muestra la informacion de un grupo
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def group_detail(request, course_code, group_id):
    group = get_object_or_404(Group, id=group_id, course__code=course_code)

    student_data = [
        {
            "student_code": student.user.code,
            "student_name": f"{student.user.name} {student.user.last_name}",
            "student_email": student.user.email,
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

    # Excluir al usuario actualmente autenticado
    users = User.objects.exclude(id=request.user.id)

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
        course = Course.objects.get(code=course_id)
    except Course.DoesNotExist:
        return Response(
            {"error": "No exite un curso con el codigo proporcionado."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    students = course.user_students.all()

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
                "course_status": course.course_status,
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
    user = request.user

    try:
        courses = Course.objects.filter(user_teacher=user.id)
    except Course.DoesNotExist:
        return Response(
            {"status": "El docente actualmente no tiene cursos"},
            status=status.HTTP_400_BAD_REQUEST,
        )

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
                "students": list(students),
                "academic_period": course.academic_period,
            }
        )
    return Response(course_data)
    # else:
    return Response(
        {"status": "El docente actualmente no tiene cursos"},
        status=status.HTTP_400_BAD_REQUEST,
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


# Luisa
# Editar curso ESTE ES
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_course(request):
    data = request.data
    course_code = request.query_params.get("course_code")

    # Eliminando la validación del código del curso
    course = Course.objects.get(code=course_code)

    # Actualiza el campo 'user_teacher' sin validaciones adicionales
    user_teacher_code = data.get("user_teacher")
    if user_teacher_code:
        user = User.objects.get(code=user_teacher_code)
        data["user_teacher"] = user.id

    serializer_course = CourseSerializer(course, data=data, partial=True)
    if serializer_course.is_valid():
        serializer_course.save()
        return Response(
            {"message": "Curso actualizado con éxito", "data": serializer_course.data},
            status=status.HTTP_200_OK,
        )

    return Response(serializer_course.errors, status=status.HTTP_400_BAD_REQUEST)


# Luisa
# Deshabilitar curso con la excepción de que no puede tener evaluaciones en curso
@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def disable_course(request, course_code):
    try:
        course = Course.objects.get(code=course_code)
    except Course.DoesNotExist:
        return Response(
            {"error": "El curso no existe."},
            status=status.HTTP_404_NOT_FOUND,
        )

    # Verificar si el curso tiene evaluaciones en estado 'TO_START' o 'INITIATED'
    evaluations = Evaluation.objects.filter(course=course).filter(
        estado__in=[Evaluation.TO_START, Evaluation.INITIATED]
    )
    if evaluations.exists():
        return Response(
            {
                "error": "El curso no puede ser deshabilitado porque tiene evaluaciones en estado 'Por iniciar' o 'Iniciado'."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Si no tiene evaluaciones en estado 'TO_START' ni 'INITIATED', deshabilitar el curso
    course.course_status = False
    course.save()

    serializer = CourseSerializer(course)
    return Response(
        {"message": "Curso deshabilitado con exito.", "data": serializer.data},
        status=status.HTTP_200_OK,
    )


# Luisa
# Habilitar curso
@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def enable_course(request, course_code):
    try:
        course = Course.objects.get(code=course_code)
    except Course.DoesNotExist:
        return Response(
            {"error": "El curso no existe."},
            status=status.HTTP_404_NOT_FOUND,
        )

    # Habilitar el curso
    course.course_status = True
    course.save()

    serializer = CourseSerializer(course)
    return Response(
        {"message": "Curso habilitado con éxito.", "course": serializer.data},
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_course(request):

    codigo = request.data.get("code")

    try:
        course = Course.objects.get(code=codigo)
    except Course.DoesNotExist:
        course = None

    if course is not None:
        return Response(
            {"error": "Ya existe un curso con este codigo"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    data = request.data

    try:
        user = models.User.objects.get(code=data.get("user_teacher"))
    except User.DoesNotExist:
        return Response(
            {"error": "El código del profesor proporcionado no es válido."},
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

        # if Rubric.objects.filter(name= 'Rubrica Predeterminada').exists:
        # rubric= Rubric.objects.get(name= 'Rubrica Predeterminada')
        # rubric.courses.add(Course.objects.get(code= data.get("code")))

        return Response(
            {"message": "Curso creado con éxito."}, status=status.HTTP_201_CREATED
        )

    return Response(serializer_course.errors, status=status.HTTP_400_BAD_REQUEST)


# deshabilita profe y admin
@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def disable_user(request):
    try:
        user_code = request.GET.get("user_code")
        user = User.search(user_code)

        if user:
            # Verificar si el usuario es un profesor y está asignado a algún curso
            if (
                user.role == User.TEACHER
                and Course.objects.filter(user_teacher=user).exists()
            ):
                return Response(
                    {
                        "error": "El usuario no puede ser deshabilitado porque está asignado a un curso."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user.status = False
            user.save()
            return Response(
                {"message": "Usuario deshabilitado correctamente."},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"error": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND
            )

    except Exception as e:
        return Response(
            {"error": f"Error al deshabilitar el usuario: {e}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


# habilita admin y profesor
@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def enable_user(request):
    try:
        user = User.search(request.GET.get("user_code"))
        if user:
            user.status = True
            user.save()
            return Response(
                {"message": "Usuario habilitado correctamente."},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"error": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND
            )
    except Exception as e:
        return Response(
            {"error": f"Error al habilitar el usuario: {e}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


# @permission_classes([IsAuthenticated])
@api_view(["POST"])
def restore_password(request):
    q = request.data.get("mail", "")
    subject = "Restablecer contraseña"

    longitud_codigo = 6  # Puedes cambiar la longitud del código aquí
    codigo_aleatorio = generar_codigo_alfanumerico(longitud_codigo)
    print("Código alfanumérico aleatorio:", codigo_aleatorio)

    usuario = models.User.objects.get(email=q)

    usuario.set_password(codigo_aleatorio)

    usuario.first_login = True

    usuario.save()

    if models.User.objects.filter(email__icontains=q).exists():
        message = EmailMultiAlternatives(
            subject,  # Titulo
            "Hola, su contraseña temporal es %s " % codigo_aleatorio,
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


def generar_codigo_alfanumerico(longitud):
    caracteres = string.ascii_letters + string.digits
    codigo = "".join(random.choice(caracteres) for _ in range(longitud))
    return codigo


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def main_report(request):
    course_code = request.query_params.get("course_code")
    data = request.data
    try:
        evaluations = Evaluation.objects.filter(course__code=course_code)
    except Evaluation.DoesNotExist:
        return Response(
            {"info": "Aún no existen evaluaciones en este curso"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    evaluation_data = []

    for evaluation in evaluations:

        evaluation_data.append(
            {
                "estado": evaluation.estado,
                "name": evaluation.name,
                "rubric": evaluation.rubric.name,
            }
        )

    return Response(evaluation_data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def report_detailed(request):

    data = request.data

    evaluations = EvaluationCompleted.objects.filter(
        evaluation__id=data.get("id_evaluation")
    )

    report_data = []

    for evaluation in evaluations:

        ratings = Rating.objects.filter(evaluationCompleted=evaluation.id)

        report_data.append(
            {
                "evaluated": rating.evaluationCompleted.evaluated.user.name,
                "evaluator": rating.evaluationCompleted.evaluator.user.name,
                "standard": rating.standard.description,
                "qualification": rating.qualification,
            }
            for rating in ratings
        )

    return Response(report_data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def report_general(request):

    data = request.data

    evaluations = EvaluationCompleted.objects.filter(
        evaluation__id=data.get("id_evaluation")
    )

    report_data = []

    qualifications = []

    standards = []

    for evaluation in evaluations:

        code_student = evaluation.evaluated.user.code

        if code_student not in report_data:
            report_data.append(code_student)
        else:
            continue

    for code in report_data:

        student = Student.objects.get(user__code=code)

        ratings = Rating.objects.filter(evaluationCompleted__evaluated=student)

        for rating in ratings:

            standard = rating.standard.id

            if standard not in standards:
                standards.append(standard)
            else:
                continue

        for standard in standards:

            ratings1 = ratings.filter(standard_id=standard)

            average = 0

            count = 0

            for rating in ratings1:

                average += rating.qualification
                count += 1

            qualifications.append(
                {
                    "standard": rating.standard.description,
                    "nota": average / count,
                    "evaluated": student.user.name + " " + student.user.last_name,
                }
            )

    return Response(qualifications)
