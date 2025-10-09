from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from accounts.models.atendimento import Atendimento
from ..serializers.atendimento_serializer import AtendimentoSerializer
from rest_framework.viewsets import ModelViewSet

class AtendimentoViewSet(ModelViewSet):
    """
    Lista todos os atendimentos (GET) e cria um novo atendimento (POST).
    """
    queryset = Atendimento.objects.all()
    serializer_class = AtendimentoSerializer
    permission_classes = [AllowAny]
