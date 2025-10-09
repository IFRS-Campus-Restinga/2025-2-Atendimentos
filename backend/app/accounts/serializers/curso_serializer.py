from rest_framework import serializers
from accounts.models import Curso
from .coordenador_serializer import CoordenadorSerializer

class CursoSerializer(serializers.ModelSerializer):

    coordenador = CoordenadorSerializer(read_only=True)  

    class Meta:
        model = Curso
        fields = '__all__'