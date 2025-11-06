from rest_framework import serializers
from accounts.models import Coordenador

class CoordenadorResumidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coordenador
        fields = ['id', 'email']
