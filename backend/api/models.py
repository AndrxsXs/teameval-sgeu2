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

class Course(models.Model):
    name = models.CharField(max_length=60)

class Course(models.Model):
    name = models.CharField(max_length=60)
    code = models.CharField(max_length=45)
    academic_period = models.CharField(max_length=8)
    teacher = models.ForeignKey(Teacher, null =True, on_delete=models.CASCADE, related_name='courses' )

class Gruop(models.Model):
    name = models.CharField(max_length=50)
    project_assigned = models.TextField()
    course = models.ForeignKey(Course, null =True, on_delete=models.CASCADE, related_name='groups')
    teacher = models.ForeignKey(Teacher, null =True, on_delete=models.CASCADE, related_name='gropus')

class Student(models.Model):
    Evaluated_status = models.BooleanField(default=False)
    user = models.ForeignKey(User,null= True, on_delete=models.CASCADE, related_name='Students' )


class Scale(models.Model):
    limit = models.IntegerField()
    description = models.TextField(max_length=100)

class Criteria (models.Model):
    description = models.TextField()
    scale = models.ForeignKey(Scale, null =True, on_delete=models.CASCADE, related_name='criteria')


class Evaluation(models.Model):
    date = models.DateField(auto_now_add=True)
    student = models.ForeignKey(Student,null = True, on_delete=models.CASCADE, related_name="evaluations")
    course = models.ForeignKey(Course, null =True, on_delete=models.CASCADE, related_name='evaluations')
    group = models.ForeignKey(Gruop,null =True, on_delete=models.CASCADE, related_name='evaluations')
    teacher = models.ForeignKey(Teacher, null =True, on_delete=models.CASCADE, related_name='evaluations')
    criteria = models.ForeignKey(Criteria, null =True, on_delete=models.CASCADE, related_name='evaluations')
    scale = models.ForeignKey(Scale, null =True, on_delete=models.CASCADE, related_name='evaluations')