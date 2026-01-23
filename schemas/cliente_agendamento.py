from pydantic import BaseModel


class Cliente_agendamentoCreate(BaseModel):
    id_agendamento: int
    id_cliente : int
    confirmacao: str