from django.db import models

class Professor(models.Model):
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