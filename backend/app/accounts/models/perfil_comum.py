from django.db import models


class Perfil(models.Model):

    nome_completo = models.CharField(
        max_length=100, 
        verbose_name="Nome"
    )

    cpf = models.CharField(
        max_length=14,
        unique=True,
        null=True, 
        blank=True,
        verbose_name="CPF"
    )
    telefone = models.CharField(
        max_length=15,
        null=True, 
        blank=True,
        verbose_name="Telefone de Contato"
    )

    class Meta:
        abstract = True
        app_label = 'accounts'