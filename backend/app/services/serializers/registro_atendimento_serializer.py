from rest_framework import serializers
from accounts.models import RegistroAtendimento, Evento
from accounts.enumerations.status_atendimento import StatusAtendimento
from django.utils import timezone
from datetime import datetime

class RegistroAtendimentoSerializer(serializers.ModelSerializer):
    # Envio do ID do evento no POST (apenas se o evento estiver confirmado)
    evento = serializers.PrimaryKeyRelatedField(
        queryset=Evento.objects.filter(status_atendimento=StatusAtendimento.CONFIRMADO),
        write_only=True
    )

    # Campo adicional para exibição no GET
    evento_id = serializers.IntegerField(source="evento.id", read_only=True)

    # Campos derivados para facilitar o consumo no frontend
    turma = serializers.CharField(source="evento.turma", read_only=True)
    data_evento = serializers.DateTimeField(source="evento.data_hora", read_only=True)
    status_evento = serializers.CharField(source="evento.status_atendimento", read_only=True)

    class Meta:
        model = RegistroAtendimento
        fields = [
            "id",
            "evento",            # usado apenas no POST
            "evento_id",         # exibição no GET
            "data_atendimento",
            "descricao",
            "turma",             # campo derivado
            "data_evento",       # campo derivado
            "status_evento",     # campo derivado
        ]

    # --- Validações ---

    def validate_data_atendimento(self, value):
        """
        Garante que a data de atendimento seja posterior a 01/01/2000.
        """
        ano_2000_naive = datetime(2000, 1, 1)
        ano_2000_aware = timezone.make_aware(ano_2000_naive, timezone.get_current_timezone())
        if value < ano_2000_aware:
            raise serializers.ValidationError("A data de atendimento deve ser posterior a 01/01/2000.")
        return value

    def validate_evento(self, value):
        """
        Garante que o evento esteja confirmado.
        """
        if value.status_atendimento != StatusAtendimento.CONFIRMADO:
            raise serializers.ValidationError("Só é possível criar um registro para um evento confirmado.")
        return value

    def validate_evento(self, value):
        if RegistroAtendimento.objects.filter(evento=value).exists():
            raise serializers.ValidationError("Já existe um registro para esse evento.")
        return value