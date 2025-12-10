from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from datetime import datetime, timedelta, date
from django.db import transaction
from rest_framework.decorators import action

from accounts.models.evento_convocacao import EventoConvocacao
from accounts.models.curso import Curso
from ..serializers.evento_convocacao_serializer import EventoConvocacaoSerializer


class EventoConvocacaoViewSet(viewsets.ModelViewSet):
    queryset = EventoConvocacao.objects.all().order_by('-data_evento', '-hora_evento_inicio')
    serializer_class = EventoConvocacaoSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        curso_id = self.request.query_params.get('curso')
        if curso_id:
            qs = qs.filter(curso_id=curso_id)
        return qs

    def create(self, request, *args, **kwargs):
        data_evento_str = request.data.get('data_evento')  # formato YYYY-MM-DD
        hora_inicio_str = request.data.get('hora_evento_inicio')
        hora_fim_str = request.data.get('hora_evento_fim')
        curso = request.data.get('curso')
        disciplina = request.data.get('disciplina')
        limite = request.data.get('limite')
        mensagem = request.data.get('mensagem')
        professor = request.data.get('professor')
        aluno = request.data.get('aluno')
        usuario_create = request.user if request.user.is_authenticated else None

        # Validar campos obrigatórios
        if not data_evento_str or not hora_inicio_str or not hora_fim_str:
            return Response({"detail": "data_evento, hora_evento_inicio e hora_evento_fim são obrigatórios."},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            data_evento = datetime.strptime(data_evento_str, "%Y-%m-%d").date()
            hora_inicio = datetime.strptime(hora_inicio_str, "%H:%M").time()
            hora_fim = datetime.strptime(hora_fim_str, "%H:%M").time()
        except Exception:
            return Response({"detail": "Formato inválido para data ou hora."}, status=status.HTTP_400_BAD_REQUEST)

        if hora_fim <= hora_inicio:
            return Response({"detail": "hora_evento_fim deve ser maior que hora_evento_inicio."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Validação: data mínima = amanhã
        if data_evento < (date.today() + timedelta(days=1)):
            return Response({"detail": "Data do evento deve ser a partir de amanhã."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Validação: duração mínima de 30 minutos
        inicio_dt = datetime.combine(data_evento, hora_inicio)
        fim_dt = datetime.combine(data_evento, hora_fim)
        duracao = fim_dt - inicio_dt
        if duracao < timedelta(minutes=30):
            return Response({"detail": "Atendimento deve ter duração mínima de 30 minutos."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Verificar conflitos na turma
        conflitos = EventoConvocacao.objects.filter(
            data_evento=data_evento,
            curso_id=curso,
            disciplina_id=disciplina,
            aluno_id=aluno,
        ).exclude(
            hora_evento_fim__lte=hora_inicio
        ).exclude(
            hora_evento_inicio__gte=hora_fim
        )

        if conflitos.exists():
            primeiro_conflito = conflitos.first()
            curso_obj = Curso.objects.filter(id=curso).first()
            curso_nome = curso_obj.nome if curso_obj else 'o curso selecionado'
            return Response({
                "detail": f"Conflito de horário detectado para o curso \"{curso_nome}\" no dia {data_evento.strftime('%d/%m/%Y')}. "
                          f"Já existe um atendimento das {primeiro_conflito.hora_evento_inicio.strftime('%H:%M')} "
                          f"às {primeiro_conflito.hora_evento_fim.strftime('%H:%M')}."
            }, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            evento = EventoConvocacao.objects.create(
                data_evento=data_evento,
                hora_evento_inicio=hora_inicio,
                hora_evento_fim=hora_fim,
                curso_id=curso,
                disciplina_id=disciplina,
                limite=limite,
                mensagem=mensagem,
                professor_id=professor,
                aluno_id=aluno,
                usuario_create=usuario_create,
            )

        serializer = self.get_serializer(evento)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["patch"], url_path="editar")
    def editar(self, request, pk=None):
        ev = self.get_object()

        hora_inicio_str = request.data.get('hora_evento_inicio')
        hora_fim_str = request.data.get('hora_evento_fim')
        curso = request.data.get('curso')
        disciplina = request.data.get('disciplina')
        limite = request.data.get('limite')
        status_atendimento = request.data.get('status_atendimento')
        mensagem = request.data.get('mensagem')

        try:
            hora_inicio = datetime.strptime(hora_inicio_str, "%H:%M").time() if hora_inicio_str else ev.hora_evento_inicio
            hora_fim = datetime.strptime(hora_fim_str, "%H:%M").time() if hora_fim_str else ev.hora_evento_fim
        except Exception:
            return Response({"detail": "Horários inválidos."}, status=status.HTTP_400_BAD_REQUEST)

        if hora_fim <= hora_inicio:
            return Response({"detail": "hora_evento_fim deve ser maior que hora_evento_inicio."},
                            status=status.HTTP_400_BAD_REQUEST)

        inicio_dt = datetime.combine(ev.data_evento, hora_inicio)
        fim_dt = datetime.combine(ev.data_evento, hora_fim)
        duracao = fim_dt - inicio_dt
        if duracao < timedelta(minutes=30):
            return Response({"detail": "Atendimento deve ter duração mínima de 30 minutos."},
                            status=status.HTTP_400_BAD_REQUEST)

        ev.hora_evento_inicio = hora_inicio
        ev.hora_evento_fim = hora_fim
        if curso is not None:
            ev.curso_id = curso
        if disciplina is not None:
            ev.disciplina_id = disciplina
        if limite is not None:
            ev.limite = limite
        if status_atendimento is not None:
            ev.status_atendimento = status_atendimento
        if mensagem is not None:
            ev.mensagem = mensagem
        ev.save()

        return Response(self.get_serializer(ev).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"], url_path="series-count")
    def series_count(self, request, pk=None):
        ev = self.get_object()
        series_qs = EventoConvocacao.objects.filter(
            professor_id=ev.professor_id,
            aluno_id=ev.aluno_id,
            curso_id=ev.curso_id,
            disciplina_id=ev.disciplina_id,
            hora_evento_inicio=ev.hora_evento_inicio,
            hora_evento_fim=ev.hora_evento_fim,
            data_evento__gte=ev.data_evento,
        )
        return Response({"count": series_qs.count()}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], url_path="encerrar")
    def encerrar(self, request, pk=None):
        ev = self.get_object()
        now = datetime.now()
        inicio_dt = datetime.combine(ev.data_evento, ev.hora_evento_inicio)
        min_end = inicio_dt + timedelta(minutes=30)
        ev.encerrado_em = max(now, min_end)
        ev.status_atendimento = "CONCLUIDO"
        ev.save()
        return Response(self.get_serializer(ev).data, status=status.HTTP_200_OK)