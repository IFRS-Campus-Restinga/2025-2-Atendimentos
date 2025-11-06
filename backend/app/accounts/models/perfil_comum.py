from django.db import models


class PerfilComum(models.Model):

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