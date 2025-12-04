from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from accounts.models.evento_extraordinario import EventoExtraordinario
from accounts.models.usuario import Usuario
from services.serializers.evento_extraordinario_serializer import EventoExtraordinarioSerializer

class EventoExtraordinarioViewSet(viewsets.ModelViewSet):
    queryset = EventoExtraordinario.objects.all()
    serializer_class = EventoExtraordinarioSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        turma_id = self.request.query_params.get('turma')
        if turma_id:
            qs = qs.filter(turma_id=turma_id)
        return qs

    def perform_create(self, serializer):
        print("DEBUG USER:", self.request.user, self.request.user.is_authenticated)
        user = self.request.user if self.request.user.is_authenticated else None
        perfil = None
        if user and user.is_authenticated:
            try:
                perfil = Usuario.objects.filter(user=user).first()
                if not perfil and getattr(user, 'email', None):
                    perfil = Usuario.objects.filter(email__iexact=user.email).first()
            except Exception:
                perfil = None
        serializer.save(usuario_create=perfil)
