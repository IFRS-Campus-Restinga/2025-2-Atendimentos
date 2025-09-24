from django.db import models

class Professor(models.Model):
    registro = models.CharField(max_length=20)
    disciplina = models.CharField(max_length=100)

    def criar_atendimento(self):
        print(f"Atendimento criado para o professor {self.registro}.")

    def cancelar_atendimento(self):
        print(f"Atendimento cancelado para o professor {self.registro}.")

    def aprovar_solicitacoes(self):
        print(f"Solicitações aprovadas pelo professor {self.registro}.")

    def __str__(self):
        return f"{self.registro} - {self.disciplina}"

    class Meta:
        verbose_name = "Professor"
        verbose_name_plural = "Professores"