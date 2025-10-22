from django.db import models
from accounts.models.base_model import BaseModel
from accounts.enumerations.tipo_usuario import TipoUsuario
from django.conf import settings

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

    def __str__(self):
        return f"{self.nome} ({self.email})"

    def EditarPerfil(self):
        try:
            self.save()
            return True
        
        except Exception as e:
            return False