from rest_framework import serializers
from accounts.models import Curso, Turma
from accounts.serializers.cursoSerializer import CursoSerializer

class TurmaSerializer(serializers.ModelSerializer):
    curso = CursoSerializer(read_only=True) 

    class Meta:
        model = Turma
        fields = ['id', 'nome', 'periodo', 'turno', 'curso'] 