from accounts.models.aluno import Aluno
from accounts.serializers.alunoSerializer import AlunoSerializer
from rest_framework import viewsets
from rest_framework.permissions import AllowAny

class AlunoViewSet(viewsets.ModelViewSet):
    queryset = Aluno.objects.all()
    serializer_class = AlunoSerializer
    permission_classes = [AllowAny]