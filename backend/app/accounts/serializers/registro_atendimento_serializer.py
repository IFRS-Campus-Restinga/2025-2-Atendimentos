from rest_framework import serializers
from accounts.models import RegistroAtendimento, Atendimento
from accounts.enumerations.status_atendimento import StatusAtendimento
from django.utils import timezone
from datetime import datetime

class RegistroAtendimentoSerializer(serializers.ModelSerializer):
    atendimento = serializers.PrimaryKeyRelatedField(queryset=Atendimento.objects.all())

    class Meta:
        model = RegistroAtendimento
        fields = ['id', 'atendimento', 'data_atendimento', 'descricao']

    def validate_data_atendimento(self, value):
        """Valida que a data do atendimento seja posterior a 01/01/2000."""
        ano_2000_naive = datetime(2000, 1, 1)
        ano_2000_aware = timezone.make_aware(ano_2000_naive, timezone.get_current_timezone())
        if value < ano_2000_aware:
            raise serializers.ValidationError("A data de atendimento deve ser posterior a 01/01/2000.")
        return value

    def validate_atendimento(self, value):
        """Valida que o atendimento esteja confirmado."""
        if value.status != StatusAtendimento.CONFIRMADO:
            raise serializers.ValidationError("Só é possível criar um registro para um atendimento confirmado.")
        return value
