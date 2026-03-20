import { api } from "../api/api"
import type { car_details } from "../types/car_details"

export async function getDetailsByPlate(plate: string): Promise<car_details | null> {
  try {
    const response = await api.get(`/car_details/get_by_plate/${plate}`)
    return response.data
  } catch(error: any) {
    if (error.response){
      console.error("Erro do Backend: ", error.response.data)
    } else {
      console.error("Erro geral: ", error.message)
    }
    throw new error("Falha ao Buscar Veículo")
  }
}


