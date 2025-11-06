from accounts.models.base_model import BaseModel
from django.db import models
from django.utils import timezone
from accounts.enumerations.status_atendimento import StatusAtendimento
from .usuario import Usuario

class Evento(BaseModel):

    dia_semana = models.DateField(
        help_text="Data do dia da semana do evento"
        )

    data_hora = models.DateTimeField(
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
            # ... (Permissões de Ordinário)
            ("can_create_ordinary", "Pode criar um Evento Ordinário"), 
            ("can_participate_ordinary", "Pode participar de um Evento Ordinário"), 
            
            # PERMISSÕES DE EXTRAORDINÁRIO:
            ("can_create_extraordinary", "Pode criar um Evento Extraordinário"), # Professor/Coordenador
            ("can_participate_extraordinary", "Pode participar de um Evento Extraordinário"), # Professor
            
            # Permissão de Admin Geral
            ("can_administer_all_events", "Pode visualizar e gerenciar todos os tipos de eventos"), 
        ]

    # usuarios = models.ManyToManyField(
    #     Usuario,
    #     related_name='eventos_participando',
    #     blank=True
    # )