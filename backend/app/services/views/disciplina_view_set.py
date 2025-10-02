from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from rest_framework.response import Response
from ..serializers.disciplina_serializer import *
from accounts.models import *
from rest_framework.permissions import AllowAny
#from ..permissions import BackendTokenPermission
#from logs.models import Log

class DisciplinaViewSet(ModelViewSet):
    queryset = Disciplina.objects.all()
    serializer_class = DisciplinaSerializer
    permission_classes = [AllowAny]
    #permission_classes = [BackendTokenPermission]
