from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import datetime
from accounts.models.atendimento import Atendimento
from accounts.enumerations.status_atendimento import StatusAtendimento

class RegistroAtendimento(models.Model):
    atendimento = models.OneToOneField(
        Atendimento,
        on_delete=models.CASCADE,
        related_name="registro_atendimento",
    )
    data_atendimento = models.DateTimeField()
    descricao = models.TextField(max_length=300)

    def clean(self):
        # Validação: data após 01/01/2000
        ano_2000_naive = datetime(2000, 1, 1)
        ano_2000_aware = timezone.make_aware(ano_2000_naive, timezone.get_current_timezone())
        if self.data_atendimento < ano_2000_aware:
            raise ValidationError("A data de atendimento deve ser posterior a 01/01/2000.")

        # Só permitir registro se o atendimento estiver confirmado
        if self.atendimento.status != StatusAtendimento.CONFIRMADO:
            raise ValidationError("Só é possível criar um registro para um atendimento confirmado.")
        
    def emitir_registro(self):
        pass

    def __str__(self):
        return f"Registro do Atendimento {self.atendimento} em {self.data_atendimento.strftime('%d/%m/%Y %H:%M')}"
