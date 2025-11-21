from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from accounts.models import Evento


class Command(BaseCommand):
    help = 'Atribui permissões de evento aos grupos (Alunos, Professores, Coordenadores, Administradores)'

    def handle(self, *args, **options):
        # Obtém o ContentType para o modelo Evento
        try:
            ct = ContentType.objects.get(app_label='accounts', model='evento')
        except ContentType.DoesNotExist:
            self.stdout.write(self.style.ERROR('ContentType para Evento não encontrado. Execute makemigrations e migrate primeiro.'))
            return

        # Obtém as permissões
        try:
            perm_aprovar = Permission.objects.get(codename='pode_aprovar_evento', content_type=ct)
            perm_cancelar = Permission.objects.get(codename='pode_cancelar_evento', content_type=ct)
            perm_reagendar = Permission.objects.get(codename='pode_reagendar_evento', content_type=ct)
        except Permission.DoesNotExist as e:
            self.stdout.write(self.style.ERROR(f'Permissão não encontrada: {e}. Execute makemigrations e migrate primeiro.'))
            return

        # Configuração de permissões por grupo
        grupos_perms = {
            'Alunos': [perm_cancelar, perm_reagendar],
            'Professores': [perm_aprovar],
            'Coordenadores': [perm_aprovar, perm_cancelar, perm_reagendar],
            'Administradores': [perm_aprovar, perm_cancelar, perm_reagendar],
        }

        for grupo_nome, perms in grupos_perms.items():
            try:
                grupo = Group.objects.get(name=grupo_nome)
            except Group.DoesNotExist:
                self.stdout.write(self.style.WARNING(f'Grupo "{grupo_nome}" não encontrado. Criando...'))
                grupo = Group.objects.create(name=grupo_nome)

            # Adiciona as permissões ao grupo
            for perm in perms:
                grupo.permissions.add(perm)

            self.stdout.write(self.style.SUCCESS(f'✓ Grupo "{grupo_nome}" atualizado com {len(perms)} permissão(ões)'))

        self.stdout.write(self.style.SUCCESS('\n✅ Permissões de evento atribuídas com sucesso!'))
        self.stdout.write(self.style.SUCCESS('''
Resumo:
  - Alunos: pode_cancelar_evento, pode_reagendar_evento
  - Professores: pode_aprovar_evento
  - Coordenadores: pode_aprovar_evento, pode_cancelar_evento, pode_reagendar_evento
  - Administradores: pode_aprovar_evento, pode_cancelar_evento, pode_reagendar_evento
        '''))
