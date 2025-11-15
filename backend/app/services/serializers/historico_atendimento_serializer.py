from rest_framework import serializers
from accounts.models import HistoricoAtendimento, Usuario, Disciplina


class HistoricoAtendimentoSerializer(serializers.ModelSerializer):
    usuario_nome = serializers.CharField(source='usuario.nome', read_only=True)
    disciplina_nome = serializers.CharField(source='disciplina.nome', read_only=True)
    percentual_cumprido = serializers.ReadOnlyField()
    status_cumprimento = serializers.ReadOnlyField()

    usuario_id = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.filter(tipoPerfil='PROF'),
        source='usuario',
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
            'usuario',
            'usuario_id', 
            'usuario_nome',
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