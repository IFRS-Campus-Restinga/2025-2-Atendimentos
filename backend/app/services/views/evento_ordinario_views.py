from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from datetime import datetime, timedelta, date, time
from accounts.models.evento_ordinario import EventoOrdinario
from ..serializers.evento_ordinario_serializer import EventoOrdinarioSerializer

class EventoOrdinarioViewSet(viewsets.ModelViewSet):
    queryset = EventoOrdinario.objects.all().order_by('-data_evento', '-data_hora_evento')
    serializer_class = EventoOrdinarioSerializer
    permission_classes = [AllowAny]

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
