from accounts.models.usuario import Usuario
from accounts.enumerations.tipo_usuario import TipoUsuario
from services.serializers.usuario_serializer import UsuarioSerializer
from rest_framework.response import Response
from rest_framework.views import APIView


class EmailsAutorizadosView(APIView):
    def get(self, request):
        admins = list(Usuario.objects.filter(tipoPerfil=TipoUsuario.ADMINISTRADOR).values_list("email", flat=True))
        coords = list(Usuario.objects.filter(tipoPerfil=TipoUsuario.COORDENADOR).values_list("email", flat=True))
        return Response({"admins": admins, "coords": coords})