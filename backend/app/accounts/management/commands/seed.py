from django.core.management.base import BaseCommand
from accounts.models import Coordenador, Curso, Turma, Disciplina
from accounts.enumerations.tipo_curso import TipoCurso
from accounts.enumerations.turnos import Turno

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
            coordenador, _ = Coordenador.objects.get_or_create(
                nome=f"Coordenador {nome}",
                email=coordenador_email,
                registro=f"REG{codigo}",
                tipoPerfil="Coordenador"
            )
            self.stdout.write(self.style.SUCCESS(f'Coordenador: {coordenador.nome} - {coordenador.email}'))

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
                    descricao=f"Descrição da disciplina {nome_disciplina}",
                )
                disciplina.cursos.add(curso)  
                self.stdout.write(self.style.SUCCESS(f'Disciplina: {disciplina.nome}'))

        self.stdout.write(self.style.SUCCESS('Banco populado com sucesso!'))