import csv
import io
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
# from django.contrib.auth.models import User
from .models import User, Course
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
)
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import authenticate, login
from . import models
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.core.mail import EmailMultiAlternatives
from backend import settings

# Create your views here.


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def import_student(request):
    csv_file = request.FILES["csv_file"] #Asi se debe llamar el nombre del campo en front
    decoded_file = csv_file.read().decode('utf-8')
    io_string = io.StringIO(decoded_file)
    reader = csv.reader(io_string, delimiter=';', quotechar="|")
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
            return Response({'message': 'El archivo CSV tiene un formato incorrecto'}, status=status.HTTP_400_BAD_REQUEST)
        serializer_student = StudentSerializer(data=student_data)
        if serializer_student.is_valid():
            try:
                serializer_student.save()
            except:
                return Response({'message': f'El usuario con el código {row[2]} ya existe'}, status=status.HTTP_409_CONFLICT)
        else:
            return Response(serializer_student.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response({'message': 'Estudiantes importados exitosamente'}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def import_teacher(request):
    csv_file = request.FILES["csv_file"]
    decoded_file = csv_file.read().decode('utf-8')
    io_string = io.StringIO(decoded_file)
    reader = csv.reader(io_string, delimiter=';', quotechar='|')
    next(reader)
    for row in reader:
        try:
            teacher_data = {
            "name": row[0],
            "last_name": row[1],
            "code": row[2],
            "email": row[3],
            "phone": row[4]
        }
        except IndexError:
            return Response({'message': 'El archivo CSV tiene un formato incorrecto'}, status=status.HTTP_400_BAD_REQUEST)
        serializer_teacher = TeacherSerializer(data=teacher_data)
        if serializer_teacher.is_valid():
            try:
                serializer_teacher.save()
            except:
                return Response({'message': f'El usuario con el código {row[2]} ya existe'}, status=status.HTTP_409_CONFLICT)
        else:
            return Response(serializer_teacher.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response({'message': 'Profesores importados exitosamente'}, status=status.HTTP_201_CREATED)

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
def register_student(request):
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
            serializer_student.save()
            return Response(
                {"message": "User created successfully"}, status=status.HTTP_201_CREATED
            )
        except:
            return Response(
                {"message": "User with this code already exists"},
                status=status.HTTP_409_CONFLICT,
            )
    return Response(serializer_student.errors, status=status.HTTP_400_BAD_REQUEST)


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
                {"message": "User created successfully"}, status=status.HTTP_201_CREATED
            )
        except:
            return Response(
                {"message": "User with this code already exists"},
                status=status.HTTP_409_CONFLICT,
            )
    return Response(
        {"message": "error creating user"}, status=status.HTTP_400_BAD_REQUEST
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
                {"message": "User created successfully"}, status=status.HTTP_201_CREATED
            )
        except:
            return Response(
                {"message": "User with this code already exists"},
                status=status.HTTP_409_CONFLICT,
            )
    return Response(
        {"message": "error creating user"}, status=status.HTTP_400_BAD_REQUEST
    )

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_group(request):
    data = request.data
    print(data) 
    group_data = {
        "name": data.get("name"),
        "assigned_project": data.get("assigned_project"),
        "course": data.get("course"),
        "students": data.get("students"),      
    }
    serializer_group = GroupSerializer(data=group_data)
    if serializer_group.is_valid():
        serializer_group.save()
        return Response({'message': 'Group created successfully'}, status=status.HTTP_201_CREATED)
    print(serializer_group.errors)
    return Response({'message': 'Error creating group'}, status=status.HTTP_400_BAD_REQUEST)
        


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
    if role is not None:
        users = User.objects.filter(role=role)
    else:
        users = User.objects.all()
    # obtiene el name, codigo, apellido y email para que se muestren
    user_data = [
        {
            "role": user.role,
            "code": user.code,
            "name": user.name,
            "last_name": user.last_name,
            "email": user.email,
            "status": user.status,
            # recorre cada usuario de la lista
        }
        for user in users
    ]
    return Response(user_data)


# obtiene una lista de cursos
# gets a list of course
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def course_list(request):
    courses = Course.objects.all()
    # obtiene el name, codigo, docente y cantidad de estudiantes para que se muestren
    course_data = [
        {
            "code": course.code,
            "name": course.name,
            "teacher": course.teacher_name,
            "student_count": course.student_count,
        }
        for course in courses
    ]
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
    data = models.Course.objects.filter(
        teacher_id=user.id, course_status=1
    ).values_list("name")
    if data is None:
        return Response(
            {"status": "non-associated courses"}, status=status.HTTP_400_BAD_REQUEST
        )
    else:
        course_data = [
            {
                "code": course.code,
                "name": course.name,
                "teacher": course.teacher_name,
                "student_count": course.student_count,
            }
            for course in data
        ]
    return Response(course_data)


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


#@api_view(["POST"])
#@permission_classes([IsAuthenticated])

def create_course(request):
    if request.method == 'GET':
        return render(request, "cursos.html")
    else:
        #data = request.data  # Obtener los datos de la solicitud
        user = models.User.objects.get(code= request.POST.get("teacher"))
    
        print(user.name + ' ' + user.last_name)
        print(request.POST.get("name"))
        print(request.POST.get("code"))
        print(request.POST.get("academic_period"))
        
        course_data = {
        
            "name": request.POST.get("name"),
            "code": request.POST.get("code"),
            "academic_period": request.POST.get("academic_period"),
            "user_teacher": user.id,
        }    

        serializer_course = CourseSerializer(
          data=course_data
        ) # Pasar los datos con la clave 'data='
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
    q = request.POST.get('user_mail', '')
    subject = 'Restablecer contraseña'
    if models.User.objects.filter(email__icontains=q).exists():
        message = EmailMultiAlternatives(subject,  # Titulo
                                        "Hola, para restablecer su contraseña ingrese al siguiente link ....",
                                        settings.EMAIL_HOST_USER,  # Remitente
                                        [q])  # Destinatario
        message.send()
        return Response({'message': 'Correo enviado correctamente'}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "No existe un usuario con esta direccion de correo electronico"}, status=status.HTTP_400_BAD_REQUEST)
    
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


def cursos(request):
    return render(request, "cursos.html")
