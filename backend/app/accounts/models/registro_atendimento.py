from django.db import models
from django.core.exceptions import ValidationError
from datetime import datetime
from django.utils import timezone
#from .evento import Evento  #esperando model

class Evento(models.Model):
    class StatusEvento(models.TextChoices):
        EM_ANDAMENTO = "Em andamento", "Em andamento"
        CONCLUIDO = "Concluído", "Concluído"

    nome = models.CharField(max_length=100)
    data = models.DateField()
    local = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=StatusEvento.choices,
        default=StatusEvento.EM_ANDAMENTO
    )

    def __str__(self):
        return f"{self.nome} ({self.status})"

class RegistroAtendimento(models.Model):
    evento = models.OneToOneField(
        Evento,
        on_delete=models.CASCADE,
        related_name="atendimento"
    )
    data_atendimento = models.DateTimeField()
    descricao = models.TextField(max_length=300)

    def clean(self):
        # Cria datetime naïve e transforma em aware usando timezone do Django
        ano_2000_naive = datetime(2000, 1, 1)
        ano_2000_aware = timezone.make_aware(ano_2000_naive, timezone.get_current_timezone())
        
        if self.data_atendimento < ano_2000_aware:
            raise ValidationError("A data de atendimento deve ser posterior a 01/01/2000.")
        
        if self.evento.status != "Concluído":
            raise ValidationError("Só é possível criar um registro para um evento concluído.")




    def emitir_registro(self):
        
        pass

    def __str__(self):
    # Formata a data/hora sem timezone
        return f"Registro do Evento '{self.evento}' em {self.data_atendimento.strftime('%d/%m/%Y %H:%M')}"