from django.contrib import admin
from api.models import User, Admi, Teacher, Student
# Register your models here.

class UserAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'last_name')
    
class AdmiAdmin(admin.ModelAdmin):
    list_display = ('user')

admin.site.register(User, UserAdmin)
admin.site.register(Admi)