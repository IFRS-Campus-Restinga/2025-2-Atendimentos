from django.db import models
from django.core.validators import MinLengthValidator, MinValueValidator
from django.core.exceptions import ValidationError
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
    
    semestre = models.IntegerField(
        validators=[MinValueValidator(1)],  
        blank=True,  
        null=True,  
        verbose_name="Semestre da disciplina (1,2,...,10)"
    )    

    ano = models.IntegerField(
        validators=[MinValueValidator(1)],  
        blank=True,  
        null=True,  
        verbose_name="Ano da turma"
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

    disciplina = models.ManyToManyField(
        'Disciplina',
        related_name='turmas',
        blank=True
    )

    ##Relação com alunos

    class Meta:
        unique_together = ('nome', 'curso', 'turno')

    def __str__(self):
        return f"{self.nome} - {self.curso.nome}, {self.get_turno_display()})"

    def clean(self):
        """
        Valida os campos 'semestre' e 'ano' dependendo do tipo de curso.
        """
        if self.curso.tipo_curso == 'SUPERIOR' or self.curso.tipo_curso == 'PROEJA':
            if not self.semestre:
                raise ValidationError("O campo 'semestre' é obrigatório para cursos superiores e Proeja.")
            if self.ano is not None:
                raise ValidationError("O campo 'ano' não deve ser preenchido para cursos superiores e Proeja.")
        else:
            if not self.ano:
                raise ValidationError("O campo 'ano' é obrigatório para cursos técnicos.")
            if self.semestre is not None:
                raise ValidationError("O campo 'semestre' não deve ser preenchido para cursos técnicos.")
