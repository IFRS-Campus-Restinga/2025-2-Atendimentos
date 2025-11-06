from django.db import models

class Turno(models.TextChoices):
    MANHA = 'M', 'Manhã'
    TARDE = 'T', 'Tarde'
    NOITE = 'N', 'Noite'