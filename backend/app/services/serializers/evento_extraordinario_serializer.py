from rest_framework import serializers
from accounts.models.evento_extraordinario import EventoExtraordinario
from accounts.models.usuario import Usuario

class EventoExtraordinarioSerializer(serializers.ModelSerializer):
    # Permite enviar vazio ou ignorar completamente o campo
    usuarios = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Usuario.objects.all(),
        required=False,
        allow_empty=True
    )

    class Meta:
        model = EventoExtraordinario
        fields = '__all__'
        read_only_fields = ['usuario_create']
