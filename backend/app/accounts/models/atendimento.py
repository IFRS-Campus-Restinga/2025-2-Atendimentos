from .base_model import *
from django.db import models
from django.utils import timezone
from ..enumerations.tipo_atendimento import TipoAtendimento
from ..enumerations.status_atendimento import StatusAtendimento
from .turma import Turma
# from models.professor import Professor
# from models.aluno import Aluno


class Atendimento(models.Model):
    # professor = models.ForeignKey(Professor, on_delete=models.CASCADE, related_name="atendimentos")
    # aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE, related_name="atendimentos")
    turma = models.ForeignKey(Turma, on_delete=models.CASCADE, related_name="atendimentos")

    dia_semana = models.DateField()
    data_hora = models.DateTimeField(default=timezone.now)

    tipo_atendimento = models.CharField(
        max_length=7,
        choices=TipoAtendimento.choices,
        default=TipoAtendimento.SEM
    )

    status = models.CharField(
        max_length=5,
        choices=StatusAtendimento.choices,
        default=StatusAtendimento.PENDENTE
    )

    def __str__(self):
        return f"Atendimento {self.turma} -  {self.tipo_atendimento}"