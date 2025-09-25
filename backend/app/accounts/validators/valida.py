from django.core.validators import ValidationError
from django.utils.deconstruct import deconstructible
from django.utils.translation import gettext_lazy as _

@deconstructible
#class Validator:
#    def __init__(self, cod="0000000000"):
#        self.code = cod
#        
#    def __call__(self, valor):
#        if valor == self.code:
#            raise ValidationError(
#                _("Valor inválido"),
#                params={"valor": valor},
#                code='invalid'
#            )
#
#    def __eq__(self, other):
#        return(
#            isinstance(other, Validator)
#            and self.code == other.code
#        )

def validate_semestre(self, valor):
    if valor < 1 or valor > 10:
        raise ValidationError("O semestre deve estar entre 1 e 10.")
    return valor
def validate_carga_horaria(self, valor):
    if valor <= 0:
        raise ValidationError("A carga horária deve ser maior que zero.")
    return valor