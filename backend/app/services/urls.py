from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views.disciplina_view_set import DisciplinaViewSet
from services.views.aluno_views_set import AlunoViewSet
from .views.servidor_views_set import ServidorViewSet
from .views.curso_views_set import CursoViewSet
from .views.turma_views_set import TurmaViewSet
from .views.atendimento_views_set import AtendimentoViewSet
from .views.coordenador_views_set import CoordenadorViewSet
from services.views.auth_views import GoogleLoginView

app_name = 'api'
router = DefaultRouter()

router.register(r'alunos', AlunoViewSet, basename='alunos')
router.register(r'cursos', CursoViewSet, basename='cursos')
router.register(r'turmas', TurmaViewSet, basename='turmas')
router.register(r'coord', CoordenadorViewSet, basename='Coordenadores')
router.register(r'servidores', ServidorViewSet, basename='Servidores')
router.register(r'disciplinas', DisciplinaViewSet, basename='disciplinas')
router.register(r'atendimentos', AtendimentoViewSet, basename='atendimentos')

urlpatterns = [
    path('api/google-login/', GoogleLoginView.as_view(), name='google-login'),
    path('', include(router.urls)),
]