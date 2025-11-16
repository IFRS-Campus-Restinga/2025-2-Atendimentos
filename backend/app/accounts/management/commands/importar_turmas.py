from django.core.management.base import BaseCommand
from accounts.models import Turma

class Command(BaseCommand):
    help = 'Importa lista de turmas para o banco de dados'

    def handle(self, *args, **kwargs):
        turmas = [
            "111", "112", "121", "122", "131",
            "211", "212", "221", "222", "231",
            "311", "321", "331", "411", "421",
            "ADS - 1 N", "ADS - 2 M", "ADS - 2 N", "ADS - 3 N", "ADS - 4 M", "ADS - 5N", "ADS - 6 M",
            "AGRO - 2", "EI - 1", "EI - 2", "EI - 4", "EI - 6",
            "EJA - EMI - AGROECO 1", "EJA - EMI - AGROECO 3", "EJA - EMI - AGROECO 5",
            "EJA - EMI - COMÉRCIO 2", "EJA - EMI - COMÉRCIO 4", "EJA - EMI - COMÉRCIO 6",
            "GDL - 3", "GDL - 5", "GDL - 5 - TCC",
            "LLE - 2", "LLE - 4", "LLE - 6", "LLE - 8", "LLE - 8 - TCC",
            "Manutenção DTI",
            "PG - 1", "PG - 3", "PG - 5", "PG - 6",
            "SUB - TURISMO 1", "SUB - TURISMO 3",
            "SUB e CONC - INFORMÁTICA 3"
        ]

        for nome in turmas:
            nome_limpo = nome.strip()
            turma, created = Turma.objects.get_or_create(nome=nome_limpo)
            if created:
                self.stdout.write(self.style.SUCCESS(f'Turma criada: {turma.nome}'))
            else:
                self.stdout.write(f'Turma já existe: {turma.nome}')