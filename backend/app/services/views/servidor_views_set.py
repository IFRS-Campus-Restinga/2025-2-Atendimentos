from accounts.models.servidor import Servidor
from accounts.serializers.servidor_serializer import ServidorSerializer
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ModelViewSet

class ServidorViewSet(ModelViewSet):
    queryset = Servidor.objects.all()
    serializer_class = ServidorSerializer
    permission_classes = [AllowAny]