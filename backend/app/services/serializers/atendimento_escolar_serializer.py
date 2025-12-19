from rest_framework import serializers
from accounts.models.atendimentoescolar import AtendimentoEscolar

class AtendimentoEscolarSerializer(serializers.ModelSerializer):


    class Meta:
        model = AtendimentoEscolar
        fields = '__all__'
