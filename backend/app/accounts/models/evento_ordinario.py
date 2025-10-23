from django.db import models
from .evento import Evento
from .usuario import Usuario
from accounts.enumerations.tipo_usuario import TipoUsuario

class EventoOrdinario(Evento):
    # """
    # Evento ordinário, apenas usuários do tipo ALUNO podem participar.
    # """
    # usuarios = models.ManyToManyField(
    #     Usuario,
    #     related_name='eventos_ordinarios',
    #     blank=True
    # )


    # def clean(self):
    #     super().clean()
    #     for usuario in self.usuarios.all():
    #         if usuario.tipoPerfil != TipoUsuario.ALUNO:
    #             from django.core.exceptions import ValidationError
    #             raise ValidationError(f"Usuário {usuario} não é do tipo ALUNO.")

    class Meta:
        verbose_name = 'Evento Ordinário'
        verbose_name_plural = 'Eventos Ordinários'
