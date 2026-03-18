import Select from "react-select"
import { useEffect, useState } from "react"
import { getBrands } from "../../services/brand_service"
import { customStyles } from "./style"

type Props = {
  formData: any
  setFormData: any
  onNext: () => void
  onBack: () => void
}

type BrandOption = {
  value: number
  label: string
}

type Brand = {
  brand_id: number
  brand_name: string
}

export function CarStep({formData, setFormData, onNext, onBack}: Props) {

  function handleNext() {
    if (!formData.car_model) {
      alert("Digite o modelo do veículo!")
      return
    }

    if (!formData.car_plate) {
      alert("Digite a placa do carro!")
      return
    }

    onNext()
  }


    const [brands, setBrands] = useState<BrandOption[]>([])

    useEffect(() => {
        getBrands().then(data => {
          
          const formatted = data.map((brand: Brand) => ({
            value: brand.brand_id,
            label: brand.brand_name
        }))

        setBrands(formatted)
        })
    }, [])

  return (
    <div>

       <Select
        styles={customStyles}
        options={brands}
        placeholder="Selecione a marca"
        value={brands.find(b => b.value === formData.brand_id) || null}
        onChange={(selected: BrandOption | null) =>
        setFormData({
          ...formData,
          brand_id: selected ? selected.value: null
         })
        }
        />

        <input
        placeholder="Modelo do carro"
        value={formData.car_model}
        onChange={(e) =>
          setFormData({ ...formData, car_model: e.target.value })
        }
        />

        <input
        placeholder="Cor do carro"
        value={formData.car_color}
        onChange={(e) =>
          setFormData({ ...formData, car_color: e.target.value })
        }
        />

        <input
        placeholder="Ano do carro"
        value={formData.car_year}
        onChange={(e) =>
          setFormData({ ...formData, car_year: e.target.value })
        }
        />

        <input
        placeholder="Placa do carro"
        value={formData.car_plate}
        onChange={(e) =>
          setFormData({ ...formData, car_plate: e.target.value })
        }
        /> 

        <button type="button" onClick={handleNext} disabled={!formData.car_plate || !formData.car_model}>
          Próximo
        </button>

        <button type="button" onClick={onBack}>
          Voltar
        </button>
    </div>
  )}