from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from accounts.models.disciplina import Disciplina

class Command(BaseCommand):
    help = 'Teste do endpoint usuario/me para disciplinas (cria disciplina se necessário)'

    def handle(self, *args, **options):
        User = get_user_model()
        email = '2020007970@restinga.ifrs.edu.br'
        u = User.objects.filter(email=email).first()
        self.stdout.write(f'USER: {getattr(u, "email", None)}')

        client = APIClient()
        client.force_authenticate(user=u)

        r = client.get('/services/api/usuario/me', HTTP_HOST='localhost')
        self.stdout.write(f'GET status {r.status_code}')
        try:
            self.stdout.write(f'GET json {r.json()}')
        except Exception as e:
            self.stdout.write(f'GET body not json {e}')

        qs = Disciplina.objects.all()
        self.stdout.write(f'Disciplinas count: {qs.count()}')
        if qs.exists():
            ds = list(qs.values('id', 'codigo', 'nome'))
        else:
            d = Disciplina.objects.create(nome='Teste Auto', codigo='TSTAUTO')
            ds = [{'id': d.id, 'codigo': d.codigo, 'nome': d.nome}]
            self.stdout.write(f'Created disciplina {ds}')
        self.stdout.write(f'DISCIPLINAS {ds}')

        payload = {
            'nome': (r.json().get('nome') if r.status_code == 200 else 'Teste Nome'),
            'email': (r.json().get('email') if r.status_code == 200 else (u.email if u else '')),
            'tipoPerfil': 'PROF',
            'registro': (r.json().get('registro') if r.status_code == 200 else 'REG123'),
            'disciplinas': [ds[0]['id']]
        }
        self.stdout.write(f'Payload for POST: {payload}')

        pr = client.post('/services/api/usuario/me', payload, format='json', HTTP_HOST='localhost')
        self.stdout.write(f'POST status {pr.status_code}')
        try:
            self.stdout.write(f'POST json {pr.json()}')
        except Exception as e:
            self.stdout.write(f'POST body not json {e}')

        res2 = client.get('/services/api/usuario/me', HTTP_HOST='localhost')
        self.stdout.write(f'VERIFY status {res2.status_code}')
        try:
            self.stdout.write(f'VERIFY json {res2.json()}')
        except Exception as e:
            self.stdout.write(f'VERIFY body not json {e}')
