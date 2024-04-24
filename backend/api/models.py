from django.db import models
from django.utils import timezone
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db.models.signals import post_save

# Create your models here.
#'- VARCHAR   models.TextField'
#'INT  models.IntegerField '
#'TEXT  models.TextField'
#'SMALLINT models.IntegerField'
#'TINYINT models.IntegerField '

#'course, name, code, academic period'

# class User(models.Model):
#     role = models.CharField(max_length=12)
#     code = models.CharField(max_length=20, unique=True)
#     name = models.CharField(max_length=60)
#     last_name = models.CharField(max_length=60)
#     email = models.CharField(max_length=80)
#     password = models.CharField(max_length=35)
#     first_login= models.BooleanField(default=True)
#     last_login= timezone.now()
    
class User(AbstractUser):
    role = models.CharField(max_length=12)
    username = None
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=60)
    last_name = models.CharField(max_length=60)
    email = models.EmailField(max_length=80)
    password = models.CharField(max_length=35)
    first_login= models.BooleanField(default=True)
    last_login= timezone.now()

    USERNAME_FIELD = 'code'
    REQUIRED_FIELDS = ['name', 'last_name', 'email', 'role']
    
    def search(code):
        try:
            user = User.objects.get(code=code)
            return user
        except User.DoesNotExist:
            return None
    
    def set_password(self, raw_password):
         self.password = make_password(raw_password)
         self.save()
    
    def update_password(password, code):
        User.objects.filter(code=code).update(password=password)
        User.objects.filter(code=code).update(first_login=False)
        print("La nueva contraseña es: ", password)

    def __str__(self):
        return self.name + ' ' +  self.last_name
            
class Admi(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='admin')
    # status = models.BooleanField(default=True)
    # phone = models.BigIntegerField(default=1234567890)
    # user = models.ForeignKey(User, null=True, on_delete=models.CASCADE, related_name='admin')
    
    def create_user_admin(sender, instance, created, **kwargs):
        if created:
            Admi.objects.create(user=instance)
    
    def save_user_admin(sender, instance, **kwargs):
        instance.admi.save()
    
    def __str__(self):
        return self.user.name + ' ' +  self.user.last_name

post_save.connect(Admi.create_user_admin, sender=User)

class Student(models.Model):
    Evaluated_status = models.BooleanField(default=False)
    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE, related_name='student')
    
    def __str__(self):
        return self.user.name + ' ' +  self.user.last_name

class Teacher(models.Model):
    Status = models.BooleanField(default=True)
    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE, related_name='teacher')
    phone = models.BigIntegerField(default=1234567890)
    
    def __str__(self):
        return self.user.name + ' ' +  self.user.last_name