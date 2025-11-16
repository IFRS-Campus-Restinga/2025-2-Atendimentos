from django.core.management.base import BaseCommand
from accounts.models import Curso, Turma, Disciplina
from accounts.enumerations.tipo_curso import TipoCurso
from accounts.enumerations.turnos import Turno
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Popula o banco de dados com dados fictícios'

    def handle(self, *args, **kwargs):
        cursos = [
            # Superiores
            ("Licenciatura em Letras Português e Espanhol", "LLPE", TipoCurso.SUPERIOR),
            ("Tecnologia em Agroecologia", "TAE", TipoCurso.SUPERIOR),
            ("Tecnologia em Análise e Desenvolvimento de Sistemas", "ADS", TipoCurso.SUPERIOR),
            ("Tecnologia em Eletrônica Industrial", "TEI", TipoCurso.SUPERIOR),
            ("Tecnologia em Gestão Desportiva e de Lazer", "TGDL", TipoCurso.SUPERIOR),
            ("Tecnologia em Processos Gerenciais", "TPG", TipoCurso.SUPERIOR),
            # Técnicos Integrados
            ("Eletrônica", "ELE", TipoCurso.TECNICO_INTEGRADO),
            ("Informática", "INF", TipoCurso.TECNICO_INTEGRADO),
            ("Lazer", "LAZ", TipoCurso.TECNICO_INTEGRADO),
            # Técnicos Subsequentes
            ("Guia de Turismo", "GT", TipoCurso.TECNICO_SUBSEQUENTE),
            # Proeja
            ("Agroecologia", "AGRO", TipoCurso.PROEJA),
            ("Comércio", "COM", TipoCurso.PROEJA),
        ]

        disciplinas_base = [
            ("Algoritmos e Lógica de Programação", "ALGO"),
            ("Estrutura de Dados", "ESTR"),
            ("Matemática Discreta", "MATH"),
        ]

        for nome_curso, codigo, tipo in cursos:
            curso, _ = Curso.objects.get_or_create(
                nome=nome_curso,
                codigo=codigo,
                tipo_curso=tipo
            )
            self.stdout.write(self.style.SUCCESS(f'Curso criado: {curso.nome}'))

            # Turmas
            if tipo in [TipoCurso.SUPERIOR, TipoCurso.PROEJA]:
                for semestre in [1, 2]:
                    for turno in [Turno.MANHA, Turno.TARDE, Turno.NOITE]:
                        nome_turma = f"{codigo}{semestre}{turno[0]}"
                        turma, _ = Turma.objects.get_or_create(
                            nome=nome_turma,
                            curso=curso,
                            semestre=semestre,
                            turno=turno[0]
                        )
                        self.stdout.write(self.style.SUCCESS(f'Turma criada: {turma.nome}'))
            else:
                for ano in [1, 2]:
                    for turno in [Turno.MANHA, Turno.TARDE, Turno.NOITE]:
                        nome_turma = f"{codigo}{ano}{turno[0]}"
                        turma, _ = Turma.objects.get_or_create(
                            nome=nome_turma,
                            curso=curso,
                            ano=ano,
                            turno=turno[0]
                        )
                        self.stdout.write(self.style.SUCCESS(f'Turma criada: {turma.nome}'))

            # Disciplinas
            for nome_disciplina, prefixo in disciplinas_base:
                codigo_disciplina = f"{prefixo}{codigo[:3]}1"
                disciplina, _ = Disciplina.objects.get_or_create(
                    nome=nome_disciplina,
                    codigo=codigo_disciplina
                )
                self.stdout.write(self.style.SUCCESS(f'Disciplina criada: {disciplina.nome}'))

        # Superusuário
        print("\n🔄 Verificando existência do superusuário 'admin'...")
        if not User.objects.filter(username="admin").exists():
            User.objects.create_superuser(
                username="admin",
                email="admin@example.com",
                password="admin"
            )
            print("✅ Superusuário 'admin' criado com sucesso! (login: admin / senha: admin)")
        else:
            print("⚠️ Superusuário 'admin' já existe.")

        print("\n✅ Seed executado com sucesso!")