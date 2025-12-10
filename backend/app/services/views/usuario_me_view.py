from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.db import transaction
from django.contrib.auth.models import Group

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
        Suporta atualização parcial: se o Usuario já existe, atualiza somente os campos enviados.
        Para criação completa, espera: { nome, email, tipoPerfil, registro?, matricula?, curso_id? }
        """
        data = request.data or {}
        auth_user = request.user

        # Tenta buscar usuario existente — se existir, permite atualização parcial
        try:
            usuario = Usuario.objects.get(user=auth_user)

            # Atualiza apenas os campos presentes no payload
            if 'nome' in data:
                nome = (data.get('nome') or '').strip()
                if nome:
                    usuario.nome = nome
            if 'email' in data:
                email = (data.get('email') or '').strip()
                if email:
                    usuario.email = email
                    if not auth_user.email:
                        auth_user.email = email
                        auth_user.save(update_fields=['email'])
            if 'tipoPerfil' in data:
                tipo = data.get('tipoPerfil')
                if tipo not in dict(TipoUsuario.choices):
                    return Response({'tipoPerfil': 'Valor inválido.'}, status=status.HTTP_400_BAD_REQUEST)
                usuario.tipoPerfil = tipo

            if 'registro' in data:
                usuario.registro = (data.get('registro') or '').strip()
            if 'matricula' in data:
                usuario.matricula = (data.get('matricula') or '').strip()
            if 'curso_id' in data:
                from accounts.models.curso import Curso
                curso_id = data.get('curso_id')
                if curso_id is not None:
                    try:
                        curso = Curso.objects.get(id=curso_id)
                        usuario.curso = curso
                    except Curso.DoesNotExist:
                        return Response({'curso_id': 'Curso não encontrado.'}, status=status.HTTP_400_BAD_REQUEST)

            usuario.save()
            created = False

        except Usuario.DoesNotExist:
            # Para criação, validar campos obrigatórios
            nome = (data.get('nome') or '').strip()
            email = (data.get('email') or '').strip()
            tipo = data.get('tipoPerfil')
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

            if not auth_user.email:
                auth_user.email = email
                auth_user.save(update_fields=['email'])

            usuario_data = {
                'user': auth_user,
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

            usuario = Usuario.objects.create(**usuario_data)
            created = True

        # Se tipoPerfil foi enviado no payload, sincronizar grupo
        if 'tipoPerfil' in data:
            GRUPO_MAP = {
                'PROF': 'Professores',
                'ALU': 'Alunos',
                'COORD': 'Coordenadores',
                'ADM': 'Administradores'
            }
            grupo_nome = GRUPO_MAP.get(data.get('tipoPerfil'))
            if grupo_nome:
                grupo_obj, _ = Group.objects.get_or_create(name=grupo_nome)
                try:
                    auth_user.groups.clear()
                    auth_user.groups.add(grupo_obj)
                except Exception:
                    pass

        # Se disciplinas presentes, processar (apenas para professores)
        disciplinas_ids = data.get('disciplinas')
        if disciplinas_ids is not None:
            if usuario.tipoPerfil != TipoUsuario.PROFESSOR:
                return Response({'disciplinas': 'Somente usuários com tipoPerfil=PROF podem ter disciplinas.'}, status=status.HTTP_400_BAD_REQUEST)
            from accounts.models.disciplina import Disciplina
            if not isinstance(disciplinas_ids, (list, tuple)):
                return Response({'disciplinas': 'Deve ser uma lista de ids.'}, status=status.HTTP_400_BAD_REQUEST)
            valid = list(Disciplina.objects.filter(id__in=disciplinas_ids).values_list('id', flat=True))
            try:
                usuario.disciplinas.set(valid)
            except Exception:
                return Response({'disciplinas': 'Erro ao associar disciplinas.'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            'created': created,
            'usuario': UsuarioSerializer(usuario).data
        }, status=status.HTTP_200_OK)