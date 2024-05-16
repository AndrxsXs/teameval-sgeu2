from .models import User, Student, Teacher, Admi, Course
from rest_framework import serializers
from rest_framework.response import Response
# from .models import User
# from .models import Note



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "role", "code", "name", "last_name", "email", "password", "first_login", "last_login"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        print(validated_data)
        # Extraer la contraseña de los datos validados
        password = validated_data.pop('password', None)
        
        # Crear una nueva instancia del modelo con los datos validados restantes
        instance = self.Meta.model(**validated_data)
        
        # Establecer la contraseña para la instancia si existe
        if password is not None:
            instance.set_password(password)
        
        # Guardar la instancia en la base de datos
        instance.save()
        
        # Devolver la instancia creada
        return instance
    
class StudentSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.name')
    last_name = serializers.CharField(source='user.last_name')
    email = serializers.EmailField(source='user.email')
    code = serializers.CharField(source='user.code')

    class Meta:
        model = Student
        fields = ['name', 'last_name', 'code', 'email']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user_data['role'] = User.STUDENT
        user_data['password'] = User.default_password(user_data['name'], user_data['code'], user_data['last_name'])
        user = User.objects.create(**user_data)
        student = Student.objects.create(user=user, **validated_data)
        return student
        
class TeacherSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.name')
    last_name = serializers.CharField(source='user.last_name')
    email = serializers.EmailField(source='user.email')
    code = serializers.CharField(source='user.code')
    class Meta:        
        model = Teacher
        fields = ["name", "last_name", "code", "email", "phone"] 
        
    def create(self, validated_data):
        # Extraer los datos del usuario del diccionario de datos validados
        user_data = validated_data.pop('user')
        # Crear una nueva instancia del modelo User con los datos del usuario
        user = User.objects.create(**user_data)
        # Crear una nueva instancia del modelo Teacher con los datos validados restantes
        teacher = Teacher.objects.create(user=user, **validated_data)
        # Cambiar el estado del profesor a activo
        teacher.status = True
        # Guardar el cambio en la base de datos
        teacher.save()
        
        return teacher

class AdminSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.name')
    last_name = serializers.CharField(source='user.last_name')
    email = serializers.EmailField(source='user.email')
    code = serializers.CharField(source='user.code')
    class Meta:        
        model = Admi
        fields = ["name", "last_name", "code", "email", "phone"] 
        
    def create(self, validated_data):
        # Extraer los datos del usuario del diccionario de datos validados
        user_data = validated_data.pop('user')
        user_data['role'] = User.ADMIN
        user_data['password'] = User.default_password(user_data['name'], user_data['code'], user_data['last_name'])
        # Crear una nueva instancia del modelo User con los datos del usuario
        user = User.objects.create(**user_data)
        # Cambiar el estado del usuario a activo
        user.status = True
        user.save()
        # Crear una nueva instancia del modelo Teacher con los datos validados restantes
        admin = Admi.objects.create(user=user, **validated_data)
        return admin
    
class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model= Course
        fields= ["name", "code", "academic_period", "teacher"]
        
    def create(self, validated_data):
        
        # Crear una nueva instancia del modelo con los datos validados 
        instance = self.Meta.model(**validated_data)
        
        # Establecer el curso como activo
        instance.course_status= True
        
        # Guardar la instancia en la base de datos
        instance.save()
        
        # Devolver la instancia creada
        return instance

# class NoteSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Note
#         fields = ["id", "title", "content", "created_at", "author"]
#         extra_kwargs = {"author": {"read_only": True}}