from django.db import models
from django.conf import settings

class AtendimentoEscolar(models.Model):

    STATUS_CHOICES = [
        ('AGENDADO', 'Agendado'),
        ('CONFIRMADO', 'Confirmado'),
        ('CANCELADO', 'Cancelado'),
        ('REALIZADO', 'Realizado'),
    ]

    solicitante = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='atendimentos_solicitados'
    )

    titulo = models.CharField(max_length=100)
    descricao = models.TextField(blank=True)

    data = models.DateField()
    hora_inicio = models.TimeField()
    hora_fim = models.TimeField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='AGENDADO'
    )

    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.titulo} - {self.data}"
