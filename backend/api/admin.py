from django.contrib import admin
from . import models
from django.contrib.auth.models import User
# Register your models here.

admin.site.register(models.Student)
#admin.site.register(models.Gruop)
admin.site.register(models.Teacher)
admin.site.register(models.User)
