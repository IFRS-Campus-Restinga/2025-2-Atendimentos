from django.core.management.base import BaseCommand
from accounts.models import Coordenador, Curso, Turma, Disciplina, Usuario
from accounts.enumerations.tipo_curso import TipoCurso
from accounts.enumerations.turnos import Turno
from accounts.enumerations.tipo_usuario import TipoUsuario
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Popula o banco de dados com dados fictícios'

    def handle(self, *args, **kwargs):
        # Lista de cursos superiores
        cursos_superiores = [
            ("Licenciatura em Letras Português e Espanhol", "LLPE", TipoCurso.SUPERIOR),
            ("Tecnologia em Agroecologia", "TAE", TipoCurso.SUPERIOR),
            ("Tecnologia em Análise e Desenvolvimento de Sistemas", "ADS", TipoCurso.SUPERIOR),
            ("Tecnologia em Eletrônica Industrial", "TEI", TipoCurso.SUPERIOR),
            ("Tecnologia em Gestão Desportiva e de Lazer", "TGDL", TipoCurso.SUPERIOR),
            ("Tecnologia em Processos Gerenciais", "TPG", TipoCurso.SUPERIOR),
        ]

        # Lista de cursos técnicos integrados ao ensino médio
        cursos_tecnicos_integrados = [
            ("Eletrônica", "ELE", TipoCurso.TECNICO_INTEGRADO),
            ("Informática", "INF", TipoCurso.TECNICO_INTEGRADO),
            ("Lazer", "LAZ", TipoCurso.TECNICO_INTEGRADO),
        ]

        # Lista de cursos técnicos subsequentes
        cursos_tecnicos_subsequentes = [
            ("Guia de Turismo", "GT", TipoCurso.TECNICO_SUBSEQUENTE),
        ]

        # Lista de cursos Proeja
        cursos_proeja = [
            ("Agroecologia", "AGRO", TipoCurso.PROEJA),
            ("Comércio", "COM", TipoCurso.PROEJA),
        ]

        all_courses = cursos_superiores + cursos_tecnicos_integrados + cursos_tecnicos_subsequentes + cursos_proeja

        for nome, codigo, tipo in all_courses:
            # Criando Coordenador
            coordenador_email = f"coord{codigo}@ifrs.edu.br"

            # Tenta encontrar um Coordenador já existente por e-mail (via herança/join)
            coordenador = Coordenador.objects.filter(email=coordenador_email).first()
            if not coordenador:
                # Não existe Coordenador com este e-mail; verificar se já existe um Usuario
                usuario = Usuario.objects.filter(email=coordenador_email).first()
                if usuario:
                    # Promove Usuario existente para Coordenador (cria apenas a linha filha)
                    coordenador = Coordenador(id=usuario.pk)
                    coordenador.save()
                    # Garante que o tipoPerfil do pai esteja correto
                    if usuario.tipoPerfil != TipoUsuario.COORDENADOR:
                        usuario.tipoPerfil = TipoUsuario.COORDENADOR
                        usuario.needs_complemento = False
                        usuario.save(update_fields=["tipoPerfil", "needs_complemento", "updated_at"])
                else:
                    # Cria diretamente o Coordenador, deixando o Django criar o Usuario pai automaticamente
                    coordenador = Coordenador.objects.create(
                        email=coordenador_email,
                        tipoPerfil=TipoUsuario.COORDENADOR,
                        needs_complemento=False,
                    )

            self.stdout.write(self.style.SUCCESS(f'Coordenador: {coordenador}'))

            # Criando Curso
            curso, _ = Curso.objects.get_or_create(
                nome=nome,
                codigo=codigo,
                tipo_curso=tipo,
                coordenador=coordenador
            )
            self.stdout.write(self.style.SUCCESS(f'Curso: {curso.nome}'))

            # Criando Turmas
            if tipo == TipoCurso.SUPERIOR or tipo == TipoCurso.PROEJA:  # Para cursos superiores e Proeja (semestre)
                for semestre in [1, 2]:
                    for turno in [Turno.MANHA, Turno.TARDE, Turno.NOITE]:
                        nome_turma = f"{codigo}{semestre}{turno[0]}"
                        turma, _ = Turma.objects.get_or_create(
                            nome=nome_turma,
                            curso=curso,
                            semestre=semestre,  
                            turno=turno[0],
                        )
                        self.stdout.write(self.style.SUCCESS(f'Turma: {turma.nome}'))
            else:  # Para cursos técnicos (anual)
                for ano in [1, 2]:  
                    for turno in [Turno.MANHA, Turno.TARDE, Turno.NOITE]:
                        nome_turma = f"{codigo}{ano}{turno[0]}"
                        turma, _ = Turma.objects.get_or_create(
                            nome=nome_turma,
                            curso=curso,
                            ano=ano,  
                            turno=turno[0],
                        )
                        self.stdout.write(self.style.SUCCESS(f'Turma: {turma.nome}'))

            # Criando Disciplinas
            disciplinas = [
                ("Algoritmos e Lógica de Programação", f"ALGO{codigo[:3]}1"),
                ("Estrutura de Dados", f"ESTR{codigo[:3]}2"),
                ("Matemática Discreta", f"MATH{codigo[:3]}1",)
            ]
            for nome_disciplina, codigo_disciplina in disciplinas:
                disciplina, _ = Disciplina.objects.get_or_create(
                    nome=nome_disciplina,
                    codigo=codigo_disciplina,
                )
                self.stdout.write(self.style.SUCCESS(f'Disciplina: {disciplina.nome}'))

        self.stdout.write(self.style.SUCCESS('Banco populado com sucesso!'))

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