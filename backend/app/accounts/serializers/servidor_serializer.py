from rest_framework import serializers
from accounts.models.servidor import Servidor

class ServidorSerializer(serializers.ModelSerializer):

    def validate_servidor(self, value):
        value = value.strip()
        if len(value) < 10:
            raise serializers.ValidationError("O campo 'servidor' deve conter pelo menos 10 caracteres.")
        if len(value) > 50:
            raise serializers.ValidationError("O campo 'servidor' não pode exceder 50 caracteres.")
        return value

    class Meta:
        model = Servidor
        fields = "__all__"