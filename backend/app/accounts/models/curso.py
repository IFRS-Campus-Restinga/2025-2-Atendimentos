from django.db import models
from django.core.validators import MinLengthValidator, MinValueValidator
from .base_model import BaseModel
from ..enumerations.tipo_curso import TipoCurso
from .coordenador import Coordenador  # Certifique-se que o import está correto

class Curso(BaseModel):
    """
    Model que representa um curso ofertado pela instituição.
    """
    nome = models.CharField(
        max_length=255,
        validators=[MinLengthValidator(3)],
        help_text="Nome do curso"
    )

    cod = models.CharField(
        max_length=4,
        validators=[MinLengthValidator(3)],
        help_text="Codigo do curso"
    )

    tipo_curso = models.CharField(
        max_length=50,
        choices=TipoCurso.choices,
        help_text="Tipo do curso"
    )

    coordenador = models.OneToOneField(
        Coordenador,
        on_delete=models.SET_NULL,  # Ao deletar o coordenador, o curso permanece 
        null=True,
        blank=True,
        related_name="curso",
        help_text="Coordenador responsável pelo curso"
    )

    def delete(self, *args, **kwargs): 
        if self.coordenador:
            self.coordenador.delete() ## Mas se deletar o curso, o coordenador também é deletado
        super().delete(*args, **kwargs)

    def __str__(self):
        return f"{self.nome} ({self.get_tipo_curso_display()})"