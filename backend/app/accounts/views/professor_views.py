from accounts.models.professor import Professor
from accounts.serializers.professor_serializer import ProfessorSerializer
from rest_framework import viewsets
from rest_framework.permissions import AllowAny

class ProfessorViewSet(viewsets.ModelViewSet):
    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer
    permission_classes = [AllowAny]