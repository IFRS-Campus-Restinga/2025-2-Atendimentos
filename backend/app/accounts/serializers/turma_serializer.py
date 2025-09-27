from rest_framework import serializers
from accounts.models import Curso, Turma
from accounts.serializers.curso_serializer import CursoSerializer

class TurmaSerializer(serializers.ModelSerializer):
    curso = serializers.PrimaryKeyRelatedField(queryset=Curso.objects.all())

    class Meta:
        model = Turma
        fields = '__all__'