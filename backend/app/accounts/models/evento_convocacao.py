from accounts.models.base_model import BaseModel
from django.db import models
from django.utils import timezone
from accounts.enumerations.status_atendimento import StatusAtendimento
from .usuario import Usuario
from .curso import Curso
from .disciplina import Disciplina
from .evento import Evento
from datetime import datetime, timedelta
from django.core.exceptions import ValidationError

class EventoConvocacao(Evento):
    """
    Evento específico de convocação de atendimento:
    - Professor convoca um Aluno
    - Regras de data mínima e duração mínima
    """

    professor = models.ForeignKey(
        Usuario,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="eventos_professor"
    )



    aluno = models.ForeignKey(
        Usuario,
        on_delete=models.PROTECT,
        related_name='convocacoes_aluno',
        help_text="Usuário com perfil Aluno convocado"
    )
    curso = models.ForeignKey(
        Curso,
        on_delete=models.PROTECT,
        related_name='convocacoes_eventos',
        null=True,
        blank=True,
        help_text="Curso relacionado ao evento"
    )
    mensagem = models.TextField(null=True, blank=True) 

    encerrado_em = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Data/hora real de encerramento do atendimento"
    )

    class Meta:
        permissions = [
            ("create_convocation", "Can create convocation"),
            ("end_convocation", "Can end convocation"),
        ]
        verbose_name = "Evento de Convocação"
        verbose_name_plural = "Eventos de Convocação"

    def clean(self):
        """
        Validações específicas:
        - Data mínima: >= hoje + 1
        - Duração mínima: 30 min (quando encerrado)
        - Perfis corretos: professor/aluno
        """
        super().clean()

        # Data mínima
        min_date = timezone.localdate() + timedelta(days=1)
        if self.data_evento < min_date:
            raise ValidationError("Data do evento deve ser a partir de amanhã.")

        # Duração mínima só quando encerrado
        if self.encerrado_em:
            inicio = timezone.make_aware(
                datetime.combine(self.data_evento, self.hora_evento_inicio)
            )
            duracao = self.encerrado_em - inicio
            if duracao < timedelta(minutes=30):
                raise ValidationError("Atendimento deve ter duração mínima de 30 minutos.")

        # Perfis
        if self.professor and self.professor.perfil.user != 'Professor':
            raise ValidationError("Usuário convocador deve ter perfil Professor.")
        if self.aluno and self.aluno.perfil.user != 'Aluno':
            raise ValidationError("Usuário convocado deve ter perfil Aluno.")

    def encerrar(self):
        """Encerrar atendimento garantindo duração mínima"""
        inicio = timezone.make_aware(
            datetime.combine(self.data_evento, self.hora_evento_inicio)
        ) 
        now = timezone.now()
        min_end = inicio + timedelta(minutes=30)
        self.encerrado_em = max(now, min_end)
        self.status_atendimento = StatusAtendimento.CONCLUIDO
        self.save()