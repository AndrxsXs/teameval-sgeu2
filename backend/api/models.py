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
        User.objects.filter(code=code).update(password=password)
        User.objects.filter(code=code).update(first_login=False)
        print("La nueva contraseña es: ", password)

    def __str__(self):
        return self.name + ' ' +  self.last_name
            
class Admi(models.Model):
    status = models.BooleanField(default=True)
    phone = models.BigIntegerField(default=1234567890)
    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE, related_name='Admin')
    
    def __str__(self):
        return self.user.name + ' ' +  self.user.last_name

class Student(models.Model):
    Evaluated_status = models.BooleanField(default=False)
    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE, related_name='Students')
    
    def __str__(self):
        return self.user.name + ' ' +  self.user.last_name

class Teacher(models.Model):
    Status = models.BooleanField(default=True)
    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE, related_name='Teachers')
    phone = models.BigIntegerField(default=1234567890)
    
    def __str__(self):
        return self.user.name + ' ' +  self.user.last_name