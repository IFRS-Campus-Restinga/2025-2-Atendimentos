from accounts.models.base_model import BaseModel
from django.db import models
from django.utils import timezone
from accounts.enumerations.status_atendimento import StatusAtendimento
from .usuario import Usuario
from .turma import Turma
from .disciplina import Disciplina

class Evento(BaseModel):

    data_criacao = models.DateTimeField(
        default=timezone.now,
        blank=True,
        help_text="Data e hora de criação do evento" )

    data_evento = models.DateField(
        default=timezone.now,
        help_text="Data do evento" )
        
    hora_evento = models.TimeField(
        default=timezone.now,
        help_text="Data e hora do evento")

    
    # Impede que o registro  pai seja deletado se ainda existir registros filhos.  - Verificar se esta correto
    turma = models.ForeignKey(
        Turma,
        on_delete=models.PROTECT,
        related_name='eventos',
        null=True,
        blank=True,
        help_text="Turma relacionada ao evento"
    )

    disciplina = models.ForeignKey(
        Disciplina,
        on_delete=models.PROTECT,
        related_name='eventos',
        null=True,
        blank=True,
        help_text="Disciplina relacionada ao evento"
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
