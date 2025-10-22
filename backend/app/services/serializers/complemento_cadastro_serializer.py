from rest_framework import serializers
from accounts.models.usuario import Usuario
from accounts.enumerations.tipo_usuario import TipoUsuario

class ComplementoCadastroSerializer(serializers.Serializer):
    cpf = serializers.CharField(max_length=14, required=False, allow_blank=True)
    telefone = serializers.CharField(max_length=15, required=False, allow_blank=True)
    tipo_final = serializers.ChoiceField(choices=TipoUsuario.choices)
    
    # Campos do Aluno
    matricula = serializers.CharField(max_length=15, required=False, allow_blank=True)
    curso = serializers.CharField(max_length=50, required=False, allow_blank=True)
    turma = serializers.CharField(max_length=50, required=False, allow_blank=True)
    # Campos do Professor
    registro = serializers.CharField(max_length=20, required=False, allow_blank=True)

    def validate(self, data):
        tipo = data.get('tipo_final')
        if tipo == 'Aluno':
            if not data.get('matricula'):
                raise serializers.ValidationError({"matricula": "A matrícula é obrigatória para Alunos."})
        elif tipo == 'Professor':
            if not data.get('registro'):
                raise serializers.ValidationError({"registro": "O registro é obrigatório para Professores."})
        return data