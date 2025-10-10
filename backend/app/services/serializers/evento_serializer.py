from rest_framework import serializers
from accounts.models import Usuario, Evento
from .usuario_serializer import UsuarioSerializer

class EventoSerializer(serializers.ModelSerializer):

    usuarios = UsuarioSerializer(many=True, read_only=True)
    usuario_create = UsuarioSerializer(read_only=True)

    usuarios_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Usuario.objects.all(),
        write_only=True,
        source='usuarios'  
    )


    class Meta:
        model = Evento
        fields = "__all__"