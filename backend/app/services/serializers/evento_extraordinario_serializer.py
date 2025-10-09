from rest_framework import serializers
from accounts.models.evento_extraordinario import EventoExtraordinario
from accounts.models.usuario import Usuario

class EventoExtraordinarioSerializer(serializers.ModelSerializer):
    usuarios = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Usuario.objects.filter(tipoPerfil='PROF')
    )

    class Meta:
        model = EventoExtraordinario
        fields = '__all__'
