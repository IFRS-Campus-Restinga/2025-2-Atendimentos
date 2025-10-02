from rest_framework import serializers
from accounts.models.aluno import Aluno


class AlunoSerializer(serializers.ModelSerializer):

    def validate_nome_completo(self, nome_completo):
        if len(nome_completo.split()) < 3:
            raise serializers.ValidationError("Por favor, insira o nome completo.")
        return nome_completo

    def validate_matricula(self, matricula):
        if len(str(matricula)) != 10:
            raise serializers.ValidationError(
                "O número da matrícula deve possuir exatamente 10 digitos!"
            )
        return matricula
    

    class Meta:
        model = Aluno
        fields = "__all__"
