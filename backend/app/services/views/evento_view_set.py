from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from accounts.models.evento import Evento
from ..serializers.evento_serializer import EventoSerializer
from rest_framework.viewsets import ModelViewSet

class EventoViewSet(ModelViewSet):

    queryset = Evento.objects.all()
    serializer_class = EventoSerializer
    permission_classes = [AllowAny]
