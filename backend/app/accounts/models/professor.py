from django.db import models
from django.conf import settings
from accounts.models.base_model import BaseModel
from .perfil_comum import PerfilComum

class Professor(BaseModel, PerfilComum):

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='professor'
    )

    registro = models.CharField(max_length=20)
    disciplina = models.CharField(max_length=100)

    def criar_atendimento(self):
        pass

    def cancelar_atendimento(self):
        pass

    def aprovar_solicitacoes(self):
        pass

    def __str__(self):
        return f"{self.registro} - {self.disciplina}"