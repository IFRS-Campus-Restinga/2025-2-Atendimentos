from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType

class Command(BaseCommand):
    help = 'Cria grupos padrão e associa permissões relacionadas a eventos (Professores, Coordenadores, Alunos, Administradores)'

    def handle(self, *args, **options):
        mapping = {
            'Professores': [
                'add_eventoordinario',
                'add_convocacao',
                'change_evento',
                'pode_aprovar_evento',
                'pode_reagendar_evento',
            ],
            'Coordenadores': [
                'add_eventoordinario',
                'change_evento',
                'pode_aprovar_evento',
            ],
            'Alunos': [
                'add_eventoextraordinario',
            ],
            'Administradores': [
              
                'add_eventoordinario',
                'add_eventoextraordinario',
                'add_convocacao',
                'change_evento',
                'delete_evento',
                'pode_aprovar_evento',
                'pode_cancelar_evento',
                'pode_reagendar_evento',
            ],
        }

        created_groups = []
        for group_name, perms in mapping.items():
            group, created = Group.objects.get_or_create(name=group_name)
            if created:
                created_groups.append(group_name)
            self.stdout.write(f"Grupo: {group_name} (criado={created})")

            added = []
            missing = []
            for codename in perms:
                perm = Permission.objects.filter(codename=codename).first()
                if not perm:
                    missing.append(codename)
                    continue
                group.permissions.add(perm)
                added.append(codename)

            self.stdout.write(f"  Permissões adicionadas: {added}")
            if missing:
                self.stdout.write(self.style.WARNING(f"  Permissões ausentes (não encontradas no DB): {missing} -- verifique migrations ou crie as permissões customizadas."))

        self.stdout.write(self.style.SUCCESS('Seed de grupos e permissões concluído.'))
