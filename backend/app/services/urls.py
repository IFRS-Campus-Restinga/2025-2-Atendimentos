from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views.disciplina_view_set import DisciplinaViewSet
# Removed Aluno/Professor viewsets
from .views.curso_views_set import CursoViewSet
from .views.turma_views_set import TurmaViewSet
from .views.evento_view_set import EventoViewSet
from .views.evento_status_views import EventoStatusSet
from .views.evento_ordinario_views import EventoOrdinarioViewSet
from .views.evento_extraordinario_views import EventoExtraordinarioViewSet
from .views.usuario_view_set import UsuarioViewSet
# Removed Coordenador viewset
from services.views.auth_views import GoogleLoginView
from services.views.registro_atendimento_views_set import RegistroAtendimentoViewSet
# Removed complemento/profile views
from services.views.usuario_me_view import UsuarioMeView

app_name = 'api'
router = DefaultRouter()

router.register(r'cursos', CursoViewSet, basename='cursos')
router.register(r'turmas', TurmaViewSet, basename='turmas')
router.register(r'disciplinas', DisciplinaViewSet, basename='disciplinas')
router.register(r'eventos', EventoViewSet, basename='eventos')
router.register(r'evento-ordinario', EventoOrdinarioViewSet, basename='evento-ordinario')   
router.register(r'evento-extraordinario', EventoExtraordinarioViewSet, basename='evento-extraordinario')
router.register(r'usuario', UsuarioViewSet, basename='usuario')
router.register(r'registro-atendimento', RegistroAtendimentoViewSet, basename='registro-atendimento')


urlpatterns = [
    path('api/google-login/', GoogleLoginView.as_view(), name='google-login'),
    path('', include(router.urls)),
    # complemento-cadastro and profile endpoints removed
    path('api/usuario/me', UsuarioMeView.as_view(), name='usuario-me'),
    path('api/eventos-ordinarios/status-choices/', EventoStatusSet.as_view(), name="evento-status-choices"),

]