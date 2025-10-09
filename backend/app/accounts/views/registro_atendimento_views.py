from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from ..models import RegistroAtendimento
from ..serializers.registro_atendimento_serializer import RegistroAtendimentoSerializer


class RegistroAtendimentoListCreateView(generics.ListCreateAPIView):
    """
    Lista todos os registros de atendimentos (GET) e cria um novo registro (POST).
    """
    queryset = RegistroAtendimento.objects.all()
    serializer_class = RegistroAtendimentoSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        registro = serializer.save()
        return Response(
            {
                'message': 'Registro de atendimento cadastrado com sucesso!',
                'registro': RegistroAtendimentoSerializer(registro).data
            },
            status=status.HTTP_201_CREATED
        )


class RegistroAtendimentoRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    Recupera (GET), atualiza (PUT/PATCH) ou deleta (DELETE) um registro específico.
    """
    queryset = RegistroAtendimento.objects.all()
    serializer_class = RegistroAtendimentoSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'
