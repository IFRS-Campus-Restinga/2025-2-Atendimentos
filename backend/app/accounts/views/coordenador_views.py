from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from ..models.coordenador import Coordenador
from ..serializers.coordenador_serializer import CoordenadorSerializer

class CoordenadorListCreateView(generics.ListCreateAPIView):
    """
    Lista todos os coordenadores (GET) e cria um novo coordenador (POST).
    """
    queryset = Coordenador.objects.all()
    serializer_class = CoordenadorSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        coordenador = serializer.save()
        return Response({'message': 'Coordenador cadastrado com sucesso!', 'coordenador': CoordenadorSerializer(coordenador).data},
                        status=status.HTTP_201_CREATED)


class CoordenadorRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    Recupera (GET), atualiza (PUT/PATCH) ou deleta (DELETE) um coordenador específico.
    """
    queryset = Coordenador.objects.all()
    serializer_class = CoordenadorSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'