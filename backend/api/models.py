from django.db import models
from django.utils import timezone

# Create your models here.
#'- VARCHAR   models.TextField'
#'INT  models.IntegerField '
#'TEXT  models.TextField'
#'SMALLINT models.IntegerField'
#'TINYINT models.IntegerField '

#'course, name, code, academic period'

class User(models.Model):
    rol = models.CharField(max_length=12)
    code = models.CharField(max_length=20)
    name = models.CharField(max_length=60)
    last_name = models.CharField(max_length=60)
    email = models.CharField(max_length=80)
    password = models.CharField(max_length=35)
    first_login= models.BooleanField(default=True)
    last_login= timezone.now()
    
    def search(code):
        try:
            user = User.objects.get(code=code)
            return user
        except User.DoesNotExist:
            return None
    
    def update_password(password, code):
        user= User.search(code)
        if user is not None:
            user.password= password
            user.first_login= False
            user.save
            print("La nueva contraseña es: ", password)
            
class Admi(models.Model):
    status = models.BooleanField(default=True)
    phone = models.BigIntegerField(default=1234567890)
    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE, related_name='Admin')

class Student(models.Model):
    Evaluated_status = models.BooleanField(default=False)
    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE, related_name='Students')

class Teacher(models.Model):
    Status = models.BooleanField(default=True)
    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE, related_name='Teachers')
    phone = models.BigIntegerField(default=1234567890)