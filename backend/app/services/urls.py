from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.disciplina_view_set import DisciplinaViewSet
from accounts.views.cursoViews import CursoListCreateView, CursoRetrieveUpdateDestroyView
from accounts.views.turmaViews import TurmaListCreateView, TurmaRetrieveUpdateDestroyView
app_name = 'api'
router = DefaultRouter()

router.register(r'disciplinas', DisciplinaViewSet, basename='disciplinas')


urlpatterns = [
    path('', include(router.urls)),

    # URLs de Curso
    path('cursos/', CursoListCreateView.as_view(), name='curso-list-create'),
    path('cursos/<int:id>/', CursoRetrieveUpdateDestroyView.as_view(), name='curso-detail'),

    # URLs de Turma
    path('turmas/', TurmaListCreateView.as_view(), name='turma-list-create'),
    path('turmas/<int:id>/', TurmaRetrieveUpdateDestroyView.as_view(), name='turma-detail'),
]
