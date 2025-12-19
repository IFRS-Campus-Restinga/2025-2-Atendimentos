from rest_framework import serializers
from accounts.models.evento_ordinario import EventoOrdinario
from accounts.enumerations.tipo_usuario import TipoUsuario
from accounts.models.usuario import Usuario
from django.db.models import Q


class EventoOrdinarioSerializer(serializers.ModelSerializer):
    can_change = serializers.SerializerMethodField()
    can_reagendar = serializers.SerializerMethodField()
    can_cancel = serializers.SerializerMethodField()
    can_approve = serializers.SerializerMethodField()

class EventoOrdinarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventoOrdinario
        fields = '__all__'

    def _has_perm_obj(self, perm_codename, obj):
        request = self.context.get('request') if hasattr(self, 'context') else None
        if not request or not getattr(request, 'user', None) or not request.user.is_authenticated:
            return False
        try:
            return request.user.has_perm(perm_codename, obj)
        except Exception:
            return False

    def get_can_change(self, obj):
        return (
            self._has_perm_obj('accounts.change_eventoordinario', obj)
            or self._has_perm_obj('accounts.change_evento', obj)
        )

    def get_can_reagendar(self, obj):
        return self._has_perm_obj('accounts.reschedule_event', obj)

    def get_can_cancel(self, obj):
        return self._has_perm_obj('accounts.cancel_event', obj)

    def get_can_approve(self, obj):
        return self._has_perm_obj('accounts.approve_event', obj)
    
    def get_status_choices(self, obj):
        return [{"value": choice[0], "label": choice[1]} 
                for choice in EventoOrdinario._meta.get_field("status_atendimento").choices]
    
    def validate(self, data):
        """
        Valida se já existe um evento ordinário no mesmo dia, turma e com horário conflitante.
        Valida também se a duração não excede 1 hora.
        """
        data_evento = data.get('data_evento')
        hora_inicio = data.get('hora_evento_inicio')
        hora_fim = data.get('hora_evento_fim')
        turma = data.get('turma')
        
        # Validar duração máxima de 1 hora
        if hora_inicio and hora_fim:
            from datetime import datetime, timedelta
            inicio_dt = datetime.combine(datetime.today(), hora_inicio)
            fim_dt = datetime.combine(datetime.today(), hora_fim)
            duracao = fim_dt - inicio_dt
            
            if duracao > timedelta(hours=1):
                raise serializers.ValidationError({
                    'detail': 'Atendimentos ordinários podem ter no máximo 1 hora de duração.'
                })
        
        # Se estamos editando, pegar o ID do objeto atual
        instance_id = self.instance.id if self.instance else None
        
        # Buscar eventos existentes no mesmo dia e turma
        conflitos = EventoOrdinario.objects.filter(
            data_evento=data_evento,
            turma=turma
        )
        
        # Excluir o próprio evento se for edição
        if instance_id:
            conflitos = conflitos.exclude(id=instance_id)
        
        # Verificar sobreposição de horários
        for evento in conflitos:
            # Verifica se há sobreposição: novo evento começa antes do existente terminar
            # E novo evento termina depois do existente começar
            if (hora_inicio < evento.hora_evento_fim and hora_fim > evento.hora_evento_inicio):
                turma_nome = turma.nome if turma else 'a turma selecionada'
                raise serializers.ValidationError({
                    'detail': f'Já existe um atendimento agendado para a turma "{turma_nome}" no dia {data_evento.strftime("%d/%m/%Y")} '
                             f'das {evento.hora_evento_inicio.strftime("%H:%M")} às {evento.hora_evento_fim.strftime("%H:%M")}.'
                })
        
        return data