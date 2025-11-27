from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import Group, Permission
from rest_framework import status
from accounts.enumerations.tipo_usuario import TipoUsuario
from rest_framework.exceptions import PermissionDenied

PERMISSOES_ESPECIAIS = [
    'pode_aprovar_evento',
    'pode_cancelar_evento',
    'pode_reagendar_evento',
    'pode_aprovar_como_professor', 
]

GRUPOS = ['Alunos', 'Professores', 'Coordenadores', 'Administradores']

class PermissoesGruposView(APIView):
    permission_classes = []  # Sem autenticação por enquanto
    # permission_classes = [IsAuthenticated]

    def has_admin_or_coord(self, user):
        return user.groups.filter(name__in=['Administradores', 'Coordenadores']).exists()

    def get(self, request):
        resultado = []
        for grupo_nome in GRUPOS:
            try:
                grupo = Group.objects.get(name=grupo_nome)
            except Group.DoesNotExist:
                resultado.append({
                    'grupo': grupo_nome,
                    'permissoes': [],
                })
                continue
            perms = grupo.permissions.filter(codename__in=PERMISSOES_ESPECIAIS)
            resultado.append({
                'grupo': grupo_nome,
                'permissoes': [p.codename for p in perms],
            })
        return Response(resultado)

    def post(self, request):
        # Só admin ou coordenador pode alterar permissões
        if not self.has_admin_or_coord(request.user):
            # raise PermissionDenied("Acesso restrito a administradores e coordenadores.")
            pass
        grupo_nome = request.data.get('grupo')
        permissoes = request.data.get('permissoes', [])
        if grupo_nome not in GRUPOS:
            return Response({'error': 'Grupo inválido.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            grupo = Group.objects.get(name=grupo_nome)
        except Group.DoesNotExist:
            return Response({'error': 'Grupo não encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        # Remove todas as permissões especiais
        grupo.permissions.remove(*Permission.objects.filter(codename__in=PERMISSOES_ESPECIAIS))
        # Adiciona as permissões selecionadas
        grupo.permissions.add(*Permission.objects.filter(codename__in=permissoes))
        return Response({'success': True})
