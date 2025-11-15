from django.db import models
from accounts.models.base_model import BaseModel
from accounts.models.usuario import Usuario
from accounts.models.disciplina import Disciplina


class HistoricoAtendimento(BaseModel):
    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='historico_atendimentos',
        limit_choices_to={'tipoPerfil': 'PROF'},
        help_text='Professor responsável'
    )
    disciplina = models.ForeignKey(
        Disciplina,
        on_delete=models.CASCADE,
        related_name='historico_atendimentos'
    )
    horas_ofertadas = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0.0,
        verbose_name="Horas Ofertadas"
    )
    horas_obrigatorias = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0.0,
        verbose_name="Horas Obrigatórias"
    )
    mes_referencia = models.DateField(
        verbose_name="Mês de Referência"
    )
    observacoes = models.TextField(
        max_length=500,
        blank=True,
        null=True
    )

    class Meta:
        verbose_name = "Histórico de Atendimento"
        verbose_name_plural = "Históricos de Atendimentos"
        unique_together = ('usuario', 'disciplina', 'mes_referencia')

    def __str__(self):
        return f"{self.usuario.nome} - {self.disciplina} ({self.mes_referencia})"

    @property
    def percentual_cumprido(self):
        if self.horas_obrigatorias > 0:
            return (self.horas_ofertadas / self.horas_obrigatorias) * 100
        return 0

    @property
    def status_cumprimento(self):
        perc = self.percentual_cumprido
        if perc >= 100:
            return "CUMPRIDO"
        elif perc >= 80:
            return "PARCIAL"
        else:
            return "INSUFICIENTE"