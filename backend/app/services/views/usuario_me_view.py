from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth import get_user_model
from django.db import transaction

from accounts.models.usuario import Usuario
from accounts.enumerations.tipo_usuario import TipoUsuario
from services.serializers.usuario_serializer import UsuarioSerializer

class UsuarioMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            usuario = Usuario.objects.get(user=request.user)
            return Response(UsuarioSerializer(usuario).data, status=status.HTTP_200_OK)
        except Usuario.DoesNotExist:
            # Retorna dados mínimos do auth user para pré-preencher o formulário
            u = request.user
            return Response({
                'id': None,
                'user': u.id,
                'nome': u.get_full_name() or u.username or u.email or '',
                'email': u.email or '',
                'needs_complemento': True,
                'tipoPerfil': None,
            }, status=status.HTTP_200_OK)

    @transaction.atomic
    def post(self, request):
        """
        Cria ou atualiza o Usuario vinculado ao usuário autenticado.
        Espera: { nome, email, tipoPerfil, registro?, matricula?, curso_id? }
        """
        data = request.data or {}
        nome = (data.get('nome') or '').strip()
        email = (data.get('email') or '').strip()
        tipo = data.get('tipoPerfil')
        
        # Campos opcionais específicos por papel
        registro = (data.get('registro') or '').strip()
        matricula = (data.get('matricula') or '').strip()
        curso_id = data.get('curso_id')

        if not nome:
            return Response({'nome': 'Obrigatório.'}, status=status.HTTP_400_BAD_REQUEST)
        if not email:
            return Response({'email': 'Obrigatório.'}, status=status.HTTP_400_BAD_REQUEST)
        if tipo not in dict(TipoUsuario.choices):
            return Response({'tipoPerfil': 'Valor inválido.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Validações específicas por papel
        if tipo == TipoUsuario.PROFESSOR and not registro:
            return Response({'registro': 'Obrigatório para professores.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if tipo == TipoUsuario.ALUNO:
            if not matricula:
                return Response({'matricula': 'Obrigatório para alunos.'}, status=status.HTTP_400_BAD_REQUEST)
            if not curso_id:
                return Response({'curso_id': 'Curso obrigatório para alunos.'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Verificar se o curso existe
            from accounts.models.curso import Curso
            try:
                curso = Curso.objects.get(id=curso_id)
            except Curso.DoesNotExist:
                return Response({'curso_id': 'Curso não encontrado.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if tipo == TipoUsuario.COORDENADOR:
            # Emails coord. teste - temporário para desenvolvimento
            import re
            pattern = r"@gmail\.com$"
            if not re.search(pattern, email, flags=re.IGNORECASE):
                return Response({'email': 'Para testes: use qualquer email @gmail.com (temporário)'}, status=status.HTTP_400_BAD_REQUEST)

        User = get_user_model()
        # Mantém consistência com o usuário do Django
        auth_user = request.user
        if not auth_user.email:
            auth_user.email = email
            auth_user.save(update_fields=['email'])

        # Preparar dados conforme o papel
        usuario_data = {
            'nome': nome,
            'email': email,
            'tipoPerfil': tipo,
            'needs_complemento': False,
        }
        
        if tipo == TipoUsuario.PROFESSOR:
            usuario_data['registro'] = registro
        elif tipo == TipoUsuario.ALUNO:
            usuario_data['matricula'] = matricula
            usuario_data['curso_id'] = curso_id
        # Admin e Coordenador não têm campos extras além da validação de email

        try:
            usuario = Usuario.objects.get(user=auth_user)
            for field, value in usuario_data.items():
                setattr(usuario, field, value)
            usuario.save()
            created = False
        except Usuario.DoesNotExist:
            usuario_data['user'] = auth_user
            usuario = Usuario.objects.create(**usuario_data)
            created = True

        return Response({
            'created': created,
            'usuario': UsuarioSerializer(usuario).data
        }, status=status.HTTP_200_OK)
