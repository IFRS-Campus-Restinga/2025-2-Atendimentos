from django.db import models
from .usuario import Usuario

class Professor(Usuario):
    disciplina = models.CharField(max_length=100)

    class Meta:
        verbose_name = "Professor"
        verbose_name_plural = "Professores"

    def criar_atendimento(self):
        pass

    def cancelar_atendimento(self):
        pass

    def aprovar_solicitacoes(self):
        pass

    def __str__(self):
        return f"{self.nome} ({self.registro}) - Disciplina: {self.disciplina}"