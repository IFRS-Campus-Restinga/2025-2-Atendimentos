from rest_framework import serializers
from accounts.models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):

    class Meta:
        model = Usuario
        fields = "__all__"