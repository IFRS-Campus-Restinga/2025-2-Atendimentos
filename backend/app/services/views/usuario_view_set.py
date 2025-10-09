from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from accounts.models.usuario import Usuario
from ..serializers.usuario_serializer import UsuarioSerializer
from rest_framework.viewsets import ModelViewSet

class UsuarioViewSet(ModelViewSet):

    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [AllowAny]
