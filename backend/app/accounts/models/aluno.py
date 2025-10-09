from django.db import models
from accounts.models.base_model import BaseModel
from django.conf import settings


class Aluno(BaseModel):

    usuario = models.OneToOneField(
        settings.AUTH_USER_MODEL, # precisa ser confirmado
        on_delete=models.CASCADE,
        related_name='aluno'
    )
    #Aluno que precisa de mais tempo nos atendimentos
    alunoPEI = models.BooleanField(
        default=False, 
        verbose_name="Aluno PEI"
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

    '''
    nome_completo = models.CharField(
        max_length=50,
        verbose_name="Nome Completo",
        help_text="Insira o nome completo do(a) aluno(a)",
        null=False,
        blank=False,
    )
    matricula = models.CharField(
        max_length=15,
        unique=True,
        verbose_name="Número da Matrícula",
        help_text="Insira o número da matrícula, matrícula deve conter entre 1 e 15 dígitos numéricos.",
    )
    '''
    # função para pegar a matrícula (ou registro caso seja o caso) do usuario
    def get_identificador(self):
        if hasattr(self.usuario, 'registro'):
            return self.usuario.registro
        if hasattr(self.usuario, 'matricula'):
            return self.usuario.matricula
        return getattr(self.usuario, 'username', self.usuario.email)

    class Meta:
        verbose_name = "Aluno"
        verbose_name_plural = "Alunos"

    def __str__(self):
        nome = getattr(self.usuario, 'get_full_name', lambda: self.usuario.email)()
        return f"(Nome Completo: {nome} - Matrícula(ou Registro): {self.get_identificador()} - Curso: {self.curso} - Turma: {self.turma})"




def solicitaAtendimento(request):
    pass


def cancelaAtendimento(request):
    pass


    
