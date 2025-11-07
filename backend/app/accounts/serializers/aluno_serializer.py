from rest_framework import serializers
from accounts.models.aluno import Aluno


class AlunoSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='user_id', read_only=True)
    nome = serializers.SerializerMethodField(read_only=True)
    email = serializers.SerializerMethodField(read_only=True)

    def get_nome(self, obj: Aluno):
        # Prioriza o nome_completo do Aluno (Perfil). Se não houver, tenta o nome calculado do Usuario/perfil, depois auth.User
        if getattr(obj, 'nome_completo', None):
            return obj.nome_completo
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

    def get_email(self, obj: Aluno):
        # Usa email do perfil (Usuario) se existir; senao, email do User
        try:
            perfil = getattr(obj.user, 'perfil', None)
            if perfil and getattr(perfil, 'email', None):
                return perfil.email
        except Exception:
            pass
        return getattr(obj.user, 'email', None)

    class Meta:
        model = Aluno
        fields = (
            'id', 'user', 'alunoPEI', 'matricula', 'curso', 'turma',
            'created_at', 'updated_at', 'nome', 'email'
        )
