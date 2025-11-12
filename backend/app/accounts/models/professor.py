from django.db import models
from django.conf import settings
from accounts.models.base_model import BaseModel
from .perfil_comum import Perfil

class Professor(BaseModel, Perfil):

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='professor',
        primary_key=True
    )

    registro = models.CharField(max_length=20)
    disciplina = models.CharField(max_length=100)


    class Meta:
        verbose_name = "Professor"
        verbose_name_plural = "Professores"
        # Adicione permissões específicas aqui
        permissions = [
            ("can_create_atendimento_slot", "Pode Criar Slots de Atendimento"),
            ("can_approve_requests", "Pode Aprovar Solicitações de Atendimento"),
        ]


    def criar_atendimento(self):
        pass

    def cancelar_atendimento(self):
        pass

    def aprovar_solicitacoes(self):
        pass

    def __str__(self):
        return f"{self.registro} - {self.disciplina}"