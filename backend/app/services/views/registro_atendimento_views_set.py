# accounts/views/registro_atendimento_viewset.py
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ModelViewSet
from accounts.models import RegistroAtendimento
from ..serializers.registro_atendimento_serializer import RegistroAtendimentoSerializer

class RegistroAtendimentoViewSet(ModelViewSet):
    """
    ViewSet que gerencia os registros de atendimento (CRUD completo).
    """
    queryset = RegistroAtendimento.objects.all()
    serializer_class = RegistroAtendimentoSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        """
        Sobrescreve o POST para retornar uma mensagem personalizada.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        registro = serializer.save()

        return Response(
            {
                "message": "Registro de atendimento cadastrado com sucesso!",
                "registro": self.get_serializer(registro).data
            },
            status=status.HTTP_201_CREATED
        )
