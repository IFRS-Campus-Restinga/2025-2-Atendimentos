from rest_framework import serializers
from accounts.models import Turma, Atendimento
from accounts.serializers.turma_serializer import TurmaSerializer

class AtendimentoSerializer(serializers.ModelSerializer):

    turma = TurmaSerializer(read_only=True)

    turma_id = serializers.PrimaryKeyRelatedField(
        queryset=Turma.objects.all(), source="turma", write_only=True
    )

    class Meta:
        model = Atendimento
        fields = "__all__"