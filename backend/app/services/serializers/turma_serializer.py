from rest_framework import serializers
from accounts.models import Turma
from accounts.models import Curso
from .curso_serializer import CursoSerializer

class TurmaSerializer(serializers.ModelSerializer):
    curso = CursoSerializer(read_only=True)
    curso_id = serializers.PrimaryKeyRelatedField(
        queryset= Curso.objects.all(),
        source='curso',
        write_only=True
    )

    class Meta:
        model = Turma
        fields = "__all__"
