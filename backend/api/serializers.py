from .models import User, Student, Teacher, Admi, Course, Group, Scale, Rubric, Standard
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, SerializerMethodField
from django.db import IntegrityError
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
 #   courses = serializers.SlugRelatedField(many=True, slug_field='code', queryset=Course.objects.all())

    class Meta:
        model = Student
        fields = ['name', 'last_name', 'code', 'email']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user_data['role'] = User.STUDENT
        password = User.default_password(user_data['name'], user_data['code'], user_data['last_name'])
        user_data['password'] = User.default_password(user_data['name'], user_data['code'], user_data['last_name'])
        user = User.objects.create(**user_data)
        user.set_password(password) 
        student = Student.objects.create(user=user, **validated_data)
        return student
        
class TeacherSerializer1(serializers.ModelSerializer):
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
        # Cambiar el estado del profesor a activo
        user.status = True
        user.save()
        # Crear una nueva instancia del modelo Teacher con los datos validados restantes
        teacher = Teacher.objects.create(user=user, **validated_data)        
        return teacher

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
        user_data['role'] = User.TEACHER
        password = User.default_password(user_data['name'], user_data['code'], user_data['last_name'])
        # Crear una nueva instancia del modelo User con los datos del usuario
        user = User.objects.create(**user_data)
        # Cambiar el estado del usuario a activo
        user.status = True
        user.set_password(password) 
        user.save()
        # Crear una nueva instancia del modelo Teacher con los datos validados restantes
        teacher = Teacher.objects.create(user=user, **validated_data)
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
        password = User.default_password(user_data['name'], user_data['code'], user_data['last_name'])
        # Crear una nueva instancia del modelo User con los datos del usuario
        user = User(**user_data)
        # Cambiar el estado del usuario a activo
        user.status = True
        user.set_password(password) 
        user.save()
        # Crear una nueva instancia del modelo Teacher con los datos validados restantes
        admin = Admi.objects.create(user=user, **validated_data)
        return admin

class ScaleSerialiazer(serializers.ModelSerializer):
    class Meta:
        model = Scale
        fields = ['Upper_limit', 'Lower_limit']
        
class StandardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Standard
        fields = ['description', 'scale_description']
        
class RubricDetailSerializer(serializers.ModelSerializer):
    standards = StandardSerializer(many=True)
    scale = serializers.SerializerMethodField()

    class Meta:
        model = Rubric
        fields = ['id', 'name', 'scale', 'standards']

    def get_scale(self, obj):
        scale = obj.scale
        return list(range(scale.Lower_limit, scale.Upper_limit + 1))


class RubricSerializer(serializers.ModelSerializer):
    class Meta:
        scale = serializers.PrimaryKeyRelatedField(queryset=Scale.objects.all())
        standards = StandardSerializer(many=True)
        courses = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all())
        
        model = Rubric
        fields = ['name', 'scale', 'standards', 'courses']
        
        def validate(self, data):
            if 'scale' not in data:
                raise serializers.ValidationError("Primero defina la escala")
            return data
        
        def create(self, validated_data):
            standards_data = validated_data.pop('standards')
            rubric = Rubric.objects.create(**validated_data)
            for standard_data in standards_data:
                Standard.objects.create(rubric=rubric, **standard_data)
            return rubric
        

class GroupSerializer(serializers.ModelSerializer):
    students = serializers.PrimaryKeyRelatedField(many=True, queryset=Student.objects.all())

    class Meta:
        model = Group
        fields = ['id', 'name', 'assigned_project', 'course', 'students']
        extra_kwargs = {
            'course': {'required': True},
            'students': {'required': False}
        }

    def create(self, validated_data):
        students = validated_data.pop('students', [])  # Obtener estudiantes del validated_data
        group = Group.objects.create(**validated_data)  # Crear grupo sin estudiantes
        group.students.set(students)  # Asignar estudiantes al grupo
        return group
            
class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model= Course
        fields= ["name", "code", "academic_period", "user_teacher"]
        
    def create(self, validated_data):
        
        # Crear una nueva instancia del modelo con los datos validados 
        instance = self.Meta.model(**validated_data)
        
        # Establecer el curso como activo
        instance.course_status= True
        
        # Guardar la instancia en la base de datos
        instance.save()
        
        # Devolver la instancia creada
        return instance

class InfoRubricSerializer(serializers.ModelSerializer):
    scale = ScaleSerialiazer()
    standards = StandardSerializer(many=True)
    courses = CourseSerializer(many=True)

    class Meta:
        model = Rubric
        fields = ['name', 'scale', 'standards', 'courses']

# class NoteSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Note
#         fields = ["id", "title", "content", "created_at", "author"]
#         extra_kwargs = {"author": {"read_only": True}}