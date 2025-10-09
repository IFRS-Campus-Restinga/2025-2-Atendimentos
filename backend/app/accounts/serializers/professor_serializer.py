from rest_framework import serializers
from accounts.models.professor import Professor

class ProfessorSerializer(serializers.ModelSerializer):

    def validate_registro(self, registro):
        if len(registro.strip()) < 5:
            raise serializers.ValidationError(
                "O registro deve conter pelo menos 5 caracteres."
            )
        return registro

    def validate_disciplina(self, disciplina):
        if len(disciplina.strip()) < 3:
            raise serializers.ValidationError(
                "O nome da disciplina deve conter pelo menos 3 caracteres."
            )
        return disciplina

    class Meta:
        model = Professor
        fields = "__all__"