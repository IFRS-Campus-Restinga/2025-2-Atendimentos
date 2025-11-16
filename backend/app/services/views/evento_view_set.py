from rest_framework import generics, viewsets, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from accounts.models.evento import Evento
from ..serializers.evento_serializer import EventoSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from services.permissions import ProfessorPodeAprovar

class EventoViewSet(ModelViewSet):

    queryset = Evento.objects.all()
    serializer_class = EventoSerializer
    permission_classes = [AllowAny]



    @action(detail=True, methods=['post'], url_path='aprovar',
            permission_classes=[ProfessorPodeAprovar]) 
    def approve(self, request, pk=None):
        evento = self.get_object()
        evento.status_atendimento = StatusAtendimento.APROVADO
        evento.save()
        
        return Response({'status': 'aprovado', 'data': self.get_serializer(evento).data}, status=status.HTTP_200_OK)