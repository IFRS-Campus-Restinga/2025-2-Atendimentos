from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from accounts.models.evento_ordinario import EventoOrdinario
from ..serializers.evento_ordinario_serializer import EventoOrdinarioSerializer

class EventoOrdinarioViewSet(viewsets.ModelViewSet):
    queryset = EventoOrdinario.objects.all()
    serializer_class = EventoOrdinarioSerializer
    permission_classes = [AllowAny]
