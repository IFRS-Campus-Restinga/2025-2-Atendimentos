from rest_framework import serializers
from accounts.models.evento_ordinario import EventoOrdinario
from accounts.enumerations.tipo_usuario import TipoUsuario
from accounts.models.usuario import Usuario

class EventoOrdinarioSerializer(serializers.ModelSerializer):
    # usuarios = serializers.PrimaryKeyRelatedField(
    #     many=True,
    #     queryset=Usuario.objects.filter(tipoPerfil=TipoUsuario.ALUNO)
    # )


    class Meta:
        model = EventoOrdinario
        fields = '__all__'
    
    def get_status_choices(self, obj):
        return [{"value": choice[0], "label": choice[1]} 
                for choice in EventoOrdinario._meta.get_field("status_atendimento").choices]