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
# from accounts.models.coordenador import Coordenador 
from services.serializers import ComplementoCadastroSerializer





GRUPO_MAP = {
    'PROF': 'Professores',
    'ALU': 'Alunos',
    'COORD': 'Coordenadores',
    'ADM': 'Administradores'
}

def create_aluno_profile(user, validated_data):
    Aluno.objects.create(
        user=user,
        nome_completo=validated_data['nome_completo'],
        cpf=validated_data['cpf'],
        telefone=validated_data['telefone'],
        matricula=validated_data['matricula'],
        curso=validated_data['curso'], 
        turma=validated_data['turma']
    )

def create_professor_profile(user, validated_data):
    Professor.objects.create(
        user=user,
        nome_completo=validated_data['nome_completo'],
        registro=validated_data['registro'],
        cpf=validated_data['cpf'],
        telefone=validated_data['telefone'],
    )
    
# FUNÇÃO AUXILIAR PARA DETERMINAR O GRUPO FINAL 
def determine_final_group(tipo_final_code):
    
    if tipo_final_code == 'ALU':
        nome_grupo_destino = GRUPO_MAP['ALU'] # 'Alunos'
    elif tipo_final_code in ['PROF', 'COORD', 'ADM']:
        # Usuários de privilégio vão para o grupo 'Pendentes'
        nome_grupo_destino = 'Pendentes' 
    else:
        return None 
        
    try:
        return Group.objects.get(name=nome_grupo_destino)
    except Group.DoesNotExist:
        # Exceção se o grupo essencial (Pendentes/Alunos) não existir
        raise ObjectDoesNotExist(f"O grupo '{nome_grupo_destino}' não foi encontrado. Verifique as migrações.")


# Para complemento de cadastro pós-login
class ComplementoCadastroView(APIView):
    permission_classes = [IsAuthenticated]

    def handle_complemento(self, user, validated_data, grupo_final):
        # grupo_final será um objeto Group ('Alunos' ou 'Pendentes')
        
        tipo_final_code = validated_data['tipo_final']
        
        with transaction.atomic():
            
            user.groups.clear()
            
            user.groups.add(grupo_final)
            
            if tipo_final_code == 'ALU':
                status_mensagem = f"Cadastro concluído. Perfil: {grupo_final.name}."
            else:
                status_mensagem = f"Cadastro como {GRUPO_MAP[tipo_final_code]} enviado para aprovação. Você está no grupo '{grupo_final.name}'."

            if tipo_final_code == 'ALU':
                create_aluno_profile(user, validated_data)
            elif tipo_final_code == 'PROF':
                create_professor_profile(user, validated_data)
            usuario = Usuario.objects.get(user=user)
            usuario.needs_complemento = False
            usuario.tipoPerfil = tipo_final_code 
            usuario.save()
            
        return status_mensagem

    def post(self, request, *args, **kwargs):
        serializer = ComplementoCadastroSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        user = request.user
        tipo_final_code = serializer.validated_data['tipo_final'] 

        if tipo_final_code not in GRUPO_MAP:
            return Response({"detail": "Código de perfil não mapeado."}, status=status.HTTP_400_BAD_REQUEST)

        # Agora, grupo_final sempre será um objeto Group (Alunos ou Pendentes)
        try:
            grupo_final = determine_final_group(tipo_final_code)
        except ObjectDoesNotExist as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        # Garante que o grupo foi encontrado
        if not grupo_final:
             return Response({"detail": "Falha ao determinar o grupo de destino."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


        # Executa a lógica de criação e atribuição 
        status_msg = self.handle_complemento(user, serializer.validated_data, grupo_final)

        return Response({
            "detail": status_msg, 
            "needs_complemento": False
        }, status=status.HTTP_200_OK)














'''
GRUPO_MAP = {
    'PROF': 'Professores',
    'ALU': 'Alunos',
    'COORD': 'Coordenadores',
    'ADM': 'Administradores'
}


def create_aluno_profile(user, validated_data):
    Aluno.objects.create(
        user=user,
        nome_completo=validated_data['nome_completo'],
        cpf=validated_data['cpf'],
        telefone=validated_data['telefone'],
        matricula=validated_data['matricula'],
        curso=validated_data['curso'], 
        turma=validated_data['turma']
    )

def create_professor_profile(user, validated_data):
    Professor.objects.create(
        user=user,
        nome_completo=validated_data['nome_completo'],
        registro=validated_data['registro'],
        cpf=validated_data['cpf'],
        telefone=validated_data['telefone'],
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
            usuario.tipoPerfil = tipo_final_code # Armazena o código 'PROF'/'ALU'
            usuario.save()

            if tipo_final_code == 'ALU':
                create_aluno_profile(user, validated_data)
            elif tipo_final_code == 'PROF':
                create_professor_profile(user, validated_data)

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
    
'''