from django.db import models
from django.utils import timezone
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AbstractUser, Group, Permission, AbstractBaseUser
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
    STUDENT = 1
    TEACHER = 2
    ADMIN = 3

    STATUS_CHOICES = [
        (STUDENT, "student"),
        (TEACHER, "teacher"),
        (ADMIN, "admin"),
    ]

    role = models.IntegerField(choices=STATUS_CHOICES)
    username = None
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=60)
    last_name = models.CharField(max_length=60)
    email = models.EmailField(max_length=80)
    password = models.CharField(max_length=35)
    first_login = models.BooleanField(default=True)
    last_login = timezone.now()

    USERNAME_FIELD = "code"
    REQUIRED_FIELDS = ["name", "last_name", "email", "role", "username"]

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
    status = models.BooleanField(default=False)
    phone = models.BigIntegerField(null=True)

    def create_user_admin(sender, instance, created, **kwargs):
        if created:
            Admi.objects.create(user=instance)

    def save_user_admin(sender, instance, **kwargs):
        instance.admi.save()

    def _str_(self):
        return self.user.name + " " + self.user.last_name


post_save.connect(Admi.create_user_admin, sender=User)


class Student(models.Model):
    Evaluated_status = models.BooleanField(default=False)
    user = models.OneToOneField(
        User, null=False, on_delete=models.PROTECT, primary_key=True
    )
    group = models.ForeignKey(
        Group, null=True, on_delete=models.PROTECT, related_name="students"
    )

    def _str_(self):
        return self.user.name + " " + self.user.last_name


class Teacher(models.Model):

    status = models.BooleanField(default=False)
    user = models.OneToOneField(
        User, null=False, on_delete=models.PROTECT, primary_key=True
    )
    phone = models.BigIntegerField(null=True)

    def _str_(self):
        return self.user.name + " " + self.user.last_name


class Scale(models.Model):
    Upper_limit = models.IntegerField()
    Lower_limit = models.IntegerField()


class Course(models.Model):

    name = models.CharField(max_length=60)
    code = models.CharField(max_length=40)
    academic_period = models.CharField(max_length=10)
    student_status = models.BooleanField(default=False)
    course_status = models.BooleanField(default=False)
    #   teacher = models.ForeignKey(Teacher, null=True,on_delete=models.PROTECT, related_name='courses_taught') #cursos impartidos por profesor

    user_teacher = models.ForeignKey(
        Teacher,
        null=True,
        on_delete=models.PROTECT,
        related_name="courses_user_teacher",
    )

    #   student = models.ForeignKey(Student, null=True,on_delete=models.PROTECT, related_name='courses_enrolled') #cursos incritos por estudiante

    user_student = models.ForeignKey(
        Student,
        null=True,
        on_delete=models.PROTECT,
        related_name="courses_user_student",
    )

    # obtiene el nombre del profesor
    @property
    def teacher_name(self):
        return self.user_teacher.user.name + " " + self.user_teacher.last_name

    # obtiene la cantidad de estudiantes
    @property
    def student_counr(self):
        return Student.objects.filter(course_user_student=self).count()


# option 2 for academic period
# academic_year = models.DateTimeField(auto_now_add=True)
# semester = models.IntegerField(choices=[(1, 'Semestre 1'), (2, 'Semestre 2')])


class Rubric(models.Model):
    scale = models.ForeignKey(
        Scale, null=True, on_delete=models.PROTECT, related_name="rubrics"
    )
    course = models.ForeignKey(
        Course, null=True, on_delete=models.PROTECT, related_name="rubrics"
    )


class Standard(models.Model):
    description = models.TextField()
    rubric = models.ForeignKey(
        Rubric, null=True, on_delete=models.PROTECT, related_name="standards"
    )


class Description(models.Model):
    text = models.TextField()
    scale = models.ForeignKey(
        Scale, null=True, on_delete=models.PROTECT, related_name="descriptions"
    )
    standard = models.ForeignKey(
        Standard, null=True, on_delete=models.PROTECT, related_name="descriptions"
    )


class Report(models.Model):
    course = models.ForeignKey(
        Course, null=True, on_delete=models.PROTECT, related_name="reports"
    )


class Evaluation(models.Model):
    evaluator = models.CharField(max_length=60)
    evaluated = models.CharField(max_length=60)
    date = models.DateTimeField(auto_now_add=True)
    student = models.ForeignKey(
        Student, null=True, on_delete=models.PROTECT, related_name="evaluations_student"
    )

    user_student = models.ForeignKey(
        Student, null=True, on_delete=models.PROTECT, related_name="evaluations_user"
    )

    report = models.ForeignKey(
        Report, null=True, on_delete=models.PROTECT, related_name="evaluations"
    )


class Rating(models.Model):
    average = models.DecimalField(max_digits=10, decimal_places=3)
    standard = models.OneToOneField(
        Standard, null=False, on_delete=models.PROTECT, primary_key=True
    )
    evaluation = models.ForeignKey(
        Evaluation, null=True, on_delete=models.PROTECT, related_name="rating"
    )


class Group(models.Model):
    name = models.CharField(max_length=50)
    Assigned_project = models.TextField()
    course = models.ForeignKey(
        Course, null=True, on_delete=models.PROTECT, related_name="groups"
    )


class Resourse(models.Model):
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=50)
    Acces_route = models.TextField()
    course = models.ForeignKey(
        Course, null=True, on_delete=models.PROTECT, related_name="resourses"
    )
