from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from accounts.models.evento_ordinario import EventoOrdinario
from ..serializers.evento_ordinario_serializer import EventoOrdinarioSerializer

from services.permissions import (
    HasOrdinaryEventCreationPermission, 
    APP_NAME
)

class EventoOrdinarioViewSet(viewsets.ModelViewSet):
    queryset = EventoOrdinario.objects.all().order_by('-data_hora')
    serializer_class = EventoOrdinarioSerializer
    #permission_classes = [AllowAny]


    def get_queryset(self):
        user = self.request.user
        
        # Superuser sempre vê tudo (incluído no has_perm de Admin Geral)
        if user.has_perm(f'{APP_NAME}.can_administer_all_events'):
            return EventoOrdinario.objects.all().order_by('-data_hora')
        
        # Professor/Coordenador: Vê todos os eventos para poder confirmar.
        from services.permissions import HasExtraordinaryEventCreationPermission
        if HasExtraordinaryEventCreationPermission().has_permission(self.request, self):
            return EventoOrdinario.objects.all().order_by('-data_hora')

        # Aluno (e qualquer outro usuário autenticado): Vê apenas os eventos que ele criou.
        if user.is_authenticated:
            # O Aluno só pode visualizar o que ele mesmo criou
            return EventoOrdinario.objects.filter(usuario_create=user).order_by('-data_hora')

        # Usuário anônimo: não vê nada
        return EventoOrdinario.objects.none()



    def get_permissions(self):
            # A permissão HasOrdinaryEventCreationPermission é agora para o ALUNO
            if self.action == 'create':
                permission_classes = [HasOrdinaryEventCreationPermission] 
                
            # Ação para o Professor/Coordenador mudar o status (Update)
            elif self.action in ['update', 'partial_update']:
                # Apenas Professor/Coordenador/Admin podem editar o evento para CONFIRMAR.
                from services.permissions import HasExtraordinaryEventCreationPermission
                permission_classes = [HasExtraordinaryEventCreationPermission] 
                
            elif self.action in ['list', 'retrieve', 'destroy']:
                # Aluno e Professor podem listar. A filtragem é feita no get_queryset.
                # O DELETE está bloqueado por IsAuthenticated por enquanto
                # mas terá uma nova permissão de criação e deleção depois por dono (quem criou).
                permission_classes = [IsAuthenticated]
                
            else:
                permission_classes = [IsAuthenticated]
                    
            return [permission() for permission in permission_classes]