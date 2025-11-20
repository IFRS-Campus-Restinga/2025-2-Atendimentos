from django.db import models
from .evento import Evento
from .usuario import Usuario
from accounts.enumerations.tipo_usuario import TipoUsuario

class EventoExtraordinario(Evento):

    

    # def clean(self):
    #     super().clean()
    #     for usuario in self.usuarios.all():
    #         if usuario.tipoPerfil != TipoUsuario.PROFESSOR:
    #             from django.core.exceptions import ValidationError
    #             raise ValidationError(f"Usuário {usuario} não é do tipo PROFESSOR.")

    def __str__(self):
        turma_nome = self.turma.nome if self.turma else "Sem Turma"
        data = self.data_evento.strftime("%d/%m/%Y")
        inicio = self.hora_evento_inicio.strftime("%H:%M")
        fim = self.hora_evento_fim.strftime("%H:%M")
        return f"{turma_nome} - {data} ({inicio}–{fim})"

    class Meta:
        verbose_name = 'Evento Extraordinário'
        verbose_name_plural = 'Eventos Extraordinários'
