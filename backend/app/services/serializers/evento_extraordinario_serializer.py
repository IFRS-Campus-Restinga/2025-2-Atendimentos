from rest_framework import serializers
from accounts.models.evento_extraordinario import EventoExtraordinario
from accounts.models.usuario import Usuario

class EventoExtraordinarioSerializer(serializers.ModelSerializer):
    # Permite enviar vazio ou ignorar completamente o campo
    can_approve = serializers.SerializerMethodField()
    can_cancel = serializers.SerializerMethodField()
    can_reagendar = serializers.SerializerMethodField()
    can_change = serializers.SerializerMethodField()
    usuarios = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Usuario.objects.all(),
        required=False,
        allow_empty=True
    )

    disciplina_nome = serializers.CharField(source='disciplina.nome', read_only=True)
    usuario_nome = serializers.CharField(source='usuario_create.nome', read_only=True)

    class Meta:
        model = EventoExtraordinario
        fields = '__all__'
        read_only_fields = ['usuario_create']

    def _has_perm_obj(self, perm_codename, obj):
        request = self.context.get('request') if hasattr(self, 'context') else None
        if not request or not getattr(request, 'user', None) or not request.user.is_authenticated:
            return False
        try:
            return request.user.has_perm(perm_codename, obj)
        except Exception:
            return False

    def get_can_approve(self, obj):
        return self._has_perm_obj('accounts.pode_aprovar_evento', obj)

    def get_can_cancel(self, obj):
        return self._has_perm_obj('accounts.pode_cancelar_evento', obj)

    def get_can_reagendar(self, obj):
        return self._has_perm_obj('accounts.pode_reagendar_evento', obj)

    def get_can_change(self, obj):
        return (
            self._has_perm_obj('accounts.change_eventoextraordinario', obj)
            or self._has_perm_obj('accounts.change_evento', obj)
        )
