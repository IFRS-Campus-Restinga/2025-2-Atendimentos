from django.db import models

class TipoUsuario(models.TextChoices):

    ADMIN = 'ADM', 'Administrador'
    SERVIDOR = 'SERV', 'Servidor'
    ALUNO = 'ALU', 'Aluno'
    COORDENADOR = 'COORD', 'Coordenador'