from rest_framework import serializers
from accounts.models.servidor import Servidor

class ServidorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servidor
        fields = '__all__'

    def create(self, validated_data):
        validated_data['tipoPerfil'] = 'SERV'
        return super().create(validated_data)

    def validate_servidor(self, value):
        value = value.strip()
        if len(value) < 10:
            raise serializers.ValidationError("O campo 'servidor' deve conter pelo menos 10 caracteres.")
        if len(value) > 30:
            raise serializers.ValidationError("O campo 'servidor' não pode exceder 30 caracteres.")
        return value