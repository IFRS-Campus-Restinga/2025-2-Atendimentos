from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated 
from rest_framework.viewsets import ModelViewSet
from accounts.models import RegistroAtendimento
from ..serializers.registro_atendimento_serializer import RegistroAtendimentoSerializer

from services.permissions import (
    HasViewOwnAttendanceLogPermission, 
    HasFinalizeAttendanceLogPermission, 
    HasAdminAttendanceLogPermission, 
    APP_NAME
)

class RegistroAtendimentoViewSet(ModelViewSet):
    queryset = RegistroAtendimento.objects.all()
    serializer_class = RegistroAtendimentoSerializer
    # permission_classes = [AllowAny] # Permissão de classe removida para usar get_permissions

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        registro = serializer.save()

        return Response(
            {
                "message": "Registro de atendimento cadastrado com sucesso!",
                "registro": self.get_serializer(registro).data
            },
            status=status.HTTP_201_CREATED
        )

    def get_queryset(self):
        user = self.request.user
        
        # 1. ADMIN/COORDENADOR: Vê tudo
        if user.has_perm(f'{APP_NAME}.can_administer_all_attendance_logs'):
            return RegistroAtendimento.objects.all()
        
        # 2. PROFESSOR (Gerenciador/Criador): Vê logs de eventos que criou
        elif user.has_perm(f'{APP_NAME}.can_finalize_attendance_log'):
            return RegistroAtendimento.objects.filter(evento__usuario_create=user)

        # 3. ALUNO/OUTROS: Bloqueado (objects.none())
        # tá none porque tá dando erro
        return RegistroAtendimento.objects.none() 


    def get_permissions(self): 
        if self.action == 'create':
            permission_classes = [HasFinalizeAttendanceLogPermission] 
        elif self.action in ['list', 'retrieve']:
            permission_classes = [HasViewOwnAttendanceLogPermission | HasFinalizeAttendanceLogPermission]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [HasFinalizeAttendanceLogPermission] 
        else:
            permission_classes = [IsAuthenticated]
                
        return [permission() for permission in permission_classes]