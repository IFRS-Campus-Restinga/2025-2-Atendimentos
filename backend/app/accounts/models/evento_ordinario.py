from django.db import models
from .evento import Evento
from .usuario import Usuario
from accounts.enumerations.tipo_usuario import TipoUsuario
from accounts.enumerations.dia_semana import DiaSemana

class EventoOrdinario(Evento):

    dia_semana = models.CharField(
        max_length=3,
        choices= DiaSemana.choices
    )
    data_inicio = models.DateField()
    data_fim = models.DateField()

    
    class Meta:
        verbose_name = 'Evento Ordinário'
        verbose_name_plural = 'Eventos Ordinários'
