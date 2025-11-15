from django.contrib import admin
from accounts.models import *


# Register your models here.
# Removed Professor, Coordenador, Aluno models
admin.site.register(Disciplina)
admin.site.register(Turma)
admin.site.register(Curso)
admin.site.register(Usuario)
admin.site.register(Evento)
admin.site.register(EventoOrdinario)
admin.site.register(EventoExtraordinario)
admin.site.register(RegistroAtendimento)
admin.site.register(HistoricoAtendimento)
