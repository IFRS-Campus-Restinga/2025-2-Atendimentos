from django.db import models

class StatusAtendimento(models.TextChoices):
    PENDENTE = "PEND", "Pendente"
    CONFIRMADO = "CONF", "Confirmado"
    CANCELADO = "CANC", "Cancelado"
    DISPONIVEL = "DISP", "Disponível"
    OCUPADO = "OCUP", "Ocupado"
    CONCLUIDO = "CONCL", "Concluido"