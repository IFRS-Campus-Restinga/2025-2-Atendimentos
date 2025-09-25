from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.disciplina_view_set import DisciplinaViewSet

app_name = 'api'
router = DefaultRouter()

router.register(r'disciplinas', DisciplinaViewSet, basename='disciplinas')


urlpatterns = [
    path('', include(router.urls)),
]
