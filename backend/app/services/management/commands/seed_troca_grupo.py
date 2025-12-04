from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

from accounts.models.usuario import Usuario
from accounts.enumerations.tipo_usuario import TipoUsuario


GRUPO_MAP = {
    'PROF': 'Professores',
    'ALU': 'Alunos',
    'COORD': 'Coordenadores',
    'ADM': 'Administradores',
}


class Command(BaseCommand):
    help = (
        "Ajusta tipoPerfil e associação a Group para um usuário (útil em testes).\n"
        "Exemplo: python manage.py switch_profiles --email user@example.com --tipo PROF\n"
        "Use --batch para aplicar um mapeamento de teste interno."
    )

    def add_arguments(self, parser):
        parser.add_argument('--email', type=str, help='Email do usuário a alterar')
        parser.add_argument('--tipo', type=str, choices=list(GRUPO_MAP.keys()), help='Tipo de perfil (PROF, ALU, COORD, ADM)')
        parser.add_argument('--matricula', type=str, help='Matrícula (para ALU)')
        parser.add_argument('--curso_id', type=int, help='ID do curso (para ALU)')
        parser.add_argument('--batch', action='store_true', help='Executa mapeamento de teste interno')

    def handle(self, *args, **options):
        User = get_user_model()

        if options.get('batch'):
            mappings = [
                {
                    'email': '2020007970@restinga.ifrs.edu.br',
                    'tipo': 'PROF',
                },
                {
                    'email': 'aluno.teste@exemplo.com',
                    'tipo': 'ALU',
                    'matricula': '20251234',
                    'curso_id': 1,
                },
            ]
        else:
            email = options.get('email')
            tipo = options.get('tipo')
            if not email or not tipo:
                self.stdout.write(self.style.ERROR('Quando não usar --batch é obrigatório passar --email e --tipo'))
                return
            mappings = [{
                'email': email,
                'tipo': tipo,
                'matricula': options.get('matricula'),
                'registro': options.get('registro'),
                'curso_id': options.get('curso_id'),
            }]

        for m in mappings:
            email = m.get('email')
            tipo = m.get('tipo')
            matricula = m.get('matricula')
            registro = m.get('registro')
            curso_id = m.get('curso_id')

            try:
                user = User.objects.get(email__iexact=email)
            except User.DoesNotExist:
                self.stdout.write(self.style.WARNING(f'Usuário com email {email} não encontrado — pulando'))
                continue

            if not user.email:
                user.email = email
                user.save(update_fields=['email'])
            try:
                usuario = Usuario.objects.get(user=user)
            except Usuario.DoesNotExist:
                usuario = Usuario(user=user)

            usuario.nome = usuario.nome or (user.get_full_name() or user.username or user.email)
            usuario.email = email
            usuario.tipoPerfil = tipo
            usuario.needs_complemento = False
            if tipo == TipoUsuario.ALUNO or tipo == 'ALU':
                if matricula:
                    usuario.matricula = matricula
                if curso_id:
                    usuario.curso_id = curso_id
            if tipo == TipoUsuario.PROFESSOR or tipo == 'PROF':
                if registro:
                    usuario.registro = registro

            usuario.save()

            grupo_nome = GRUPO_MAP.get(tipo)
            if grupo_nome:
                grupo_obj, _ = Group.objects.get_or_create(name=grupo_nome)
                user.groups.clear()
                user.groups.add(grupo_obj)

            self.stdout.write(self.style.SUCCESS(f'Atualizado {email}: tipoPerfil={tipo}, grupo={grupo_nome}'))
