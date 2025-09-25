from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from ..models import Curso
from ..serializers.cursoSerializer import CursoSerializer

class CursoListCreateView(generics.ListCreateAPIView):
    """
    Lista todos os cursos (GET) e cria um novo curso (POST).
    """
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        curso = serializer.save()
        return Response({'message': 'Curso cadastrado com sucesso!', 'curso': CursoSerializer(curso).data},
                        status=status.HTTP_201_CREATED)


class CursoRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    Recupera (GET), atualiza (PUT/PATCH) ou deleta (DELETE) um curso específico.
    """
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'  # Pode ser 'id' ou outro campo único do Curso
