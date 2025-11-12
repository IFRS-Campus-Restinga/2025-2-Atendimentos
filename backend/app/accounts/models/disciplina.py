from django.core.validators import MinLengthValidator, MaxValueValidator, MinValueValidator
from django.db import models
from rest_framework.exceptions import ValidationError
from .base_model import *
from .curso import Curso

class Disciplina(BaseModel):
    nome = models.CharField(
        max_length=50,
        verbose_name="Nome da Disciplina",
        blank=False,
        null=False
    )

    codigo = models.CharField(
        max_length=10,
        validators=[MinLengthValidator(3)],
        unique=True,
        blank=False,
        null=False,
        verbose_name="Código"
    )

    ativo = models.BooleanField(
        default=True,
        verbose_name="Ativo"
    )

    class Meta:
        abstract = False

    def __str__(self):
        return f"{self.codigo} - {self.nome}"

    def clean(self):
        if not isinstance(str(self.nome), str):
            raise ValidationError({
                "nome": "Nome informado é do tipo errado"
            }, code="error001")
        elif self.nome == "Teste":
            raise ValidationError({
                "nome": "Não é possível salvar testes!"
            }, code="error002")