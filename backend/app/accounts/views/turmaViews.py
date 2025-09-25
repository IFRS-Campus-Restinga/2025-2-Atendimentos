from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from ..models import Turma
from ..serializers.turmaSerializer import TurmaSerializer

class TurmaListCreateView(generics.ListCreateAPIView):
    """
    Lista todas as turmas (GET) e cria uma nova turma (POST).
    """
    queryset = Turma.objects.all()
    serializer_class = TurmaSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        turma = serializer.save()
        return Response({'message': 'Turma cadastrada com sucesso!', 'turma': TurmaSerializer(turma).data},
                        status=status.HTTP_201_CREATED)


class TurmaRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    Recupera (GET), atualiza (PUT/PATCH) ou deleta (DELETE) uma turma específica.
    """
    queryset = Turma.objects.all()
    serializer_class = TurmaSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'
