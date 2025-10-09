from django.contrib import admin
from accounts.models import *

# Register your models here.
admin.site.register(Servidor)
admin.site.register(Disciplina)
admin.site.register(Turma)
admin.site.register(Curso)
admin.site.register(Coordenador)
admin.site.register(Aluno)
admin.site.register(Atendimento)