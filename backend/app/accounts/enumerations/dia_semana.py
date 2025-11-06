from django.db import models

class DiaSemana(models.TextChoices):

    SEG = 'SEG', 'Segunda-feira'
    TER = 'TER', 'Terça-feira'
    QUA = 'QUA', 'Quarta-feira'
    QUI = 'QUI', 'Quinta-feira'
    SEX =  'SEX', 'Sexta-feira'
    SAB = 'SAB', 'Sábado'

    