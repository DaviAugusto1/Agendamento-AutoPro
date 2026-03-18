import { api } from "../api/api"
import type { Brand } from "../types/brand"

export async function getBrands(): Promise<Brand[]> {
  const response = await api.get("/car_details/get_brands")
  return response.data
}

