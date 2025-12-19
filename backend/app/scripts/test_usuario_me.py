from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from accounts.models.disciplina import Disciplina

User = get_user_model()
email = '2020007970@restinga.ifrs.edu.br'
u = User.objects.filter(email=email).first()
print('USER:', getattr(u, 'email', None))

client = APIClient()
client.force_authenticate(user=u)

r = client.get('/services/api/usuario/me', HTTP_HOST='localhost')
print('GET status', r.status_code)
try:
    print('GET json', r.json())
except Exception as e:
    print('GET body not json', str(e), r.content[:200])

# List disciplinas
qs = Disciplina.objects.all()
print('Disciplinas count:', qs.count())
if qs.exists():
    ds = list(qs.values('id', 'codigo', 'nome'))
else:
    d = Disciplina.objects.create(nome='Teste Auto', codigo='TSTAUTO')
    ds = [{'id': d.id, 'codigo': d.codigo, 'nome': d.nome}]
    print('Created disciplina', ds)
print('DISCIPLINAS', ds)

# Prepare payload to set first disciplina to professor
payload = {
    'nome': (r.json().get('nome') if r.status_code == 200 else 'Teste Nome'),
    'email': (r.json().get('email') if r.status_code == 200 else (u.email if u else '')),
    'tipoPerfil': 'PROF',
    'registro': (r.json().get('registro') if r.status_code == 200 else 'REG123'),
    'disciplinas': [ds[0]['id']]
}
print('Payload for POST:', payload)

pr = client.post('/services/api/usuario/me', payload, format='json', HTTP_HOST='localhost')
print('POST status', pr.status_code)
try:
    print('POST json', pr.json())
except Exception as e:
    print('POST body not json', str(e), pr.content[:200])

res2 = client.get('/services/api/usuario/me', HTTP_HOST='localhost')
print('VERIFY status', res2.status_code)
try:
    print('VERIFY json', res2.json())
except Exception as e:
    print('VERIFY body not json', str(e), res2.content[:200])
