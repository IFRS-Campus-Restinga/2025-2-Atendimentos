from rest_framework import serializers
from accounts.models import Coordenador

class CoordenadorSerializer(serializers.ModelSerializer):
    nome = serializers.SerializerMethodField(read_only=True)

    def get_nome(self, obj: Coordenador):
        try:
            return getattr(obj, 'nome', None) or ''
        except Exception:
            pass
        user = getattr(obj, 'user', None)
        if user:
            return getattr(user, 'get_full_name', lambda: None)() or getattr(user, 'username', None) or getattr(user, 'email', None)
        return getattr(obj, 'email', None)

    class Meta:
        model = Coordenador
        fields = '__all__'