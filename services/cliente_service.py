from sqlalchemy.orm import Session
from models import Cliente
from repositories.cliente_repository import cadastrar_cliente, consultar_cliente

def criar(db: Session, nomeService: str, telefoneService: str):

    if len(telefoneService) > 14:
        raise ValueError("Não foi possivel cadastrar, telefone deve ter 14 digitos")
    
    nomeService = nomeService.capitalize()
    
    cliente = Cliente(
        nome = nomeService,
        telefone = telefoneService,
    )
    return cadastrar_cliente(db, cliente)

def consultar(db: Session):
    return consultar_cliente(db)