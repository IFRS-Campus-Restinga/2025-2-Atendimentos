from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from datetime import datetime, timedelta, date, time
from accounts.models.evento_ordinario import EventoOrdinario
from ..serializers.evento_ordinario_serializer import EventoOrdinarioSerializer

from services.permissions import (
    HasOrdinaryEventCreationPermission, 
    APP_NAME
)

class EventoOrdinarioViewSet(viewsets.ModelViewSet):
    queryset = EventoOrdinario.objects.all().order_by('-data_evento', '-data_hora_evento')
    serializer_class = EventoOrdinarioSerializer
    permission_classes = [AllowAny]


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


    def create(self, request, *args, **kwargs):
        dia_semana = request.data.get('dia_semana')      
        data_fim = request.data.get('data_fim')          # 2025-10-31
        hora_str = request.data.get('data_hora_evento')  # 15:00
        turma = request.data.get('turma')
        limite = request.data.get('limite')
        usuario_create = request.user if request.user.is_authenticated else None

        # Convertendo tipos
        data_fim = datetime.strptime(data_fim, "%Y-%m-%d").date()
        hora_evento = datetime.strptime(hora_str, "%H:%M").time()

        map_dias = {
            'SEG': 0, 'TER': 1, 'QUA': 2,
            'QUI': 3, 'SEX': 4, 'SAB': 5, 'DOM': 6
        }

        weekday_target = map_dias[dia_semana]

        hoje = date.today()
        dias_ate_proximo = (weekday_target - hoje.weekday()) % 7
        data_atual = hoje + timedelta(days=dias_ate_proximo)

        eventos = []

        while data_atual <= data_fim:
            evento = EventoOrdinario.objects.create(
                dia_semana=dia_semana,
                data_evento=data_atual,
                data_hora_evento=hora_evento,
                turma=turma,
                limite=limite,
                usuario_create=usuario_create,
                data_inicio=hoje,
                data_fim=data_fim
            )
            eventos.append(evento)
            data_atual += timedelta(days=7)

        serializer = self.get_serializer(eventos, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
