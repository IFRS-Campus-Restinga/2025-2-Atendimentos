from django.db import models

class TipoCurso(models.TextChoices):
    SAE = 'SAE', 'superior_agroecologia'
    SADS = 'SADS', 'superior_ads'
    SEI = 'SEI', 'superior_eletronica_industrial'
    SGDL = 'SGDL', 'superior_gestao_desportiva_lazer'
    SLPE = 'SLPE', 'superior_letras_port_esp'
    SPG = 'SPG', 'superior_processos_gerenciais'
    TCS = 'TCS', 'tecnico_concomitante_subsequente'
    TI = 'TI', 'tecnico_integrado'
    TP = 'TP', 'tecnico_proeja'
    TS = 'TS', 'tecnico_subsequente'
