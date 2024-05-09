from .models import User, Student
from rest_framework import serializers
# from .models import User
# from .models import Note



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "role", "code", "name", "last_name", "email", "password", "first_login", "last_login"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
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
        fields = ["name", "last_name", "code", "email"] 

# class NoteSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Note
#         fields = ["id", "title", "content", "created_at", "author"]
#         extra_kwargs = {"author": {"read_only": True}}