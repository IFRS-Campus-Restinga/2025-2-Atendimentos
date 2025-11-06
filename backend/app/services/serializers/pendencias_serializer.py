from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserPendenteSerializer(serializers.ModelSerializer):
    # Você pode adicionar campos dos modelos Aluno/Professor aqui, se necessário
    # mas para a aprovação, o básico do User costuma ser suficiente
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'date_joined')