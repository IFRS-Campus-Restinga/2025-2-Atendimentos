from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from accounts.models.aluno import Aluno
from accounts.models.professor import Professor
from accounts.models.coordenador import Coordenador

from services.serializers.aluno_serializer import AlunoSerializer
from services.serializers.professor_serializer import ProfessorSerializer
from services.serializers.coordenador_serializer import CoordenadorSerializer

ROLE_MODEL = {
    'Aluno': (Aluno, AlunoSerializer),
    'Professor': (Professor, ProfessorSerializer),
    'Coordenador': (Coordenador, CoordenadorSerializer),
}

class ProfileStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        role = request.query_params.get('role')
        if role == 'Administrador':
            # Administrador não requer criação de perfil específico aqui
            return Response({'role': role, 'exists': True}, status=status.HTTP_200_OK)

        model_pair = ROLE_MODEL.get(role)
        if not model_pair:
            return Response({'detail': 'Role inválida.'}, status=status.HTTP_400_BAD_REQUEST)

        Model, _Serializer = model_pair
        exists = Model.objects.filter(user=request.user).exists()
        return Response({'role': role, 'exists': exists}, status=status.HTTP_200_OK)


class ProfileMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        role = request.query_params.get('role')
        if role == 'Administrador':
            # Sem dados específicos
            return Response({'role': role}, status=status.HTTP_200_OK)

        model_pair = ROLE_MODEL.get(role)
        if not model_pair:
            return Response({'detail': 'Role inválida.'}, status=status.HTTP_400_BAD_REQUEST)

        Model, Serializer = model_pair
        try:
            instance = Model.objects.get(user=request.user)
        except Model.DoesNotExist:
            return Response({'detail': 'Perfil não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        return Response(Serializer(instance).data, status=status.HTTP_200_OK)
