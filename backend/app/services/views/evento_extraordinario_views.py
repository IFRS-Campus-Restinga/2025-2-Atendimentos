from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from accounts.models.evento_extraordinario import EventoExtraordinario
from accounts.models.usuario import Usuario
from services.serializers.evento_extraordinario_serializer import EventoExtraordinarioSerializer
from guardian.shortcuts import assign_perm


class EventoExtraordinarioViewSet(viewsets.ModelViewSet):
    queryset = EventoExtraordinario.objects.all()
    serializer_class = EventoExtraordinarioSerializer
    # Exigir autenticação ao criar/editar para que possamos vincular o criador
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        turma_id = self.request.query_params.get('turma')
        if turma_id:
            qs = qs.filter(turma_id=turma_id)
        return qs

    def perform_create(self, serializer):
        # Vincula o perfil Usuario (se existir) e atribui permissões por objeto
        user = self.request.user if getattr(self.request, 'user', None) and self.request.user.is_authenticated else None
        perfil = None
        if user:
            try:
                perfil = Usuario.objects.filter(user=user).first()
                if not perfil and getattr(user, 'email', None):
                    perfil = Usuario.objects.filter(email__iexact=user.email).first()
            except Exception:
                perfil = None

        evento = serializer.save(usuario_create=perfil)
        # Atribuir permissões de objeto ao criador (ignora falhas)
        try:
            if user and evento is not None:
                assign_perm('accounts.pode_aprovar_evento', user, evento)
                assign_perm('accounts.pode_cancelar_evento', user, evento)
                assign_perm('accounts.pode_reagendar_evento', user, evento)
        except Exception:
            pass
