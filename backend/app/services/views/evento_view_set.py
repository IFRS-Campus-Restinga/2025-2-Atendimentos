from rest_framework import generics, viewsets, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from accounts.models.evento import Evento
from accounts.enumerations.status_atendimento import StatusAtendimento
from ..serializers.evento_serializer import EventoSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from services.permissions import PodeAprovarEvento, PodeCancelarEvento, PodeRegendarEvento

class EventoViewSet(ModelViewSet):
    queryset = Evento.objects.all()
    serializer_class = EventoSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        turma_id = self.request.query_params.get('turma')
        if turma_id:
            qs = qs.filter(turma_id=turma_id)
        return qs
    @action(detail=True, methods=['post'], url_path='aprovar',
            permission_classes=[PodeAprovarEvento]) 
    def aprovar(self, request, pk=None):
        """Aprova/confirma um evento. Requer permissão 'pode_aprovar_evento'"""
        evento = self.get_object()
        evento.status_atendimento = StatusAtendimento.CONFIRMADO
        evento.save()
        
        return Response(
            {'status': 'evento aprovado', 'data': self.get_serializer(evento).data}, 
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'], url_path='cancelar',
            permission_classes=[PodeCancelarEvento])
    def cancelar(self, request, pk=None):
        """Cancela um evento. Requer permissão 'pode_cancelar_evento'"""
        evento = self.get_object()
        evento.status_atendimento = StatusAtendimento.CANCELADO
        evento.save()
        
        return Response(
            {'status': 'evento cancelado', 'data': self.get_serializer(evento).data}, 
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'], url_path='reagendar',
            permission_classes=[PodeRegendarEvento])
    def reagendar(self, request, pk=None):
        """Reagenda um evento para nova data/hora. Requer permissão 'pode_reagendar_evento'"""
        evento = self.get_object()
        
        # Validar dados recebidos
        nova_data = request.data.get('data_evento')
        nova_hora = request.data.get('data_hora_evento')
        
        if not nova_data or not nova_hora:
            return Response(
                {'error': 'data_evento e data_hora_evento são obrigatórios'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Atualizar evento
        evento.data_evento = nova_data
        evento.data_hora_evento = nova_hora
        evento.save()
        
        return Response(
            {'status': 'evento reagendado', 'data': self.get_serializer(evento).data}, 
            status=status.HTTP_200_OK
        )