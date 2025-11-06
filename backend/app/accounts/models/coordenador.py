from .usuario import Usuario

class Coordenador(Usuario):
    """
    Model que representa um coordenador de curso.
    """
    def ListaRegistros(self):
        # Ainda não temos o model registro
        pass

    def TempoAtividade(self):
        # Ainda não temos
        pass

    def EditaRegistros(self):
        # Ainda não temos o model registro
        pass

    def __str__(self) -> str:
        return f"Coordenador: {super().__str__()}"