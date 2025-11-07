from rest_framework import serializers
from accounts.models.usuario_extra import UsuarioExtra

class UsuarioExtraSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsuarioExtra
        fields = ['avatar', 'bio', 'data_nascimento', 'localizacao', 'website', 'instagram', 'linkedin']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        # Constrói URL absoluta para avatar quando possível
        if data.get('avatar') and request is not None:
            data['avatar_url'] = request.build_absolute_uri(instance.avatar.url)
        else:
            data['avatar_url'] = None
        return data