from rest_framework import serializers
from accounts.models.evento_convocacao import EventoConvocacao
from accounts.models.usuario import Usuario
from datetime import datetime, timedelta, date


class EventoConvocacaoSerializer(serializers.ModelSerializer):
    can_approve = serializers.SerializerMethodField()
    can_cancel = serializers.SerializerMethodField()
    can_reagendar = serializers.SerializerMethodField()
    can_change = serializers.SerializerMethodField()

    class Meta:
        model = EventoConvocacao
        fields = '__all__'

    def get_status_choices(self, obj):
        return [
            {"value": choice[0], "label": choice[1]}
            for choice in EventoConvocacao._meta.get_field("status_atendimento").choices
        ]

    def validate(self, data):
        """
        Validações específicas para EventoConvocacao:
        - Data mínima: >= amanhã
        - Duração mínima: 30 minutos
        - Conflito de horário na mesma turma
        - Perfil correto: aluno deve ser ALU
        """
        data_evento = data.get('data_evento')
        hora_inicio = data.get('hora_evento_inicio')
        hora_fim = data.get('hora_evento_fim')
        curso = data.get('curso')
        aluno = data.get('aluno')

        # Validação: data mínima = amanhã
        if data_evento and data_evento < (date.today() + timedelta(days=1)):
            raise serializers.ValidationError({
                'detail': 'Data do evento deve ser a partir de amanhã.'
            })

        # Validação: duração mínima de 30 minutos
        if hora_inicio and hora_fim:
            inicio_dt = datetime.combine(datetime.today(), hora_inicio)
            fim_dt = datetime.combine(datetime.today(), hora_fim)
            duracao = fim_dt - inicio_dt

            if duracao < timedelta(minutes=30):
                raise serializers.ValidationError({
                    'detail': 'Atendimento deve ter duração mínima de 30 minutos.'
                })

        # Se estamos editando, pegar o ID do objeto atual
        instance_id = self.instance.id if self.instance else None

        # Buscar eventos existentes no mesmo dia e turma
        conflitos = EventoConvocacao.objects.filter(
            data_evento=data_evento,
            curso=data.get('curso'),
            disciplina=data.get('disciplina'),
            aluno=data.get('aluno'),
        )

        # Excluir o próprio evento se for edição
        if instance_id:
            conflitos = conflitos.exclude(id=instance_id)

        # Verificar sobreposição de horários
        for evento in conflitos:
            if (hora_inicio < evento.hora_evento_fim and hora_fim > evento.hora_evento_inicio):
                curso_nome = getattr(curso, "nome", "o curso selecionado")
                raise serializers.ValidationError({
                    'detail': f'Já existe uma convocação para o curso "{curso_nome}" no dia {data_evento.strftime("%d/%m/%Y")} '
                              f'das {evento.hora_evento_inicio.strftime("%H:%M")} às {evento.hora_evento_fim.strftime("%H:%M")}.'
                })

        # Validar perfil correto do aluno
        if aluno and isinstance(aluno, Usuario) and aluno.tipoPerfil != 'ALU':
            raise serializers.ValidationError({
                'detail': 'Usuário convocado deve ter perfil Aluno.'
            })

        return data

    def _has_perm_obj(self, perm_codename, obj):
        request = self.context.get('request') if hasattr(self, 'context') else None
        if not request or not getattr(request, 'user', None) or not request.user.is_authenticated:
            return False
        try:
            return request.user.has_perm(perm_codename, obj)
        except Exception:
            return False

    def get_can_approve(self, obj):
        return self._has_perm_obj('accounts.approve_event', obj)

    def get_can_cancel(self, obj):
        return (
            self._has_perm_obj('accounts.cancel_event', obj)
            or self._has_perm_obj('accounts.end_convocation', obj)
        )

    def get_can_reagendar(self, obj):
        return self._has_perm_obj('accounts.reschedule_event', obj)

    def get_can_change(self, obj):
        return (
            self._has_perm_obj('accounts.change_eventoconvocacao', obj)
            or self._has_perm_obj('accounts.change_evento', obj)
        )