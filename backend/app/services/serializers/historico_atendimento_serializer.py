from rest_framework import serializers
from accounts.models import HistoricoAtendimento, Professor, Disciplina


class HistoricoAtendimentoSerializer(serializers.ModelSerializer):
    professor_nome = serializers.CharField(source='professor.registro', read_only=True)
    disciplina_nome = serializers.CharField(source='disciplina.nome', read_only=True)
    percentual_cumprido = serializers.ReadOnlyField()
    status_cumprimento = serializers.ReadOnlyField()

    professor_id = serializers.PrimaryKeyRelatedField(
        queryset=Professor.objects.all(),
        source='professor',
        write_only=True
    )
    disciplina_id = serializers.PrimaryKeyRelatedField(
        queryset=Disciplina.objects.all(),
        source='disciplina',
        write_only=True
    )

    class Meta:
        model = HistoricoAtendimento
        fields = [
            'id',
            'professor',
            'professor_id',
            'professor_nome',
            'disciplina',
            'disciplina_id',
            'disciplina_nome',
            'horas_ofertadas',
            'horas_obrigatorias',
            'mes_referencia',
            'observacoes',
            'percentual_cumprido',
            'status_cumprimento',
            'created_at',
            'updated_at'
        ]