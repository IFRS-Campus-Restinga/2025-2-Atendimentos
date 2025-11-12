from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model

APP_NAME = 'accounts'



class CustomPermissions(permissions.DjangoModelPermissions):
    perms_map = {
        'GET': ['%(app_label)s.view_%(model_name)s'],
        'OPTIONS': [],
        'HEAD': [],
        'POST': ['%(app_label)s.add_%(model_name)s'],
        'PUT': ['%(app_label)s.change_%(model_name)s'],
        'PATCH': ['%(app_label)s.change_%(model_name)s'],
        ##'DELETE': ['%(app_label)s.delete_%(model_name)s'],
    }


class CanApproveRequests(permissions.BasePermission):
 
    def has_permission(self, request, view):
        return request.user.has_perm('accounts.can_approve_requests')
    

class AprovarSolicitacaoAPIView(APIView):
    permission_classes = [CanApproveRequests]

    def post(self, request, pk):
        return Response({'status': 'Solicitação aprovada com sucesso.'}, status=status.HTTP_200_OK)
    


# atribuir essas novas permissões aos grupos no Admin após a migração.

class HasViewOwnAttendanceLogPermission(permissions.BasePermission):
    #Verifica se o ALUNO pode ver o próprio log.
    def has_permission(self, request, view):
        return request.user.is_superuser or request.user.has_perm(f'{APP_NAME}.can_view_own_attendance_log')

class HasFinalizeAttendanceLogPermission(permissions.BasePermission):
    #Verifica se PROFESSOR pode finalizar/gerenciar o log.
    def has_permission(self, request, view):
        return request.user.is_superuser or request.user.has_perm(f'{APP_NAME}.can_finalize_attendance_log')

class HasAdminAttendanceLogPermission(permissions.BasePermission):
    #Verifica se tem o poder de COORDENADOR para administrar todos os logs.
    def has_permission(self, request, view):
        return request.user.is_superuser or request.user.has_perm(f'{APP_NAME}.can_administer_all_attendance_logs')
    

class HasExtraordinaryEventCreationPermission(permissions.BasePermission):
    #Verifica se pode CRIAR Evento Extraordinário (Professor/Coordenador).
    def has_permission(self, request, view):
        return request.user.is_superuser or request.user.has_perm(f'{APP_NAME}.can_create_extraordinary')

class HasExtraordinaryEventParticipationPermission(permissions.BasePermission):
    #Verifica se pode para PARTICIPAR de Evento Extraordinário (Professor).
    def has_permission(self, request, view):
        return request.user.is_superuser or request.user.has_perm(f'{APP_NAME}.can_participate_extraordinary')
    
class HasOrdinaryEventCreationPermission(permissions.BasePermission):
    message = 'Usuário não tem permissão para criar eventos ordinários.'

    def has_permission(self, request, view):
        # A permissão 'can_create_ordinary' agora deve ser atribuída ao grupo ALUNO.
        return request.user.has_perm(f'{APP_NAME}.can_create_ordinary')