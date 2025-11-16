from django.db import models
from django.conf import settings
from accounts.models.base_model import BaseModel

class UsuarioExtra(BaseModel):
    """Informações opcionais/supérfluas do perfil do usuário.
    Todas as informações são estritamente opcionais e podem ser editadas livremente
    sem afetar os dados "oficiais" (nome, matrícula, etc.).
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='extras'
    )
    avatar = models.ImageField(
        upload_to='avatars/',
        null=True,
        blank=True,
        help_text='Foto de perfil opcional.'
    )
    bio = models.TextField(
        null=True,
        blank=True,
        max_length=500,
        help_text='Pequena biografia ou descrição.'
    )
    data_nascimento = models.DateField(
        null=True,
        blank=True,
        help_text='Data de nascimento.'
    )
    localizacao = models.CharField(
        max_length=120,
        null=True,
        blank=True,
        help_text='Cidade/Estado ou localização livre.'
    )
    website = models.URLField(
        null=True,
        blank=True,
        help_text='Website pessoal.'
    )
    instagram = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        help_text='Usuário do Instagram.'
    )
    linkedin = models.URLField(
        null=True,
        blank=True,
        help_text='Perfil do LinkedIn.'
    )

    class Meta:
        verbose_name = 'Dados extras do Usuário'
        verbose_name_plural = 'Dados extras dos Usuários'
        app_label = 'accounts'

    def __str__(self):
        return f"Extras de {self.user.email}"