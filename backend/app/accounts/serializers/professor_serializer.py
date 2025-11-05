from rest_framework import serializers
from accounts.models.professor import Professor

class ProfessorSerializer(serializers.ModelSerializer):
    nome = serializers.SerializerMethodField(read_only=True)
    email = serializers.SerializerMethodField(read_only=True)

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

    def get_nome(self, obj: Professor):
        try:
            perfil = getattr(obj.user, 'perfil', None)
            if perfil and getattr(perfil, 'nome', None):
                return perfil.nome
        except Exception:
            pass
        full_name = getattr(obj.user, 'get_full_name', lambda: '')()
        if full_name:
            return full_name
        return getattr(obj.user, 'username', None)

    def get_email(self, obj: Professor):
        try:
            perfil = getattr(obj.user, 'perfil', None)
            if perfil and getattr(perfil, 'email', None):
                return perfil.email
        except Exception:
            pass
        return getattr(obj.user, 'email', None)

    class Meta:
        model = Professor
        fields = (
            'id', 'user', 'registro', 'disciplina', 'created_at', 'updated_at',
            'nome', 'email'
        )