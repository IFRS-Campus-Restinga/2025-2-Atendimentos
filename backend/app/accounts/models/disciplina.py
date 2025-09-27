from django.core.validators import MinLengthValidator, MaxValueValidator, MinValueValidator
from django.db import models
from rest_framework.exceptions import ValidationError
from .base_model import *
from .curso import Curso
#from .professor impot Professor

class Disciplina(BaseModel):
    """
    Model que representa uma disciplina ofertada.
    """
    cursos = models.ManyToManyField(Curso, related_name='disciplinas')

    #professor = models.ForeignKey('Professor', on_delete=models.SET_NULL, null=True, blank=True)

    professor = models.CharField(max_length=100, blank=True, null=True, verbose_name="Nome do professor (opcional)")  # Nome do professor, opcional
    
    nome = models.CharField(
        max_length=50, 
        verbose_name="Nome da Disciplina",
        blank=False, 
        null=False
    )
    codigo = models.CharField(
        max_length=10, 
        validators=[MinLengthValidator (3)], 
        unique=True, 
        blank=False, 
        null=False, 
        verbose_name="Código",
    )
    carga_horaria = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],  # Exemplo: mínimo de 1 hora
        blank=False, 
        null=False,
        verbose_name="Carga Horária (em horas)"
    )
    semestre = models.IntegerField(
        validators=[MinValueValidator(1)],  # Exemplo: mínimo semestre 1
        blank=False, 
        null=False,
        verbose_name="Semestre da disciplina (1,2,...,10)"
    )    # Semestre da disciplina (1,2,...)
    descricao = models.TextField(
        max_length=100,
        blank=True, 
        null=True, 
        verbose_name="Descrição"
        )  # Descrição da disciplina
    data_criacao = models.DateTimeField(
        auto_now_add=True, 
        verbose_name="Data de Criação"
        )
    ativo = models.BooleanField(
        default=True, 
        verbose_name="Ativo"
        )  # Status da disciplina
    

    class Meta:
        abstract = False

    def __str__(self):
        return f"{self.codigo} - {self.nome}"
    

    def clean(self):
        if not isinstance(str(self.nome), str):
            raise ValidationError({
                "nome": 'Nome informado é do tipo errado'},
                code='error001')
        elif self.nome == "Teste":
            raise ValidationError(
                {"nome": 'Não é possível salvar testes!'},
                code="error002")