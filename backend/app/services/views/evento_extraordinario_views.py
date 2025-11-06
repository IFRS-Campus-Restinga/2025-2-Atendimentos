from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from accounts.models.evento_extraordinario import EventoExtraordinario
from services.serializers.evento_extraordinario_serializer import EventoExtraordinarioSerializer
from services.permissions import (
    HasExtraordinaryEventCreationPermission, 
    HasExtraordinaryEventParticipationPermission, 
    HasAdminAttendanceLogPermission, 
    APP_NAME
)

class EventoExtraordinarioViewSet(viewsets.ModelViewSet):
    queryset = EventoExtraordinario.objects.all()
    serializer_class = EventoExtraordinarioSerializer
    #permission_classes = [AllowAny]

    def get_queryset(self):
        user = self.request.user
        
        # ADMIN/COORDENADOR: Vê tudo
        if user.has_perm(f'{APP_NAME}.can_administer_all_events'):
             return EventoExtraordinario.objects.all()
        
        # PROFESSOR (Criador ou Participante): Vê os que ele criou ou participa
        elif user.has_perm(f'{APP_NAME}.can_create_extraordinary') or \
             user.has_perm(f'{APP_NAME}.can_participate_extraordinary'):
             return EventoExtraordinario.objects.filter(usuario_create=user)
             
        # Alunos e Pendentes não podem ver nada por padrão
        return EventoExtraordinario.objects.none()

    # Controla o que o usuário pode fazer
    def get_permissions(self):
        if self.action == 'create':
            # Apenas quem pode CRIAR (Professor/Coordenador/Admin)
            permission_classes = [HasExtraordinaryEventCreationPermission] 
        elif self.action in ['list', 'retrieve']:
            # Apenas quem pode PARTICIPAR (Professor) ou CRIAR
            permission_classes = [HasExtraordinaryEventParticipationPermission | HasExtraordinaryEventCreationPermission]
        elif self.action in ['update', 'partial_update', 'destroy']:
            # Editar/Deletar: Apenas quem pode CRIAR/ADMINISTRAR
            permission_classes = [HasExtraordinaryEventCreationPermission | HasAdminAttendanceLogPermission] 
        else:
            permission_classes = [IsAuthenticated]
            
        return [permission() for permission in permission_classes]