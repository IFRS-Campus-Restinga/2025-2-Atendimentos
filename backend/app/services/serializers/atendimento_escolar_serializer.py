from rest_framework import serializers
from accounts.models.atendimentoescolar import AtendimentoEscolar

class AtendimentoEscolarSerializer(serializers.ModelSerializer):

    usuario_nome = serializers.CharField(source='solicitante.nome', read_only=True)

    class Meta:
        model = AtendimentoEscolar
        fields = '__all__'
        read_only_fields = ['criado_em']
