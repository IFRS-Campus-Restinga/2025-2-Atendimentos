from accounts.models.base_model import BaseModel
from django.db import models
from django.utils import timezone
from accounts.enumerations.status_atendimento import StatusAtendimento
from .usuario import Usuario

class Evento(BaseModel):

    data_criacao = models.DateTimeField(
        default=timezone.now,
        blank=True,
        help_text="Data e hora de criação do evento" )

    data_evento = models.DateField(
        default=timezone.now,
        help_text="Data do evento" )
        
    data_hora_evento = models.TimeField(
        default=timezone.now,
        help_text="Data e hora do evento")

    turma = models.CharField(
        max_length=50, 
        blank=True, 
        help_text="Turma relacionada ao evento"
        )

    limite = models.PositiveIntegerField(
        default=25, 
        help_text="Limite de participantes"
        )


    status_atendimento = models.CharField(
        max_length=5,
        choices=StatusAtendimento.choices,
        default=StatusAtendimento.PENDENTE
    )

    usuario_create = models.ForeignKey(
    Usuario,
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name='eventos_criados'
    )

    class Meta:
        permissions = [
            ("pode_aprovar_evento", "Pode Aprovar/Confirmar Evento"),
        ]

    # usuarios = models.ManyToManyField(
    #     Usuario,
    #     related_name='eventos_participando',
    #     blank=True
    # )