from django.db import models
from accounts.models.base_model import BaseModel


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
    matricula = models.CharField(
        max_length=15,
        unique=True,
        verbose_name="Número da Matrícula",
        help_text="Insira o número da matrícula, matrícula deve conter entre 1 e 15 dígitos numéricos.",
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
