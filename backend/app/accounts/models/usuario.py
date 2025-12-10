from django.db import models
from accounts.models.base_model import BaseModel
from accounts.enumerations.tipo_usuario import TipoUsuario
from django.conf import settings
from accounts.models.curso import Curso

class Usuario(BaseModel):

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, # O modelo de User padrão do Django
        on_delete=models.CASCADE,
        related_name='perfil', # 'perfil' será o nome para acessar o Usuario a partir do User
        null=True, # Permitir NULL temporariamente se a criação não for atômica
        blank=True,
    )

    nome = models.CharField(
        max_length=100, 
        verbose_name="Nome"
    )

    email = models.EmailField(
        unique=True,  
        verbose_name="Email"
    )
    

    needs_complemento = models.BooleanField(
        default=True, # NOVO: Por padrão, todo usuário social precisa complementar
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

    curso = models.ForeignKey(
        Curso,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='usuarios',
        help_text="Curso vinculado (quando aplicável ao aluno)"
    )

    disciplinas = models.ManyToManyField(
        'accounts.Disciplina',
        blank=True,
        related_name='professores',
        help_text='Disciplinas associadas ao professor'
    )

    def __str__(self):
        return f"{self.nome} ({self.email})"

    def EditarPerfil(self):
        try:
            self.save()
            return True
        
        except Exception as e:
            return False
