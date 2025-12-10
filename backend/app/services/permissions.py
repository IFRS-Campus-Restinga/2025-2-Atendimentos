from rest_framework import permissions

class CustomPermissions(permissions.DjangoModelPermissions):
    perms_map = {
        'GET': ['%(app_label)s.view_%(model_name)s'],
        'OPTIONS': [],
        'HEAD': [],
        'POST': ['%(app_label)s.add_%(model_name)s'],
        'PUT': ['%(app_label)s.change_%(model_name)s'],
        'PATCH': ['%(app_label)s.change_%(model_name)s'],
        ##'DELETE': ['%(app_label)s.delete_%(model_name)s'],
    }


class PodeAprovarEvento(permissions.BasePermission):
    """Verifica se usuário tem permissão de aprovar evento"""
    def has_permission(self, request, view):
        return request.user.has_perm('accounts.pode_aprovar_evento')


class PodeCancelarEvento(permissions.BasePermission):
    """Verifica se usuário tem permissão de cancelar evento"""
    def has_permission(self, request, view):
        return request.user.has_perm('accounts.pode_cancelar_evento')


class PodeRegendarEvento(permissions.BasePermission):
    """Verifica se usuário tem permissão de reagendar evento"""
    def has_permission(self, request, view):
        return request.user.has_perm('accounts.pode_reagendar_evento')


# Mantendo compatibilidade com nome antigo (deprecated)
class ProfessorPodeAprovar(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True # Permite a leitura para qualquer um
        return request.user.has_perm('accounts.pode_aprovar_evento')

class PodeAprovarEventoObjectPermission(permissions.BasePermission):
    """Permissão por objeto para aprovar um evento (accounts.pode_aprovar_evento on obj)"""
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.has_perm('accounts.pode_aprovar_evento', obj)
    
class PodeCancelarEventoObjectPermission(permissions.BasePermission):
    """Permissão por objeto para cancelar um evento (accounts.pode_cancelar_evento on obj)"""
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.has_perm('accounts.pode_cancelar_evento', obj)

class PodeRegendarEventoObjectPermission(permissions.BasePermission):
    """Permissão por objeto para reagendar um evento (accounts.pode_reagendar_evento on obj)"""
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.has_perm('accounts.pode_reagendar_evento', obj)