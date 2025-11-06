from rest_framework import serializers
from accounts.models import Curso
from accounts.serializers.coordenador_resumido_serializer import CoordenadorResumidoSerializer

class CursoComCoordenadorResumidoSerializer(serializers.ModelSerializer):
    coordenador = CoordenadorResumidoSerializer()

    class Meta:
        model = Curso
        fields = ['id', 'nome', 'codigo', 'tipo_curso', 'coordenador']
