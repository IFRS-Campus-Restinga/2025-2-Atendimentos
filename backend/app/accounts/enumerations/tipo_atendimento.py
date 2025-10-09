from django.db import models

class TipoAtendimento(models.TextChoices):
    SEM = 'SEMANAL', 'Semanal'
    EXT = 'EXTRA', 'Extra'