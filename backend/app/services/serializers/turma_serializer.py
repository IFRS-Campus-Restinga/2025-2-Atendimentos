from rest_framework import serializers
from accounts.models import Turma
from accounts.models import Curso
from accounts.serializers.curso_coordenador_resumido_serializer import CursoComCoordenadorResumidoSerializer

class TurmaSerializer(serializers.ModelSerializer):
    curso = CursoComCoordenadorResumidoSerializer(read_only=True)
    curso_id = serializers.PrimaryKeyRelatedField(
        queryset= Curso.objects.all(),
        source='curso',
        write_only=True
    )

    class Meta:
        model = Turma
        fields = "__all__"
