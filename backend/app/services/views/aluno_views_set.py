from accounts.models.aluno import Aluno
from accounts.serializers.aluno_serializer import AlunoSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny

class AlunoViewSet(ModelViewSet):
    queryset = Aluno.objects.all()
    serializer_class = AlunoSerializer
    permission_classes = [AllowAny]