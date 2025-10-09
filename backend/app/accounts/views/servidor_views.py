from accounts.models.servidor import Servidor
from accounts.serializers.servidor_serializer import ServidorSerializer
from rest_framework import viewsets
from rest_framework.permissions import AllowAny

class ServidorViewSet(viewsets.ModelViewSet):
    queryset = Servidor.objects.all()
    serializer_class = ServidorSerializer
    permission_classes = [AllowAny]