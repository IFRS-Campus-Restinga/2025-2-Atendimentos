from django.db import models
from django.conf import settings
from .base_model import BaseModel
from django.core.validators import *
from .disciplina import Disciplina

class AtendimentoEscolar(models.Model):

    PRESENCIAL_CHOICES = [
        ('PRESENCIAL', 'Presencial'),
        ('ONLINE', 'Online'),
    ]

    modalidade_presencial = models.CharField(
        max_length=20,
        choices=PRESENCIAL_CHOICES,
        default='PRESENCIAL'
    )

    STATUS_CHOICES = [
        ('CONVOCADO', 'Convocado'),
        ('REALIZADO', 'Realizado'),
        ('CANCELADO', 'Cancelado'),
        ('AUSENTE', 'Ausente'),
    ]

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='CONVOCADO'
    )

    FINALIDADE_CHOICES = [
        ('ORIENTACAO_EST', 'Orientações de estudoes'),
        ('REVISAO', 'Revisão para avaliação'),
        ('ORIENTACAO_ATI', 'Orientação de atividade'),
        ('ATENDIMENTO', 'Atendimento pedagógico'),
        ('OUTRO', 'Outro'),
    ]

    finalidade = models.CharField(
        max_length=40,
        choices=FINALIDADE_CHOICES,
        default='REVISAO'
    )

    professor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='professor',
        default=''
    )

    disciplina = models.ForeignKey(
        Disciplina,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        help_text="Disciplina relacionada ao evento"
    )

    aluno = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='aluno',
        default=''
    )

    email_aluno = models.EmailField(unique=True, verbose_name="Email")

    

    link = models.CharField(
        max_length=200,
        null=True,
        blank=True,
        validators=[MinLengthValidator(10)],
        help_text="Link se modalidade online"
    )

    descricao_convocacao = models.TextField(max_length=500, validators=[MinLengthValidator(10)])

    

    data = models.DateTimeField()
    hora_inicio = models.TimeField()
    hora_fim = models.TimeField()


    sala = models.CharField(
        max_length=30,
        null=True,
        blank=True,
        help_text="Sala/local do atendimento"
    )

    

    def __str__(self):
        return f"{self.professor} - {self.disciplina} - {self.data.strftime('%d/%m/%Y %H:%M')}"

    def clean(self):
        if self.modalidade_presencial in ['ONLINE']:
            if not self.link:
                raise ValidationError("O campo 'link' é obrigatório para modalidade online.")
            if self.sala is not None:
                raise ValidationError("O campo 'sala' não deve ser preenchido para modalidade online.")
        else:
            if not self.sala:
                raise ValidationError("O campo 'sala' é obrigatório para modalidade presencial.")
            if self.link is not None:
                raise ValidationError("O campo 'link' não deve ser preenchido para modalidade presencial.")


