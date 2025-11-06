from rest_framework.viewsets import ModelViewSet
from django.contrib.auth import get_user_model
from services.permissions import CanApproveRequests
from services.serializers import UserPendenteSerializer 

User = get_user_model() 

# Lista todos os usuários pendentes, e o acesso é restrito a apenas quem pode aprovar
class UsuarioPendenteViewSet(ModelViewSet):
 
    permission_classes = [CanApproveRequests] 
    queryset = User.objects.filter(groups__name='Pendentes').order_by('-date_joined') 
    serializer_class = UserPendenteSerializer
    http_method_names = ['get', 'head', 'options'] # não precisa de criação e edição aqui