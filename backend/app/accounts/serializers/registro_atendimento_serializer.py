from rest_framework import serializers
from accounts.models import RegistroAtendimento, Atendimento
from accounts.enumerations.status_atendimento import StatusAtendimento
from django.utils import timezone
from datetime import datetime
from accounts.serializers.atendimento_serializer import AtendimentoSerializer

class RegistroAtendimentoSerializer(serializers.ModelSerializer):
    # Envio do ID no POST
    atendimento = serializers.PrimaryKeyRelatedField(
        queryset=Atendimento.objects.filter(status=StatusAtendimento.CONFIRMADO),
        write_only=True
    )

    # Campo adicional para frontend saber qual atendimento já tem registro
    atendimento_id = serializers.IntegerField(source="atendimento.id", read_only=True)

    # Campos derivados para exibição no GET
    turma_nome = serializers.SerializerMethodField()
    tipo_atendimento = serializers.SerializerMethodField()
    data_hora_atendimento = serializers.SerializerMethodField()

    class Meta:
        model = RegistroAtendimento
        fields = [
            "id",
            "atendimento",       # apenas para POST
            "atendimento_id",    # novo campo somente leitura
            "data_atendimento",
            "descricao",
            "turma_nome",
            "tipo_atendimento",
            "data_hora_atendimento"
        ]

    def get_turma_nome(self, obj):
        if obj.atendimento and obj.atendimento.turma:
            return obj.atendimento.turma.nome
        return "-"

    def get_tipo_atendimento(self, obj):
        if obj.atendimento:
            return obj.atendimento.tipo_atendimento
        return "-"

    def get_data_hora_atendimento(self, obj):
        if obj.atendimento:
            return obj.atendimento.data_hora
        return None

    def validate_data_atendimento(self, value):
        ano_2000_naive = datetime(2000, 1, 1)
        ano_2000_aware = timezone.make_aware(ano_2000_naive, timezone.get_current_timezone())
        if value < ano_2000_aware:
            raise serializers.ValidationError("A data de atendimento deve ser posterior a 01/01/2000.")
        return value

    def validate_atendimento(self, value):
        if value.status != StatusAtendimento.CONFIRMADO:
            raise serializers.ValidationError("Só é possível criar um registro para um atendimento confirmado.")
        return value
