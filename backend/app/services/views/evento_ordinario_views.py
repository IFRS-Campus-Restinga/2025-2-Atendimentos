from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from datetime import datetime, timedelta, date, time
from accounts.models.evento_ordinario import EventoOrdinario
from accounts.models.turma import Turma
from django.db import transaction
from rest_framework.decorators import action
from ..serializers.evento_ordinario_serializer import EventoOrdinarioSerializer

class EventoOrdinarioViewSet(viewsets.ModelViewSet):
    queryset = EventoOrdinario.objects.all().order_by('-data_evento', '-hora_evento_inicio')
    serializer_class = EventoOrdinarioSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        turma_id = self.request.query_params.get('turma')
        if turma_id:
            qs = qs.filter(turma_id=turma_id)
        return qs

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
        sala = request.data.get('sala')
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
        
        # Validar duração máxima de 1 hora
        inicio_dt = datetime.combine(date.today(), hora_inicio)
        fim_dt = datetime.combine(date.today(), hora_fim)
        duracao = fim_dt - inicio_dt
        if duracao > timedelta(hours=1):
            return Response({"detail": "Atendimentos ordinários podem ter no máximo 1 hora de duração."}, status=status.HTTP_400_BAD_REQUEST)

        map_dias = {
            'SEG': 0, 'TER': 1, 'QUA': 2,
            'QUI': 3, 'SEX': 4, 'SAB': 5, 'DOM': 6
        }

        weekday_target = map_dias[dia_semana]

        hoje = date.today()
        dias_ate_proximo = (weekday_target - hoje.weekday()) % 7
        data_atual = hoje + timedelta(days=dias_ate_proximo)

        eventos = []

        with transaction.atomic():
            while data_atual <= data_fim:
                # Verificar se já existe evento nesse dia/hora/turma
                conflitos = EventoOrdinario.objects.filter(
                    data_evento=data_atual,
                    turma_id=turma
                ).exclude(
                    hora_evento_fim__lte=hora_inicio
                ).exclude(
                    hora_evento_inicio__gte=hora_fim
                )
                
                if conflitos.exists():
                    primeiro_conflito = conflitos.first()
                    turma_obj = Turma.objects.filter(id=turma).first()
                    turma_nome = turma_obj.nome if turma_obj else 'a turma selecionada'
                    return Response({
                        "detail": f"Conflito de horário detectado para a turma \"{turma_nome}\" no dia {data_atual.strftime('%d/%m/%Y')}. "
                                 f"Já existe um atendimento das {primeiro_conflito.hora_evento_inicio.strftime('%H:%M')} "
                                 f"às {primeiro_conflito.hora_evento_fim.strftime('%H:%M')}."
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                evento = EventoOrdinario.objects.create(
                    dia_semana=dia_semana,
                    data_evento=data_atual,
                    hora_evento_inicio=hora_inicio,
                    hora_evento_fim=hora_fim,
                    turma_id=turma,
                    disciplina_id=disciplina,
                    limite=limite,
                    sala=sala,
                    usuario_create=usuario_create,
                    data_inicio=hoje,
                    data_fim=data_fim
                )
                eventos.append(evento)
                data_atual += timedelta(days=7)

        serializer = self.get_serializer(eventos, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["patch"], url_path="editar")
    def editar(self, request, pk=None):
        ev = self.get_object()
        apply_scope = request.data.get("apply_scope", "single").lower()

        # Campos possíveis de atualização
        hora_inicio_str = request.data.get('hora_evento_inicio')
        hora_fim_str = request.data.get('hora_evento_fim')
        turma = request.data.get('turma')
        disciplina = request.data.get('disciplina')
        limite = request.data.get('limite')
        status_atendimento = request.data.get('status_atendimento')
        dia_semana_novo = request.data.get('dia_semana')

        # Validar horários
        if hora_inicio_str:
            try:
                hora_inicio = datetime.strptime(hora_inicio_str, "%H:%M").time()
            except Exception:
                return Response({"detail": "hora_evento_inicio inválido."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            hora_inicio = ev.hora_evento_inicio

        if not hora_fim_str:
            return Response({"detail": "hora_evento_fim é obrigatório."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            hora_fim = datetime.strptime(hora_fim_str, "%H:%M").time()
        except Exception:
            return Response({"detail": "hora_evento_fim inválido."}, status=status.HTTP_400_BAD_REQUEST)
        if hora_fim <= hora_inicio:
            return Response({"detail": "hora_evento_fim deve ser maior que hora_evento_inicio."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Validar duração máxima de 1 hora
        inicio_dt = datetime.combine(date.today(), hora_inicio)
        fim_dt = datetime.combine(date.today(), hora_fim)
        duracao = fim_dt - inicio_dt
        if duracao > timedelta(hours=1):
            return Response({"detail": "Atendimentos ordinários podem ter no máximo 1 hora de duração."}, status=status.HTTP_400_BAD_REQUEST)

        def apply_updates(obj):
            obj.hora_evento_inicio = hora_inicio
            obj.hora_evento_fim = hora_fim
            if turma is not None:
                obj.turma_id = turma
            if disciplina is not None:
                obj.disciplina_id = disciplina
            if limite is not None:
                obj.limite = limite
            if status_atendimento is not None:
                obj.status_atendimento = status_atendimento
            obj.save()

        if apply_scope == "series":
            # filtra pela recorrência deste evento, a partir da data atual deste
            series_qs = EventoOrdinario.objects.filter(
                dia_semana=ev.dia_semana,
                turma_id=ev.turma_id,
                disciplina_id=ev.disciplina_id,
                hora_evento_inicio=ev.hora_evento_inicio,
                hora_evento_fim=ev.hora_evento_fim,
                data_evento__gte=ev.data_evento,
            ).order_by('data_evento')

            # Se for alterar o dia da semana, recalcula a data_evento para cada ocorrência, mantendo a mesma semana
            map_dias = {
                'SEG': 0, 'TER': 1, 'QUA': 2,
                'QUI': 3, 'SEX': 4, 'SAB': 5, 'DOM': 6
            }
            novo_weekday = None
            if dia_semana_novo:
                if dia_semana_novo not in map_dias:
                    return Response({"detail": "dia_semana inválido."}, status=status.HTTP_400_BAD_REQUEST)
                novo_weekday = map_dias[dia_semana_novo]

            try:
                with transaction.atomic():
                    for item in series_qs:
                        # aplica campos comuns
                        apply_updates(item)
                        # aplica mudança de dia da semana, movendo a ocorrência para o PRÓXIMO dia alvo
                        if novo_weekday is not None:
                            current_wd = item.data_evento.weekday()
                            delta_days = (novo_weekday - current_wd) % 7
                            # se o novo dia for o mesmo, delta ficará 0 (mantém a data); se diferente, 1..6 (sempre para frente)
                            item.data_evento = item.data_evento + timedelta(days=delta_days)
                            item.dia_semana = dia_semana_novo
                            item.save()
                return Response({"updated": series_qs.count()}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"detail": f"Falha ao atualizar recorrência: {e}"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # single
            if dia_semana_novo:
                # Edição de dia_da_semana só faz sentido para recorrência
                return Response({"detail": "dia_semana só pode ser alterado para a recorrência (apply_scope='series')."}, status=status.HTTP_400_BAD_REQUEST)
            try:
                apply_updates(ev)
                return Response(self.get_serializer(ev).data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"detail": f"Falha ao atualizar evento: {e}"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["get"], url_path="series-count")
    def series_count(self, request, pk=None):
        ev = self.get_object()
        series_qs = EventoOrdinario.objects.filter(
            dia_semana=ev.dia_semana,
            turma_id=ev.turma_id,
            disciplina_id=ev.disciplina_id,
            hora_evento_inicio=ev.hora_evento_inicio,
            hora_evento_fim=ev.hora_evento_fim,
            data_evento__gte=ev.data_evento,
        )
        return Response({"count": series_qs.count()}, status=status.HTTP_200_OK)
