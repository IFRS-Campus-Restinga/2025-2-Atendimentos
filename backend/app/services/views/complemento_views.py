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
from django.db import IntegrityError
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
        disciplina=validated_data.get('disciplina', ''),
        cpf=validated_data.get('cpf', ''),
        telefone=validated_data.get('telefone', ''),
    )

def create_coordenador_profile(user, validated_data):
    """
    Coordenador herda de Usuario (multi-table inheritance).
    Para criar o Coordenador corretamente, não devemos criar um novo Usuario.
    Em vez disso, criamos a linha filha usando a mesma PK do Usuario existente.
    """
    usuario = Usuario.objects.get(user=user)
    # Cria o registro filho sem duplicar o pai
    Coordenador.objects.get_or_create(pk=usuario.pk)

# Para complemento de cadastro pós-login
class ComplementoCadastroView(APIView):
    permission_classes = [IsAuthenticated]

    def handle_complemento(self, user, validated_data, grupo_final):
        
        tipo_final_code = validated_data['tipo_final']
        
        with transaction.atomic():
            
            user.groups.clear()
            user.groups.add(grupo_final)

            # Garante que exista um Usuario vinculado ao user autenticado
            try:
                usuario = Usuario.objects.get(user=user)
            except Usuario.DoesNotExist:
                usuario = Usuario.objects.create(
                    user=user,
                    nome=(user.get_full_name() or user.username or user.email or "Usuário"),
                    email=(user.email or ""),
                    needs_complemento=True,
                    tipoPerfil=tipo_final_code,
                )
            usuario.needs_complemento = False
            usuario.tipoPerfil = tipo_final_code # Armazena o código 'PROF'/'ALU'/'COORD'/'ADM'
            usuario.save()

            try:
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
            except IntegrityError as e:
                raise ValidationError({"detail": "Conflito de dados ao criar o perfil. Verifique se já existe um perfil para este usuário ou se os campos únicos não foram reutilizados (ex.: matrícula)."})

    def post(self, request, *args, **kwargs):
        serializer = ComplementoCadastroSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        user = request.user
        tipo_final_code = serializer.validated_data['tipo_final'] # Ex: 'PROF' ou 'ALU'

        nome_do_grupo = GRUPO_MAP.get(tipo_final_code)
        
        if not nome_do_grupo:
             return Response({"detail": "Código de perfil não mapeado."}, status=status.HTTP_400_BAD_REQUEST)

        grupo_final, _created = Group.objects.get_or_create(name=nome_do_grupo)

        self.handle_complemento(user, serializer.validated_data, grupo_final)

        return Response({
            "detail": f"Cadastro concluído. Perfil: {nome_do_grupo}.", 
            "needs_complemento": False
        }, status=status.HTTP_200_OK)
    
'''