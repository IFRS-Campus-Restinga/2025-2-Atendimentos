from rest_framework.views import APIView
from rest_framework.response import Response
from accounts.models.evento import Evento
from rest_framework.permissions import AllowAny



class EventoStatusSet(APIView):
     permission_classes = [AllowAny]
     
     def get(self, request):
        

        choices = [
            {"value": choice[0], "label": choice[1]}
            for choice in Evento._meta.get_field("status_atendimento").choices
        ]
        return Response(choices)