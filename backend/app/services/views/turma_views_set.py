from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from accounts.models import Turma
from ..serializers.turma_serializer import TurmaSerializer
from rest_framework.viewsets import ModelViewSet

class TurmaViewSet(ModelViewSet):
    
    queryset = Turma.objects.all()
    serializer_class = TurmaSerializer
    permission_classes = [AllowAny]
