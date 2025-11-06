from django.db import models

class TipoCurso(models.TextChoices):
    SUPERIOR = 'SUPERIOR', 'Superior'
    TECNICO_INTEGRADO = 'TECNICO_INTEGRADO', 'Técnicos Integrados ao Ensino Médio'
    TECNICO_SUBSEQUENTE = 'TECNICO_SUBSEQUENTE', 'Técnicos Subsequentes ao Ensino Médio'
    PROEJA = 'PROEJA', 'Educação de Jovens e Adultos (Proeja)'