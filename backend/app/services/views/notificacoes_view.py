from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from accounts.models.evento_extraordinario import EventoExtraordinario

class NotificacaoViewSet(ViewSet):
    #permission_classes = [IsAuthenticated]  # ou AllowAny, se quiser liberar
    permission_classes = [AllowAny]  # ou AllowAny, se quiser liberar

    def list(self, request):
        eventos = EventoExtraordinario.objects.order_by('-updated_at')[:10]

        eventos = EventoExtraordinario.objects.order_by('-updated_at')[:10]

        status_map = {
            "CONF": "foi confirmado",
            "CANC": "foi cancelado",
            "PEND": "está pendente",
        }

        data = []
        for e in eventos:
            mensagem = (
                f"O evento {str(e)} {status_map.get(e.status_atendimento, '')}"
            )

            data.append({
                "id": e.id,
                "mensagem": mensagem,
                "status": e.status_atendimento,
                "created_at": e.created_at,
                "updated_at": e.updated_at,
            })

        return Response(data)
