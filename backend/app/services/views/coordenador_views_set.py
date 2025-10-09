from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from accounts.models.coordenador import Coordenador
from ..serializers.coordenador_serializer import CoordenadorSerializer
from rest_framework.viewsets import ModelViewSet

class CoordenadorViewSet(ModelViewSet):
   
    queryset = Coordenador.objects.all()
    serializer_class = CoordenadorSerializer
    permission_classes = [AllowAny]
