from django.db import models
from django.utils import timezone
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import (
    AbstractUser,
    Group,
    Permission,
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db.models.signals import post_save
from django.contrib.auth.base_user import BaseUserManager

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


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        email = self.normalize_email(email)
        extra_fields.setdefault("is_superuser", False)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        # extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    STUDENT = 1
    TEACHER = 2
    ADMIN = 3

    STATUS_CHOICES = [
        (STUDENT, "student"),
        (TEACHER, "teacher"),
        (ADMIN, "admin"),
    ]

    is_superuser = models.BooleanField(default=False)
    is_staff= models.BooleanField(default=False)
    role = models.IntegerField(choices=STATUS_CHOICES)
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=60)
    last_name = models.CharField(max_length=60)
    email = models.EmailField(max_length=80)
    password = models.CharField(max_length=35)
    first_login = models.BooleanField(default=True)
    status = models.BooleanField(default=True)
    last_login = models.DateTimeField(default=timezone.now)

    groups = models.ManyToManyField(
        Group,
        verbose_name="groups",
        blank=True,
        help_text="The groups this user belongs to. A user will get all permissions granted to each of their groups.",
        related_name="users",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name="user permissions",
        blank=True,
        help_text="Specific permissions for this user.",
        related_name="users",
    )

    USERNAME_FIELD = "code"
    REQUIRED_FIELDS = ["name", "last_name", "email", "role"]

    objects = CustomUserManager()

    def save(self, *args, **kwargs):
        if self.role == self.ADMIN:
            self.is_superuser = True
        else:
            self.is_superuser = False
        super().save(*args, **kwargs)

    def search(code):
        try:
            user = User.objects.get(code=code)
            return user
        except User.DoesNotExist:
            return None

    def set_password(self, raw_password):
        self.password = make_password(raw_password)
        self.save()

    # crea la contraseña por defecto del estudiante
    # creates the student's default password
    @staticmethod
    def default_password(name, code, last_name):
        # return name[0] + code + last_name[0]
        return name[0] + str(code) + last_name[0]

    def _str_(self):
        return self.name + " " + self.last_name


class Admi(models.Model):

    user = models.OneToOneField(
        User, null=False, on_delete=models.PROTECT, primary_key=True
    )
    # status = models.BooleanField(default=False)
    phone = models.BigIntegerField(null=True)

    #   def create_user_admin(sender, instance, created, **kwargs):
    #      if created:
    #         Admi.objects.create(user=instance)

    #   def save_user_admin(sender, instance, **kwargs):
    #      instance.admi.save()

    def _str_(self):
        return self.user.name + " " + self.user.last_name


# post_save.connect(Admi.create_user_admin, sender=User)


class Student(models.Model):
    Evaluated_status = models.BooleanField(default=False)
    user = models.OneToOneField(
        User, null=False, on_delete=models.PROTECT, primary_key=True
    )

    def _str_(self):
        return self.user.name + " " + self.user.last_name


class Teacher(models.Model):

        #status = models.BooleanField(default=False)
    user = models.OneToOneField(
        User, null=False, on_delete=models.PROTECT, primary_key=True
    )
    phone = models.BigIntegerField(null=True)

    def _str_(self):
        return self.user.name + " " + self.user.last_name
    
    def get_teacher(codigo):
        user = User.objects.get(code=codigo)
        teacher = user.teacher

        return teacher


class Scale(models.Model):
    Upper_limit = models.IntegerField()
    Lower_limit = models.IntegerField()


class Course(models.Model):

    name = models.CharField(max_length=60)
    code = models.CharField(max_length=40)
    academic_period = models.CharField(max_length=10)
    student_status = models.BooleanField(default=True)
    course_status = models.BooleanField(default=True)
    #   teacher = models.ForeignKey(Teacher, null=True,on_delete=models.PROTECT, related_name='courses_taught') #cursos impartidos por profesor

    user_students = models.ManyToManyField(
        Student,
        related_name="courses_user_student",
    )


    user_teacher = models.ForeignKey(
        User,
        null=True,
        on_delete=models.PROTECT,
        related_name="courses_user_teacher",
    )


    #   student = models.ForeignKey(Student, null=True,on_delete=models.PROTECT, related_name='courses_enrolled') #cursos incritos por estudiante
    

    # obtiene el nombre del profesor
    @property
    def teacher_name(self):
        return self.user_teacher.name + " " + self.user_teacher.last_name

    # obtiene la cantidad de estudiantes
    @property
    def student_count(self):
        return Student.objects.filter(courses_user_student=self).count()


