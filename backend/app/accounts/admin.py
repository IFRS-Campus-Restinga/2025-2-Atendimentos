from django.contrib import admin
from accounts.models import Turma 

# Register your models here.

classes = [Turma]

admin.site.register(classes)
