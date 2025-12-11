from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from datetime import datetime, timedelta, date
from django.db import transaction

from accounts.models.evento_convocacao import EventoConvocacao
from accounts.models.curso import Curso
from accounts.models.usuario import Usuario
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
        data_evento_str = request.data.get('data_evento')
        hora_inicio_str = request.data.get('hora_evento_inicio')
        hora_fim_str = request.data.get('hora_evento_fim')
        curso = request.data.get('curso')
        disciplina = request.data.get('disciplina')
        limite = request.data.get('limite')
        mensagem = request.data.get('mensagem')
        aluno_id = request.data.get('aluno')

        # Buscar Usuario vinculado ao request.user
        usuario_create = None
        if request.user.is_authenticated:
            try:
                usuario_create = Usuario.objects.get(user=request.user)
            except Usuario.DoesNotExist:
                return Response(
                    {"detail": "Usuário autenticado não possui vínculo na tabela Usuario."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Validações básicas
        if not data_evento_str or not hora_inicio_str or not hora_fim_str:
            return Response(
                {"detail": "data_evento, hora_evento_inicio e hora_evento_fim são obrigatórios."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            data_evento = datetime.strptime(data_evento_str, "%Y-%m-%d").date()
            hora_inicio = datetime.strptime(hora_inicio_str, "%H:%M").time()
            hora_fim = datetime.strptime(hora_fim_str, "%H:%M").time()
        except Exception:
            return Response({"detail": "Formato inválido para data ou hora."}, status=status.HTTP_400_BAD_REQUEST)

        if hora_fim <= hora_inicio:
            return Response({"detail": "hora_evento_fim deve ser maior que hora_evento_inicio."},
                            status=status.HTTP_400_BAD_REQUEST)

        if data_evento < (date.today() + timedelta(days=1)):
            return Response({"detail": "Data do evento deve ser a partir de amanhã."},
                            status=status.HTTP_400_BAD_REQUEST)

        inicio_dt = datetime.combine(data_evento, hora_inicio)
        fim_dt = datetime.combine(data_evento, hora_fim)
        duracao = fim_dt - inicio_dt
        if duracao < timedelta(minutes=30):
            return Response({"detail": "Atendimento deve ter duração mínima de 30 minutos."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Verificar conflitos
        conflitos = EventoConvocacao.objects.filter(
            data_evento=data_evento,
            curso_id=curso,
            disciplina_id=disciplina,
            aluno_id=aluno_id,
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

        # Buscar aluno
        aluno_obj = Usuario.objects.filter(id=aluno_id, tipoPerfil="ALU").first()
        if not aluno_obj:
            return Response({"detail": "Aluno inválido. Deve ser um usuário com perfil ALU."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Criar evento (sem professor)
        with transaction.atomic():
            evento = EventoConvocacao.objects.create(
                data_evento=data_evento,
                hora_evento_inicio=hora_inicio,
                hora_evento_fim=hora_fim,
                curso_id=curso,
                disciplina_id=disciplina,
                limite=limite,
                mensagem=mensagem,
                aluno=aluno_obj,
                usuario_create=usuario_create,
            )

        serializer = self.get_serializer(evento)
        return Response(serializer.data, status=status.HTTP_201_CREATED)