from django.contrib.auth.models import Permission, Group, User
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status


def _is_admin(user):
    # Definição ampliada: considera administrador quem for superuser,
    # ou tiver permissão de alterar grupos, ou pertencer ao grupo 'ADM'/'Administrador'.
    if not (user and user.is_authenticated):
        return False
    if user.is_superuser:
        return True
    if user.has_perm('auth.change_group'):
        return True
    # aceitar variações de nome do grupo comum
    group_names = ['adm', 'administrador', 'administradores', 'administrator', 'admin']
    user_groups = user.groups.values_list('name', flat=True)
    for g in user_groups:
        if g and g.strip().lower() in group_names:
            return True
    return False


class AdminPermissionsList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not _is_admin(request.user):
            return Response({'detail': 'Acesso negado'}, status=status.HTTP_403_FORBIDDEN)

        perms = Permission.objects.all().values('id', 'codename', 'name', 'content_type__app_label')
        return Response(list(perms))


class AdminGroupsList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not _is_admin(request.user):
            return Response({'detail': 'Acesso negado'}, status=status.HTTP_403_FORBIDDEN)

        groups = []
        for g in Group.objects.all():
            perms = list(g.permissions.all().values('id', 'codename', 'name', 'content_type__app_label'))
            groups.append({'id': g.id, 'name': g.name, 'permissions': perms})
        return Response(groups)


class AdminUsersList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not _is_admin(request.user):
            return Response({'detail': 'Acesso negado'}, status=status.HTTP_403_FORBIDDEN)

        users = []
        for u in User.objects.all():
            groups = list(u.groups.all().values('id', 'name'))
            perms = list(u.user_permissions.all().values('id', 'codename', 'name'))
            users.append({'id': u.id, 'username': u.username, 'email': u.email, 'groups': groups, 'permissions': perms})
        return Response(users)


class GroupPermsAssign(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, group_id):
        if not _is_admin(request.user):
            return Response({'detail': 'Acesso negado'}, status=status.HTTP_403_FORBIDDEN)

        perm_codename = request.data.get('perm_codename')
        if not perm_codename:
            return Response({'detail': 'perm_codename required'}, status=status.HTTP_400_BAD_REQUEST)

        group = get_object_or_404(Group, id=group_id)
        perm = Permission.objects.filter(codename=perm_codename).first()
        if not perm:
            return Response({'detail': 'perm not found'}, status=status.HTTP_404_NOT_FOUND)

        group.permissions.add(perm)
        return Response({'status': 'ok'})

    def delete(self, request, group_id, perm_codename=None):
        if not _is_admin(request.user):
            return Response({'detail': 'Acesso negado'}, status=status.HTTP_403_FORBIDDEN)

        group = get_object_or_404(Group, id=group_id)
        perm = Permission.objects.filter(codename=perm_codename).first()
        if not perm:
            return Response({'detail': 'perm not found'}, status=status.HTTP_404_NOT_FOUND)

        group.permissions.remove(perm)
        return Response({'status': 'ok'})


class UserGroupsAssign(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        if not _is_admin(request.user):
            return Response({'detail': 'Acesso negado'}, status=status.HTTP_403_FORBIDDEN)

        group_id = request.data.get('group_id')
        if not group_id:
            return Response({'detail': 'group_id required'}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(User, id=user_id)
        group = get_object_or_404(Group, id=group_id)
        user.groups.add(group)
        return Response({'status': 'ok'})

    def delete(self, request, user_id, group_id=None):
        if not _is_admin(request.user):
            return Response({'detail': 'Acesso negado'}, status=status.HTTP_403_FORBIDDEN)

        user = get_object_or_404(User, id=user_id)
        group = get_object_or_404(Group, id=group_id)
        user.groups.remove(group)
        return Response({'status': 'ok'})
