from django.core.management.base import BaseCommand
from django.contrib.auth.models import Permission, Group, User
from django.contrib.contenttypes.models import ContentType
from guardian.models import UserObjectPermission, GroupObjectPermission


class Command(BaseCommand):
    help = (
        "Migrate old permission codenames (pode_*) to new standardized names and copy associations. "
        "Does not remove old permissions unless --remove-old is passed."
    )

    DEFAULT_MAPPING = {
        'pode_aprovar_evento': 'approve_event',
        'pode_cancelar_evento': 'cancel_event',
        'pode_reagendar_evento': 'reschedule_event',
        'pode_criar_convocacao': 'create_convocation',
        'pode_encerrar_convocacao': 'end_convocation',
    }

    def add_arguments(self, parser):
        parser.add_argument('--remove-old', action='store_true', help='Remove old permission associations and permission.')
        parser.add_argument('--mapping-file', type=str, help='Path to a JSON file with custom mapping (optional).')

    def handle(self, *args, **options):
        remove_old = options.get('remove_old')

        mapping = self.DEFAULT_MAPPING.copy()

        self.stdout.write(self.style.MIGRATE_HEADING('Starting permission codename migration'))

        for old_codename, new_codename in mapping.items():
            perms_old = Permission.objects.filter(codename=old_codename)
            if not perms_old.exists():
                self.stdout.write(self.style.WARNING(f"Old permission '{old_codename}' not found in DB. Skipping."))
                continue

            for perm_old in perms_old:
                perm_new, created = Permission.objects.get_or_create(
                    codename=new_codename,
                    content_type=perm_old.content_type,
                    defaults={'name': perm_old.name.replace('Pode', 'Can').replace('(', '').replace(')', '')}
                )

                if created:
                    self.stdout.write(self.style.SUCCESS(f"Created new permission '{new_codename}' for content_type {perm_old.content_type} "))

                groups = Group.objects.filter(permissions=perm_old)
                for g in groups:
                    g.permissions.add(perm_new)
                    self.stdout.write(self.style.NOTICE(f"Added permission '{new_codename}' to group '{g.name}'"))
                    if remove_old:
                        g.permissions.remove(perm_old)

                users = User.objects.filter(user_permissions=perm_old)
                for u in users:
                    u.user_permissions.add(perm_new)
                    self.stdout.write(self.style.NOTICE(f"Added permission '{new_codename}' to user '{u.username}'"))
                    if remove_old:
                        u.user_permissions.remove(perm_old)

                uops = UserObjectPermission.objects.filter(permission=perm_old)
                for uop in uops:
                    try:
                        UserObjectPermission.objects.get_or_create(
                            user=uop.user,
                            permission=perm_new,
                            content_type=uop.content_type,
                            object_pk=uop.object_pk,
                        )
                        self.stdout.write(self.style.NOTICE(f"Copied user object-perm for user {uop.user} on object {uop.object_pk} ({perm_old.codename} -> {perm_new.codename})"))
                    except Exception as e:
                        self.stdout.write(self.style.ERROR(f"Failed copying user object-perm: {e}"))
                    if remove_old:
                        try:
                            uop.delete()
                        except Exception:
                            pass

                gops = GroupObjectPermission.objects.filter(permission=perm_old)
                for gop in gops:
                    try:
                        GroupObjectPermission.objects.get_or_create(
                            group=gop.group,
                            permission=perm_new,
                            content_type=gop.content_type,
                            object_pk=gop.object_pk,
                        )
                        self.stdout.write(self.style.NOTICE(f"Copied group object-perm for group {gop.group} on object {gop.object_pk} ({perm_old.codename} -> {perm_new.codename})"))
                    except Exception as e:
                        self.stdout.write(self.style.ERROR(f"Failed copying group object-perm: {e}"))
                    if remove_old:
                        try:
                            gop.delete()
                        except Exception:
                            pass

                if remove_old:
                    try:
                        perm_old.delete()
                        self.stdout.write(self.style.SUCCESS(f"Removed old permission '{old_codename}'"))
                    except Exception as e:
                        self.stdout.write(self.style.ERROR(f"Failed to remove old permission '{old_codename}': {e}"))

        self.stdout.write(self.style.MIGRATE_LABEL('Permission migration completed.'))
