from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from ..models import Atendimento
from ..serializers.atendimento_serializer import AtendimentoSerializer

class AtendimentoListCreateView(generics.ListCreateAPIView):
    """
    Lista todos os atendimentos (GET) e cria um novo atendimento (POST).
    """
    queryset = Atendimento.objects.all()
    serializer_class = AtendimentoSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        atendimento = serializer.save()
        return Response(
            {
                'message': 'Atendimento cadastrado com sucesso!',
                'atendimento': AtendimentoSerializer(atendimento).data
            },
            status=status.HTTP_201_CREATED
        )


class AtendimentoRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    Recupera (GET), atualiza (PUT/PATCH) ou deleta (DELETE) um atendimento específico.
    """
    queryset = Atendimento.objects.all()
    serializer_class = AtendimentoSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'
