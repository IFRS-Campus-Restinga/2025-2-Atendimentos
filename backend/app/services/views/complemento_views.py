from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import Group
from django.db.models import ObjectDoesNotExist
from django.db import transaction
from accounts.models.usuario import Usuario 
from accounts.models.aluno import Aluno
from accounts.models.professor import Professor 
from accounts.models.coordenador import Coordenador 
from services.serializers import ComplementoCadastroSerializer
from rest_framework.exceptions import ValidationError
import re


GRUPO_MAP = {
    'PROF': 'Professores',
    'ALU': 'Alunos',
    'COORD': 'Coordenadores',
    'ADM': 'Administradores'
}

def create_aluno_profile(user, validated_data):
    Aluno.objects.create(
        user=user,
        cpf=validated_data.get('cpf', ''),
        telefone=validated_data.get('telefone', ''),
        matricula=validated_data['matricula'],
        curso=validated_data['curso'], 
        turma=validated_data['turma'],
        alunoPEI=validated_data.get('alunoPEI', False),
    )

def create_professor_profile(user, validated_data):
    Professor.objects.create(
        user=user,
        registro=validated_data['registro'],
        disciplina=validated_data.get('disciplina', ''),
        cpf=validated_data.get('cpf', ''),
        telefone=validated_data.get('telefone', ''),
    )

def create_coordenador_profile(user, validated_data):
    # Coordenador herda de Usuario; criamos vínculo básico
    # Copiamos dados do Usuario (perfil) se existirem
    usuario = Usuario.objects.filter(user=user).first()
    Coordenador.objects.create(
        user=user,
        nome=getattr(usuario, 'nome', user.get_full_name() or user.username),
        email=getattr(usuario, 'email', user.email),
        tipoPerfil='COORD',
        needs_complemento=False,
    )

# Para complemento de cadastro pós-login
class ComplementoCadastroView(APIView):
    permission_classes = [IsAuthenticated]

    def handle_complemento(self, user, validated_data, grupo_final):
        
        tipo_final_code = validated_data['tipo_final']
        
        with transaction.atomic():
            
            user.groups.clear()
            user.groups.add(grupo_final)

            usuario = Usuario.objects.get(user=user)
            usuario.needs_complemento = False
            usuario.tipoPerfil = tipo_final_code # Armazena o código 'PROF'/'ALU'/'COORD'/'ADM'
            usuario.save()

            if tipo_final_code == 'ALU':
                create_aluno_profile(user, validated_data)
            elif tipo_final_code == 'PROF':
                create_professor_profile(user, validated_data)
            elif tipo_final_code == 'COORD':
                # Validação de e-mail institucional: <matricula>@<complemento>.restinga.ifrs.edu.br
                # Regras: local-part numérico (matrícula) e um ou mais subdomínios antes de restinga.ifrs.edu.br
                # Exemplos válidos: 2023009726@aluno.restinga.ifrs.edu.br
                email = (getattr(user, 'email', '') or '').strip()
                pattern = r"^\d+@([a-z0-9-]+\.)*restinga\.ifrs\.edu\.br$"
                if not re.match(pattern, email, flags=re.IGNORECASE):
                    raise ValidationError({"email": "E-mail institucional inválido para Coordenador. Use o padrão '<matricula>@<complemento>.restinga.ifrs.edu.br'."})
                create_coordenador_profile(user, validated_data)

    def post(self, request, *args, **kwargs):
        serializer = ComplementoCadastroSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        user = request.user
        tipo_final_code = serializer.validated_data['tipo_final'] # Ex: 'PROF' ou 'ALU'

        nome_do_grupo = GRUPO_MAP.get(tipo_final_code)
        
        if not nome_do_grupo:
             return Response({"detail": "Código de perfil não mapeado."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            grupo_final = Group.objects.get(name=nome_do_grupo)

        except Group.DoesNotExist:
            return Response(
                {"detail": f"Grupo '{nome_do_grupo}' não encontrado no banco de dados. Execute 'py manage.py migrate'."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        self.handle_complemento(user, serializer.validated_data, grupo_final)

        return Response({
            "detail": f"Cadastro concluído. Perfil: {nome_do_grupo}.", 
            "needs_complemento": False
        }, status=status.HTTP_200_OK)