from django.db import models

# Create your models here.
'- VARCHAR   models.TextField'
'INT  models.IntegerField '
'TEXT  models.TextField'
'SMALLINT models.IntegerField'
'TINYINT models.IntegerField '

'course, name, code, academic period'
class User(models.Model):
    rol = models.CharField(max_length=10)
    code = models.CharField(max_length=20)
    name = models.CharField(max_length=60)
    last_name = models.CharField(max_length=60)
    email = models.CharField(max_length=80)
    password = models.CharField(max_length=35)

class Admi(models.Model):

    status = models.BooleanField(default=True)
    phone = models.IntegerField(null=True)
    user = models.ForeignKey(User,null= True, on_delete=models.CASCADE, related_name='Admin' )


class Teacher(models.Model):
    
    Status = models.BooleanField(default=True)
    user = models.ForeignKey(User,null= True, on_delete=models.CASCADE, related_name='Teachers' )