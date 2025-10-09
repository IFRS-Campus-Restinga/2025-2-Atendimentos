from django.db import models
from .usuario import Usuario
from django.core.validators import MinLengthValidator, MaxLengthValidator


class Servidor(Usuario):
    servidor = models.CharField(max_length=30,validators=[MinLengthValidator(10), MaxLengthValidator(30)])


    class Meta:
        verbose_name = "Servidor"
        verbose_name_plural = "Servidores"

    def criar_atendimento(self):
        pass

    def cancelar_atendimento(self):
        pass

    def aprovar_solicitacoes(self):
        pass

    def __str__(self):
        return f"{self.servidor}"