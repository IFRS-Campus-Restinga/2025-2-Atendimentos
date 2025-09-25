from django.db import models

class TipoPerfil(models.TextChoices):

    ADMIN = 'ADM', 'Administrador'
    PROFESSOR = 'PROF', 'Professor'
    ALUNO = 'ALU', 'Aluno'
    COORDENADOR = 'COOR', 'Coordenador'
