from django.db import models
from accounts.models.base_model import BaseModel
from .perfil_comum import PerfilComum
from django.conf import settings


class Aluno(BaseModel, PerfilComum):

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='aluno'
    )
    #Aluno que precisa de mais tempo nos atendimentos
    alunoPEI = models.BooleanField(
        default=False, 
        verbose_name="Aluno PEI"
    )

    matricula = models.CharField( 
        max_length=15,
        unique=True,
        null=True, blank=True,
        verbose_name="Número da Matrícula"
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
    
    class Meta:
        verbose_name = "Aluno"
        verbose_name_plural = "Alunos"
    

    def __str__(self):
        nome = getattr(self.user, 'get_full_name', lambda: self.user.email)()
        return f"(Nome Completo: {nome} - Matrícula: {self.matricula} - Curso: {self.curso} - Turma: {self.turma})"




def solicitaAtendimento(request):
    pass


def cancelaAtendimento(request):
    pass


    
