from rest_framework.viewsets import ModelViewSet
from accounts.models.atendimentoescolar import AtendimentoEscolar
from services.serializers.atendimento_escolar_serializer import AtendimentoEscolarSerializer
from rest_framework.permissions import AllowAny

class AtendimentoEscolarViewSet(ModelViewSet):
    queryset = AtendimentoEscolar.objects.all()
    serializer_class = AtendimentoEscolarSerializer
    permission_classes = [AllowAny]