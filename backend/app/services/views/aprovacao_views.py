from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.db import transaction
from django.shortcuts import get_object_or_404
from services.permissions import CanApproveRequests

User = get_user_model() # Pega o modelo de User padrão do Django

class AprovarUsuarioView(APIView):
    # APENAS quem tem essa permissão pode usar essa API
    permission_classes = [CanApproveRequests]

    def post(self, request, user_id):
        # Busca o usuário que será aprovado
        user_a_aprovar = get_object_or_404(User, pk=user_id)
        
        # Obtém o nome do grupo final do corpo da requisição
        grupo_final_nome = request.data.get('grupo_final') # Ex: 'Professores' ou 'Coordenadores'

        if not grupo_final_nome:
            return Response(
                {"detail": "O nome do grupo final ('grupo_final') é obrigatório."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Garante que o grupo final é um grupo de privilégio válido
        GRUPOS_APROVAVEIS = ['Professores', 'Coordenadores', 'Administradores']
        if grupo_final_nome not in GRUPOS_APROVAVEIS:
            return Response(
                {"detail": f"Grupo final inválido: {grupo_final_nome}. Apenas {', '.join(GRUPOS_APROVAVEIS)} são permitidos."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            grupo_final = Group.objects.get(name=grupo_final_nome)
            grupo_pendente = Group.objects.get(name='Pendentes') # Para remover
        except Group.DoesNotExist:
            return Response(
                {"detail": f"Um dos grupos necessários não foi encontrado."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
        # Executa a transação de aprovação
        try:
            with transaction.atomic():
                # Remove do grupo Pendentes (se estiver)
                if user_a_aprovar.groups.filter(name='Pendentes').exists():
                    user_a_aprovar.groups.remove(grupo_pendente)
                
                # Garante que não está em outros grupos de privilégio
                user_a_aprovar.groups.clear() 
                    
                # Adiciona ao grupo final de privilégio
                user_a_aprovar.groups.add(grupo_final)
                
                # Opcional: Aqui você pode adicionar lógica para enviar um email de aprovação, etc.

            return Response(
                {"detail": f"Usuário {user_a_aprovar.username} aprovado e movido para o grupo '{grupo_final_nome}'."}, 
                status=status.HTTP_200_OK
            )
        
        except Exception as e:
            return Response(
                {"detail": f"Erro interno na aprovação: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )