from rest_framework import serializers
from accounts.models.aluno import Aluno
from accounts.models.usuario_extra import UsuarioExtra


class UsuarioExtraNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsuarioExtra
        fields = [
            'avatar', 'bio', 'data_nascimento', 'localizacao', 'website', 'instagram', 'linkedin'
        ]


class AlunoSerializer(serializers.ModelSerializer):
    extras = UsuarioExtraNestedSerializer(source='user.extras', required=False, allow_null=True)

    class Meta:
        model = Aluno
        fields = "__all__"
        read_only_fields = ['matricula', 'nome', 'email']

    def update(self, instance, validated_data):
        extras_data = validated_data.pop('user', {}).get('extras', None)
        # Atualiza campos normais do Aluno (exceto read-only)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if extras_data is not None:
            extras, _created = UsuarioExtra.objects.get_or_create(user=instance.user)
            for attr, value in extras_data.items():
                setattr(extras, attr, value)
            extras.save()
        return instance
