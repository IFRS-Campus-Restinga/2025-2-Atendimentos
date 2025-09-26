from django.db import models
from django.core.validators import MinLengthValidator
from .base import BaseModel
from .curso import Curso 

class Turma(BaseModel):
    nome = models.CharField(
        max_length=255,
        validators=[MinLengthValidator(3)]
    )
    
    periodo = models.CharField(
        max_length=50,
        validators=[MinLengthValidator(3)]
    )
    
    turno = models.CharField(
        max_length=50,
        validators=[MinLengthValidator(3)]
    )
    
    curso = models.ForeignKey(
        Curso,
        on_delete=models.CASCADE,
        related_name="turmas"
    )
    
    def __str__(self):
        return f"{self.nome} - {self.curso.nome}"
