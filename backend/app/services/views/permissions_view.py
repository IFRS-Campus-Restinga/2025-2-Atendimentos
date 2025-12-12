from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status


class PermissionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        perms = {
            'can_create_ordinario': user.has_perm('accounts.add_eventoordinario'),
            'can_create_extraordinario': user.has_perm('accounts.add_eventoextraordinario'),
            'can_create_convocacao': user.has_perm('accounts.add_eventoconvocacao') or user.has_perm('accounts.pode_criar_convocacao'),
            'can_change_event': user.has_perm('accounts.change_evento'),
            'can_delete_event': user.has_perm('accounts.delete_evento'),
            'can_approve_event': user.has_perm('accounts.pode_aprovar_evento'),
            'can_cancel_event': user.has_perm('accounts.pode_cancelar_evento'),
            'can_reschedule_event': user.has_perm('accounts.pode_reagendar_evento'),
        }
        return Response(perms, status=status.HTTP_200_OK)
