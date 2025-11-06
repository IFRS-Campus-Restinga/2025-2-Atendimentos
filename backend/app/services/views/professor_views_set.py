from accounts.models.professor import Professor
from accounts.serializers.professor_serializer import ProfessorSerializer
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ModelViewSet

class ProfessorViewSet(ModelViewSet):
    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer
    permission_classes = [AllowAny]