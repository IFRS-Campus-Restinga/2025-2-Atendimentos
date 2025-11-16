from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from accounts.models import HistoricoAtendimento
from services.serializers import HistoricoAtendimentoSerializer


class HistoricoAtendimentoViewSet(viewsets.ModelViewSet):
    queryset = HistoricoAtendimento.objects.all().order_by('-mes_referencia')
    serializer_class = HistoricoAtendimentoSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['get'])
    def por_professor(self, request):
        professor_id = request.query_params.get('professor_id')
        if not professor_id:
            return Response(
                {'error': 'professor_id é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        historicos = self.queryset.filter(professor_id=professor_id)
        serializer = self.get_serializer(historicos, many=True)
        return Response(serializer.data)