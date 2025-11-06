from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views.disciplina_view_set import DisciplinaViewSet
from services.views.aluno_views_set import AlunoViewSet
from .views.professor_views_set import ProfessorViewSet
from .views.curso_views_set import CursoViewSet
from .views.turma_views_set import TurmaViewSet
from .views.evento_view_set import EventoViewSet
from .views.evento_status_views import EventoStatusSet
from .views.evento_ordinario_views import EventoOrdinarioViewSet
from .views.evento_extraordinario_views import EventoExtraordinarioViewSet
from .views.usuario_view_set import UsuarioViewSet
from .views.coordenador_views_set import CoordenadorViewSet
from services.views.auth_views import GoogleLoginView
from services.views.registro_atendimento_views_set import RegistroAtendimentoViewSet
from services.views.complemento_views import ComplementoCadastroView
from services.views.aprovacao_views import AprovarUsuarioView
from services.views.listar_pendentes_views import UsuarioPendenteViewSet

app_name = 'api'
router = DefaultRouter()

router.register(r'alunos', AlunoViewSet, basename='alunos')
router.register(r'cursos', CursoViewSet, basename='cursos')
router.register(r'turmas', TurmaViewSet, basename='turmas')
router.register(r'coord', CoordenadorViewSet, basename='Coordenadores')
router.register(r'professores', ProfessorViewSet, basename='professores')
router.register(r'disciplinas', DisciplinaViewSet, basename='disciplinas')
router.register(r'eventos', EventoViewSet, basename='eventos')
router.register(r'evento-ordinario', EventoOrdinarioViewSet, basename='evento-ordinario')   
router.register(r'evento-extraordinario', EventoExtraordinarioViewSet, basename='evento-extraordinario')
router.register(r'usuario', UsuarioViewSet, basename='usuario')
router.register(r'registro-atendimento', RegistroAtendimentoViewSet, basename='registro-atendimento')
router.register(r'usuarios-pendentes', UsuarioPendenteViewSet, basename='usuarios-pendentes')

urlpatterns = [
    path('api/google-login/', GoogleLoginView.as_view(), name='google-login'),
    path('', include(router.urls)),
    path('api/complemento-cadastro/', ComplementoCadastroView.as_view(), name='complemento-cadastro'),
    path('api/eventos-ordinarios/status-choices/', EventoStatusSet.as_view(), name="evento-status-choices"),
    path('api/usuarios/aprovar/<int:user_id>/', AprovarUsuarioView.as_view(), name='aprovar-usuario'),
]
