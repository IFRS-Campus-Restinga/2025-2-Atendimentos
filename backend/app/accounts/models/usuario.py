from django.db import models
from accounts.models.base_model import BaseModel
from accounts.enumerations.tipo_usuario import TipoUsuario

class Usuario(BaseModel):
    """
    Model abstrato que representa um usuario.
    """
    class Meta:
        abstract = True

    nome = models.CharField(max_length=50, verbose_name="Nome")
    email = models.EmailField(unique=True, verbose_name="Email")
    registro = models.CharField(max_length=20, unique=True, verbose_name="Registro")
    tipoPerfil = models.CharField(
        max_length=20,
        choices=TipoUsuario.choices,
        verbose_name="Tipo de Usuario"
    )

    def __str__(self):
        return f"{self.nome} ({self.registro})"

    def EditarPerfil(self):
        try:
            self.save()
            return True
        except Exception as e:
            return False