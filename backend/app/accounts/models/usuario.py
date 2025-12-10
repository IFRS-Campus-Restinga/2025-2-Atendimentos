from django.db import models
from accounts.models.base_model import BaseModel
from accounts.enumerations.tipo_usuario import TipoUsuario
from django.conf import settings
from accounts.models.curso import Curso
from accounts.models.disciplina import Disciplina

class Usuario(BaseModel):

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='perfil',
        null=True,
        blank=True,
    )

    nome = models.CharField(max_length=100, verbose_name="Nome")
    email = models.EmailField(unique=True, verbose_name="Email")

    needs_complemento = models.BooleanField(
        default=True,
        verbose_name="Necessita Complemento de Cadastro"
    )

    tipoPerfil = models.CharField(
        max_length=20,
        choices=TipoUsuario.choices,
        verbose_name="Tipo de Usuario"
    )

    # Campos opcionais conforme o papel
    registro = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text="Registro do professor (quando aplicável)"
    )

    matricula = models.CharField(
        max_length=30,
        blank=True,
        null=True,
        help_text="Matrícula do aluno (quando aplicável)"
    )

    curso = models.ForeignKey(   # aluno tem curso vinculado
        Curso,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='usuarios',
        help_text="Curso vinculado (quando aplicável ao aluno)"
    )

    disciplina = models.ForeignKey(
        Disciplina,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="professores",
        help_text="Disciplina vinculada ao professor"
    )



    def __str__(self):
        return f"{self.nome} ({self.email})"

    def EditarPerfil(self):
        try:
            self.save()
            return True
        except Exception:
            return False

    def clean(self):
        from django.core.exceptions import ValidationError
        # Validação condicional
        if self.tipoPerfil == TipoUsuario.PROFESSOR and not self.disciplinas.exists():
            raise ValidationError("Professor deve estar vinculado a pelo menos uma disciplina.")
        if self.tipoPerfil == TipoUsuario.ALUNO and not self.curso:
            raise ValidationError("Aluno deve estar vinculado a um curso.")
        if self.tipoPerfil == TipoUsuario.ALUNO and self.disciplinas.exists():
            raise ValidationError("Aluno não pode ter disciplinas vinculadas diretamente.")