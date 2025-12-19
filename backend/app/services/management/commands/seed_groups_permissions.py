from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType

class Command(BaseCommand):
    help = 'Cria grupos padrão e associa permissões relacionadas a eventos (Professores, Coordenadores, Alunos, Administradores)'

    def handle(self, *args, **options):

        mapping = {
            'Professores': [

                'add_disciplina', 'change_disciplina', 'view_disciplina',
                'add_eventoordinario', 'change_eventoordinario', 'view_eventoordinario',
                'add_eventoconvocacao', 'change_eventoconvocacao', 'view_eventoconvocacao',
                'view_turma',
                'view_eventoextraordinario', 'change_eventoextraordinario',
                'approve_event', 'cancel_event', 'reschedule_event',
            ],
            'Coordenadores': [
                'view_disciplina', 'view_turma',
                'view_eventoordinario', 'view_eventoconvocacao', 'view_eventoextraordinario',
                'add_eventoconvocacao', 'change_eventoconvocacao', 'view_eventoconvocacao',
                'approve_event', 'cancel_event', 'reschedule_event',
            ],
            'Alunos': [
                'view_turma', 'view_disciplina',
                'add_eventoextraordinario', 'change_eventoextraordinario', 'view_eventoextraordinario',
                'view_eventoordinario', 'view_eventoconvocacao',
            ],
            'Administradores': [
                'add_eventoordinario', 'change_eventoordinario', 'delete_eventoordinario', 'view_eventoordinario',
                'add_eventoextraordinario', 'change_eventoextraordinario', 'delete_eventoextraordinario', 'view_eventoextraordinario',
                'add_eventoconvocacao', 'change_eventoconvocacao', 'delete_eventoconvocacao', 'view_eventoconvocacao',
                'add_disciplina', 'change_disciplina', 'delete_disciplina', 'view_disciplina',
                'add_turma', 'change_turma', 'delete_turma', 'view_turma',
                'approve_event', 'cancel_event', 'reschedule_event', 'create_convocation', 'end_convocation',
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
