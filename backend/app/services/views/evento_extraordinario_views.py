from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from accounts.models.evento_extraordinario import EventoExtraordinario
from services.serializers.evento_extraordinario_serializer import EventoExtraordinarioSerializer

class EventoExtraordinarioViewSet(viewsets.ModelViewSet):
    queryset = EventoExtraordinario.objects.all()
    serializer_class = EventoExtraordinarioSerializer
    permission_classes = [AllowAny]