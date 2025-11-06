from rest_framework import serializers
from accounts.models import *

class DisciplinaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Disciplina
        fields = '__all__'

    #def save(self, **kwargs):
    #    formDisciplina = super().save(**kwargs)

    #    formDisciplina.full_clean()
    #    formDisciplina.save()
    #    return formDisciplina