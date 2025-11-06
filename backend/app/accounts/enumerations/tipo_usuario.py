from django.db import models

class TipoUsuario(models.TextChoices):

    ADMIN = 'ADM', 'Administrador'
    PROFESSOR = 'PROF', 'Professor'
    ALUNO = 'ALU', 'Aluno'
    COORDENADOR = 'COORD', 'Coordenador'