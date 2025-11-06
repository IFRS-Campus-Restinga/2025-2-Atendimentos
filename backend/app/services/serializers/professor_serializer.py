from rest_framework import serializers
from accounts.models.professor import Professor

class ProfessorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Professor
        fields = "__all__"