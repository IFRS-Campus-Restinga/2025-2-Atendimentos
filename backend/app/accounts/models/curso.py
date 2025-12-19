from django.db import models
from django.core.validators import MinLengthValidator, MinValueValidator
from .base_model import BaseModel
from ..enumerations.tipo_curso import TipoCurso

class Curso(BaseModel):
    nome = models.CharField(
        max_length=255,
        validators=[MinLengthValidator(3)],
        help_text="Nome do curso"
    )

    codigo = models.CharField(
        max_length=4,
        validators=[MinLengthValidator(3)],
        help_text="Codigo do curso"
    )

    tipo_curso = models.CharField(
        max_length=50,
        choices=TipoCurso.choices,
        help_text="Tipo do curso"
    )

    # Campo de coordenador removido; coordenação poderá ser inferida por Usuario(tipo COORD)

    def __str__(self):
        return f"{self.nome} ({self.get_tipo_curso_display()})"