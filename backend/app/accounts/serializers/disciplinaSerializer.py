from rest_framework import serializers
from accounts.models.disciplina import Disciplina
#from accounts.models.curso import Curso

class DisciplinaSerializer(serializers.ModelSerializer):
    #cursos = serializers.PrimaryKeyRelatedField(queryset=Curso.objects.all(), many=True)

    class Meta:
        model = Disciplina
        fields = '__all__'
    
    
    