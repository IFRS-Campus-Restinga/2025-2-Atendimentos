from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from datetime import datetime, timedelta, date, time
from accounts.models.evento_ordinario import EventoOrdinario
from ..serializers.evento_ordinario_serializer import EventoOrdinarioSerializer

class EventoOrdinarioViewSet(viewsets.ModelViewSet):
    queryset = EventoOrdinario.objects.all().order_by('-data_evento', '-hora_evento_inicio')
    serializer_class = EventoOrdinarioSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        dia_semana = request.data.get('dia_semana')      
        data_fim = request.data.get('data_fim')          # 2025-10-31
        hora_inicio_str = request.data.get('hora_evento_inicio')  # 15:00
        hora_fim_str = request.data.get('hora_evento_fim')        # 16:00
        # compat: aceitar payload antigo
        if not hora_inicio_str and request.data.get('hora_evento'):
            hora_inicio_str = request.data.get('hora_evento')
        turma = request.data.get('turma')
        disciplina = request.data.get('disciplina')
        limite = request.data.get('limite')
        usuario_create = request.user if request.user.is_authenticated else None

        # Convertendo tipos
        data_fim = datetime.strptime(data_fim, "%Y-%m-%d").date()
        hora_inicio = datetime.strptime(hora_inicio_str, "%H:%M").time()
        if not hora_fim_str:
            return Response({"detail": "hora_evento_fim é obrigatório."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            hora_fim = datetime.strptime(hora_fim_str, "%H:%M").time()
        except Exception:
            return Response({"detail": "hora_evento_fim inválido."}, status=status.HTTP_400_BAD_REQUEST)
        if hora_fim <= hora_inicio:
            return Response({"detail": "hora_evento_fim deve ser maior que hora_evento_inicio."}, status=status.HTTP_400_BAD_REQUEST)

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
                hora_evento_inicio=hora_inicio,
                hora_evento_fim=hora_fim,
                turma_id=turma,
                disciplina_id=disciplina,
                limite=limite,
                usuario_create=usuario_create,
                data_inicio=hoje,
                data_fim=data_fim
            )
            eventos.append(evento)
            data_atual += timedelta(days=7)

        serializer = self.get_serializer(eventos, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
