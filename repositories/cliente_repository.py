from sqlalchemy.orm import Session
from models import Cliente

"""
Tabela → classe (Model)

Linha → objeto

SELECT → query()

WHERE → filter()

INSERT → add() + commit()

UPDATE → alterar objeto + commit()

DELETE → delete() + commit()
"""

def cadastrar_cliente(db: Session, cliente: Cliente):
    
    db.add(cliente)
    db.commit()
    db.refresh(cliente)
    return cliente

def consultar_todos_cliente(db: Session):
    
    clientes = db.query(Cliente).all()
    return clientes

def consultar_cliente_porId(db: Session, id):
    
    cliente = db.query(Cliente).filter(Cliente.id_cliente == id)
    return cliente

    