# option 2 for academic period
# academic_year = models.DateTimeField(auto_now_add=True)
# semester = models.IntegerField(choices=[(1, 'Semestre 1'), (2, 'Semestre 2')])


class Rubric(models.Model):
    name = models.CharField(max_length=60)
    
    scale = models.ForeignKey(
        Scale, null=True, on_delete=models.PROTECT, related_name="rubrics"
    )
    courses = models.ManyToManyField( # debe ser muchos a muchos
        Course, related_name="rubrics"
    )

    #is_global = models.BooleanField(default=False)

class Standard(models.Model):
    description = models.TextField() #describe el criterio
    rubric = models.ForeignKey(
        Rubric, null=True, on_delete=models.PROTECT, related_name="standards"
    )
    scale_description = models.TextField(default=False, null=True, blank=True) # describe la escala

 #   nota = models.PositiveIntegerField(default=False) #no va aqui, sino en rating

#class Description(models.Model):
 #   text = models.TextField()
  #  scale = models.ForeignKey(
   #     Scale, null=True, on_delete=models.PROTECT, related_name="descriptions"
  #  )
 #   standard = models.ForeignKey(
 #       Standard, null=True, on_delete=models.PROTECT, related_name="descriptions"
 #   )


class Report(models.Model):
    course = models.ForeignKey(
        Course, null=True, on_delete=models.PROTECT, related_name="reports"
    )


class Evaluation(models.Model):
    TO_START = 1
    INITIATED = 2
    FINISHED = 3

    STATUS_CHOICES = [
        (TO_START, "Por iniciar"),
        (INITIATED, "Iniciado"),
        (FINISHED, "Finalizado"),
    ]
    #evaluator = models.CharField(max_length=60)
    #evaluated = models.CharField(max_length=60)
    estado = models.IntegerField(choices=STATUS_CHOICES)
  #  date_start = models.DateTimeField(auto_now_add=False)
  #  date_end = models.DateTimeField(auto_now_add=False)
    name = models.CharField(max_length=60)
    comment = models.TextField(max_length=100)
    #una evaluacion tiene un rubrica y una rubrica puede pertenecer a muchas evaluaciones
    rubric = models.ForeignKey(
        Rubric, on_delete=models.CASCADE, related_name="evaluations"
    )
    
    report = models.ForeignKey(
        Report, null=True, on_delete=models.PROTECT, related_name="evaluations"
    )

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="evaluations")

    
    #al que evaluo
'''
    evaluated = models.ForeignKey( 
        Student, null=True, on_delete=models.PROTECT, related_name="evaluations_student"    #uno a muchos
    )

    evaluator = models.ForeignKey(
        Student, null=True, on_delete=models.PROTECT, related_name="evaluations_user"   #uno a uno
    )
'''
    
class EvaluationCompleted(models.Model):
    
    evaluated = models.ForeignKey( 
        Student, null=True, on_delete=models.PROTECT, related_name="evaluations_student"    #uno a muchos
    )

    evaluator = models.ForeignKey(
        Student, null=True, on_delete=models.PROTECT, related_name="evaluations_user"   #uno a uno
    )
    
    evaluation = models.ForeignKey(
        Evaluation, null=True, on_delete=models.PROTECT, related_name="evaluation"
    )

    completed = models.BooleanField(default=False)
    
    comment = models.TextField(max_length=100)

class Rating(models.Model):
    #average = models.DecimalField(max_digits=10, decimal_places=3) # Creo que este atributo iria en evaluation
    qualification= models.BigIntegerField(null=False) #esta da la nota del criterio
    
    standard = models.ForeignKey(
        Standard, null=True, on_delete=models.PROTECT, related_name="rating"
    )
    evaluationCompleted = models.ForeignKey(
        EvaluationCompleted, null=True, on_delete=models.PROTECT, related_name="evaluationCompleted"
    )


class Group(models.Model):
    name = models.CharField(max_length=50)
    assigned_project = models.TextField()
    course = models.ForeignKey(
        Course, null=True, on_delete=models.PROTECT, related_name="groups"
    )
    students = models.ManyToManyField(Student, related_name="students")

class Resourse(models.Model):
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=50)
    Acces_route = models.TextField()
    course = models.ForeignKey(
        Course, null=True, on_delete=models.PROTECT, related_name="resourses"
    )
