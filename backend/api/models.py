from django.db import models

# Create your models here.
'- VARCHAR   models.TextField'
'INT  models.IntegerField '
'TEXT  models.TextField'
'SMALLINT models.IntegerField'
'TINYINT models.IntegerField '

'course, name, code, academic period'
class Admin(models.Model):
    code = models.TextField(max_length=20)
    names = models.TextField(max_length=60)
    last_name = models.TextField(max_length=60)
    email = models.TextField(max_length=80)
    password = models.TextField(max_length=8)

class Teacher(models.Model):
    code = models.TextField(max_length=20)
    identification = models.IntegerField()
    names = models.TextField(max_length=60)
    last_name = models.TextField(max_length=60)
    email = models.TextField(max_length=80)
    password = models.TextField(max_length=8)
    phone_number = models.IntegerField(20)
    active_status = models.BooleanField(default=True)

class Course(models.Model):
    name = models.TextField(max_length=60)
    code = models.TextField(max_length=45)
    academic_period = models.TextField(max_length=8)
    teacher = models.ForeignKey(Teacher, null =True, on_delete=models.CASCADE, related_name='courses' )

class Gruop(models.Model):
    name = models.TextField(max_length=50)
    project_assigned = models.TextField()
    course = models.ForeignKey(Course, null =True, on_delete=models.CASCADE, related_name='groups')
    teacher = models.ForeignKey(Teacher, null =True, on_delete=models.CASCADE, related_name='gropus')

class Student(models.Model):
    code = models.TextField(max_length=20)
    names = models.TextField(max_length=60)
    last_name = models.TextField(max_length=60)
    email = models.TextField(max_length=80)
    password = models.TextField(max_length=8)
    courses = models.ManyToManyField(Course , related_name='students')
    group = models.ForeignKey(Gruop,null =True, on_delete=models.CASCADE)
    teacher = models.ForeignKey(Teacher, null =True, on_delete=models.CASCADE, related_name='students')

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