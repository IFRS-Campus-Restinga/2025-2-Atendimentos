from rest_framework import serializers
from accounts.models.usuario import Usuario
from accounts.enumerations.tipo_usuario import TipoUsuario

class ComplementoCadastroSerializer(serializers.Serializer):
    nome_completo = serializers.CharField(max_length=100, required=False, allow_blank=True)
    cpf = serializers.CharField(max_length=14, required=False, allow_blank=True)
    telefone = serializers.CharField(max_length=15, required=False, allow_blank=True)
    # Recebe o código da escolha (e.g., 'ALU', 'PROF', 'COORD', 'ADM')
    tipo_final = serializers.ChoiceField(choices=TipoUsuario.choices)

    # Campos do Aluno
    matricula = serializers.CharField(max_length=15, required=False, allow_blank=True)
    curso = serializers.CharField(max_length=50, required=False, allow_blank=True)
    turma = serializers.CharField(max_length=50, required=False, allow_blank=True)
    alunoPEI = serializers.BooleanField(required=False)

    # Campos do Professor
    registro = serializers.CharField(max_length=20, required=False, allow_blank=True)
    disciplina = serializers.CharField(max_length=100, required=False, allow_blank=True)

    def validate(self, data):
        tipo = data.get('tipo_final')

        if tipo == TipoUsuario.ALUNO:
            # Para aluno, exigimos matrícula, curso e turma
            missing = [
                field for field in ['matricula', 'curso', 'turma']
                if not data.get(field)
            ]
            if missing:
                raise serializers.ValidationError({"aluno": f"Campos obrigatórios ausentes: {', '.join(missing)}."})

        elif tipo == TipoUsuario.PROFESSOR:
            # Para professor, exigimos registro, disciplina, cpf e telefone
            missing = [
                field for field in ['registro', 'disciplina', 'cpf', 'telefone']
                if not data.get(field)
            ]
            if missing:
                raise serializers.ValidationError({"professor": f"Campos obrigatórios ausentes: {', '.join(missing)}."})

        # Coordenador e Administrador não possuem campos adicionais obrigatórios aqui
        return data