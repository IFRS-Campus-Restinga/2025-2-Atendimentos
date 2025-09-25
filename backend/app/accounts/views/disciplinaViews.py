from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from accounts.models.disciplina import Disciplina
from accounts.serializers.disciplinaSerializer import DisciplinaSerializer

class DisciplinaViewSet(viewsets.ModelViewSet):
    queryset = Disciplina.objects.all()
    serializer_class = DisciplinaSerializer
    permission_classes = [AllowAny]#[IsAuthenticated]

    # Listar todas as disciplinas
#    def list(self, request):
#        disciplinas = self.get_queryset()
#        serializer = self.get_serializer(disciplinas, many=True)
#        return Response({
#            "status": "sucesso",
#            "dados": serializer.data
#        }, status=status.HTTP_200_OK)
#
#    # Detalhar uma disciplina
#    def detail(self, request, pk=None):
#        try:
#            disciplina = self.get_object()
#            serializer = self.get_serializer(disciplina)
#            return Response({
#                "status": "sucesso",
#                "dados": serializer.data
#            }, status=status.HTTP_200_OK)
#        except Disciplina.DoesNotExist:
#            return Response({
#                "status": "falha",
#                "mensagem": "Disciplina não encontrada"
#            }, status=status.HTTP_404_NOT_FOUND)
#
#    # Criar uma nova disciplina
#    def create(self, request):
#        serializer = self.get_serializer(data=request.data)
#        if serializer.is_valid():
#            serializer.save()
#            return Response({
#                "status": "sucesso",
#                "mensagem": "Disciplina criada com sucesso",
#                "dados": serializer.data
#            }, status=status.HTTP_201_CREATED)
#        return Response({
#            "status": "falha",
#            "erros": serializer.errors
#        }, status=status.HTTP_400_BAD_REQUEST)
#
#    # Atualizar uma disciplina existente
#    def update(self, request, pk=None):
#        try:
#            disciplina = self.get_object()
#        except Disciplina.DoesNotExist:
#            return Response({
#                "status": "falha",
#                "mensagem": "Disciplina não encontrada"
#            }, status=status.HTTP_404_NOT_FOUND)
#
#        serializer = self.get_serializer(disciplina, data=request.data)
#        if serializer.is_valid():
#            serializer.save()
#            return Response({
#                "status": "sucesso",
#                "mensagem": "Disciplina atualizada com sucesso",
#                "dados": serializer.data
#            }, status=status.HTTP_200_OK)
#        return Response({
#            "status": "falha",
#            "erros": serializer.errors
#        }, status=status.HTTP_400_BAD_REQUEST)
#
#    # Excluir uma disciplina
#    def delete(self, request, pk=None):
#        try:
#            disciplina = self.get_object()
#            disciplina.delete()
#            return Response({
#                "status": "sucesso",
#                "mensagem": "Disciplina excluída com sucesso"
#            }, status=status.HTTP_204_NO_CONTENT)
#        except Disciplina.DoesNotExist:
#            return Response({
#                "status": "falha",
#                "mensagem": "Disciplina não encontrada"
#            }, status=status.HTTP_404_NOT_FOUND)