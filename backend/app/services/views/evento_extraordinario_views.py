from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from accounts.models.evento_extraordinario import EventoExtraordinario
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
        serializer.save(usuario_create=user)
