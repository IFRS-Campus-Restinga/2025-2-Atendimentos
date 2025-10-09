from rest_framework import serializers
from accounts.models.evento_ordinario import EventoOrdinario
from accounts.models.usuario import Usuario

class EventoOrdinarioSerializer(serializers.ModelSerializer):
    
    usuarios = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Usuario.objects.filter(tipoPerfil='ALU')
    )

    class Meta:
        model = EventoOrdinario
        fields = '__all__'
