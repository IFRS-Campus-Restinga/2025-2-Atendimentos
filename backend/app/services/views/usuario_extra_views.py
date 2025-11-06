from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from accounts.models.usuario_extra import UsuarioExtra
from services.serializers.usuario_extra_serializer import UsuarioExtraSerializer

class UsuarioExtraMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        extras, _created = UsuarioExtra.objects.get_or_create(user=user)
        serializer = UsuarioExtraSerializer(extras, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        user = request.user
        extras, _created = UsuarioExtra.objects.get_or_create(user=user)
        partial = True
        serializer = UsuarioExtraSerializer(extras, data=request.data, context={'request': request}, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        return self.put(request)
