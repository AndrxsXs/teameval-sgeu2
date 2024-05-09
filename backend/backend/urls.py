from django.contrib import admin
from django.urls import path, include
from api import views
from api.views import CreateUserView, MyTokenObtainPairView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('', views.home, name='home'),
    # path('singin/', views.singin, name='singin'),
    # path('home/', views.home),
    # path('cursos/', views.cursos, name='cursos'),
    # path('estudiante/', views.estudiante, name='estudiante'),
    
    path('api/user/register/', CreateUserView.as_view(), name='register'),
    path('register_student/', views.register_student, name='register_student'),
    # path('api/token/', TokenObtainPairView.as_view(), name='get_token'),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api-auth/', include('rest_framework.urls')),
    path('api/', include('api.urls')),
]