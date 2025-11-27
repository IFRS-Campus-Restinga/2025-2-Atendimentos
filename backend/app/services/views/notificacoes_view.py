from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from accounts.models.evento_extraordinario import EventoExtraordinario

class NotificacaoViewSet(ViewSet):
    #permission_classes = [IsAuthenticated]  # ou AllowAny, se quiser liberar
    permission_classes = [AllowAny]  # ou AllowAny, se quiser liberar

    def list(self, request):
        eventos = EventoExtraordinario.objects.order_by('-updated_at')[:10]

        data = [
            {
                "id": e.id,
                "mensagem": f"Evento atualizado: {str(e)}",
                "created_at": e.created_at,
                "updated_at": e.updated_at,
                "status": e.status_atendimento,
            }
            for e in eventos
        ]

        return Response(data)
