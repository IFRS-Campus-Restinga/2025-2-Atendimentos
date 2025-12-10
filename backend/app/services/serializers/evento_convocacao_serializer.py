from rest_framework import serializers
from accounts.models.evento_convocacao import EventoConvocacao
from accounts.models.usuario import Usuario
from django.db.models import Q
from datetime import datetime, timedelta, date


class EventoConvocacaoSerializer(serializers.ModelSerializer):

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
        - Perfis corretos: professor/aluno
        """
        data_evento = data.get('data_evento')
        hora_inicio = data.get('hora_evento_inicio')
        hora_fim = data.get('hora_evento_fim')
        curso = data.get('curso')
        professor = data.get('professor')
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
                curso_nome = curso.nome if curso else 'o curso selecionado'
                raise serializers.ValidationError({
                    'detail': f'Já existe uma convocação para o curso "{curso_nome}" no dia {data_evento.strftime("%d/%m/%Y")} '
                              f'das {evento.hora_evento_inicio.strftime("%H:%M")} às {evento.hora_evento_fim.strftime("%H:%M")}.'
                })

        # Validar perfis corretos
        if professor and professor.perfil.user != 'Professor':
            raise serializers.ValidationError({
                'detail': 'Usuário convocador deve ter perfil Professor.'
            })
        if aluno and aluno.perfil.user != 'Aluno':
            raise serializers.ValidationError({
                'detail': 'Usuário convocado deve ter perfil Aluno.'
            })

        return data