from django.db import models
from accounts.models.base_model import BaseModel
from django.core.validators import (
    MinValueValidator,
    MaxValueValidator,
)


class Aluno(BaseModel):
    nome_completo = models.CharField(
        max_length=50,
        verbose_name="Nome Completo",
        help_text="Insira o nome completo do(a) aluno(a)",
        null=False,
        blank=False,
    )
    #Aluno que precisa de mais tempo nos atendimentos
    alunoPEI = models.BooleanField(
        default=False, 
        verbose_name="Aluno PEI",
        help_text="É um aluno PEI?"
    )
    matricula = models.BigIntegerField(
        verbose_name="Número da Matricula",
        help_text="Insira o número da matrícula",
        unique=True,
        validators=[
            MinValueValidator(
                10**9, message="O número da matricula deve conter 10 números."
            ),
            MaxValueValidator(
                10**10 - 1, message="O número da matricula deve conter 10 números."
            ),
        ],
    )
    curso = models.CharField(
        max_length=50,
        verbose_name="Nome do Curso",
        help_text="Insira o nome do curso",
        null=False,
        blank=False,
    )
    turma = models.CharField(
        max_length=50,
        verbose_name="Turma",
        help_text="Insira o nome da turma",
        null=False,
        blank=False,
    )


def solicitaAtendimento(request):
    pass


def cancelaAtendimento(request):
    pass


def __str__(self):
    return f"{self.nome_completo} (Matrícula: {self.matricula})"
