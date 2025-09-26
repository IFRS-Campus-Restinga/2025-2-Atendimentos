from accounts.models.aluno import Aluno
from accounts.serializers.alunoSerializer import AlunoSerializer
from rest_framework import viewsets


class AlunoViewSet(viewsets.ModelViewSet):
    queryset = Aluno.objects.all()
    serializer_class = AlunoSerializer
