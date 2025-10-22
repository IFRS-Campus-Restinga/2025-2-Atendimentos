from django.dispatch import receiver
# SINAL do allauth para NOVO usuário (login social cria um novo user)
from allauth.account.signals import user_signed_up 
from django.contrib.auth.models import Group
from .models.usuario import Usuario 
from .enumerations.tipo_usuario import TipoUsuario
from django.db.models.signals import post_migrate 
from django.db.models import ObjectDoesNotExist


# Garante que os grupos serão criados apos cada migração
@receiver(post_migrate)
def create_default_groups(sender, **kwargs):
    
    if sender.name != 'accounts':
        return

    group_names = ['Alunos', 'Professores', 'Coordenadores', 'Administradores']
    
    for name in group_names:
        Group.objects.get_or_create(name=name)
        
    print(f"✅ Grupos padrão verificados/criados: {', '.join(group_names)}")



 # Cria o perfil base 'Usuario' e atribui o grupo 'Alunos' após o 1º login social.
@receiver(user_signed_up)
def initial_profile_setup(sender, request, user, sociallogin=None, **kwargs):

    if sociallogin:
        try:
            aluno_group = Group.objects.get(name='Alunos')
            user.groups.add(aluno_group)
        except ObjectDoesNotExist:
            print("🚨 ATENÇÃO: O grupo 'Alunos' não existe. Crie-o no Admin.")

        Usuario.objects.create(
            user=user,
            nome=user.get_full_name() or user.username or user.email.split('@')[0],
            email=user.email,
            tipoPerfil=TipoUsuario.ALUNO,
            needs_complemento=True 
        )
        print(f"Novo Perfil Usuario para {user.email} criado. Aguardando complemento.")