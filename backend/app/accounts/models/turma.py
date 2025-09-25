from django.db import models

class Turma(models.Model):
    nome = models.CharField(max_length=100)
    periodo = models.CharField(max_length=50)
    turno = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.nome} - {self.periodo} - {self.turno}"