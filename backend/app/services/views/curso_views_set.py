from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from accounts.models import Curso
from ..serializers.curso_serializer import CursoSerializer
from rest_framework.viewsets import ModelViewSet

class CursoViewSet(ModelViewSet):

    queryset = Curso.objects.all()
    serializer_class = CursoSerializer
    permission_classes = [AllowAny]
