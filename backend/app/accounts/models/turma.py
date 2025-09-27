from django.db import models
from django.core.validators import MinLengthValidator
from .base_model import BaseModel
from .curso import Curso 
from accounts.enumerations.turnos import Turno

class Turma(BaseModel):
    """
    Model que representa uma turma de um curso.
    """
    nome = models.CharField(
        max_length=255,
        validators=[MinLengthValidator(3)],
        blank=False,
        null=False
    )
    periodo = models.CharField(
        max_length=50,
        validators=[MinLengthValidator(3)], ## ainda temos que discutir sobre esse campo
        blank=False,
        null=False
    )
    turno = models.CharField(
        max_length=1,
        choices=Turno.choices,
        blank=False,
        null=False
    )
    curso = models.ForeignKey(
        Curso,
        on_delete=models.CASCADE,
        related_name="turmas"
    )

    class Meta:
        unique_together = ('nome', 'curso', 'periodo', 'turno')

    def __str__(self):
        return f"{self.nome} - {self.curso.nome}, {self.get_turno_display()})"