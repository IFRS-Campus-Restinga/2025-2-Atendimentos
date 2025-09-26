from django.db import models
from django.core.validators import MinLengthValidator, MinValueValidator
from .base import BaseModel
from ..enumerations.TipoCurso import TipoCurso

class Curso(BaseModel):
    nome = models.CharField(
        max_length=255,
        validators=[MinLengthValidator(3)]
    )

    duracao = models.IntegerField(
        validators=[MinValueValidator(1)],
        help_text="Duração"
    )

    tipocurso = models.CharField(
        max_length=50,
        choices=TipoCurso.choices
    )

    coordenador = models.CharField(
        max_length=255,
        validators=[MinLengthValidator(3)],
        help_text="Nome do coordenador"     # sera modificado para buscar de um model
    )

    def __str__(self):
        return f"{self.nome} ({self.tipocurso})"
