from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.disciplina_view_set import DisciplinaViewSet
from accounts.views.alunoViews import AlunoViewSet
from accounts.views.curso_views import CursoListCreateView, CursoRetrieveUpdateDestroyView
from accounts.views.turma_views import TurmaListCreateView, TurmaRetrieveUpdateDestroyView
from accounts.views.coordenador_views import CoordenadorListCreateView, CoordenadorRetrieveUpdateDestroyView
app_name = 'api'
router = DefaultRouter()

router.register(r'disciplinas', DisciplinaViewSet, basename='disciplinas')
router.register(r'alunos', AlunoViewSet)


urlpatterns = [
    path('', include(router.urls)),

    # URLs de Curso
    path('cursos/', CursoListCreateView.as_view(), name='curso-list-create'),
    path('cursos/<int:id>/', CursoRetrieveUpdateDestroyView.as_view(), name='curso-detail'),

    # URLs de Turma
    path('turmas/', TurmaListCreateView.as_view(), name='turma-list-create'),
    path('turmas/<int:id>/', TurmaRetrieveUpdateDestroyView.as_view(), name='turma-detail'),

    # URLs do Coordenador
    path('coord/', CoordenadorListCreateView.as_view(), name='coord-list-create'),
    path('coord/<int:id>/', CoordenadorRetrieveUpdateDestroyView.as_view(), name='coord-detail'),
]
