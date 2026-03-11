import Select from "react-select"
import { useEffect, useState } from "react"
import { getBrands } from "../../services/brand_service"

type Props = {
  formData: any
  setFormData: any
  onNext: () => void
  onBack: () => void
}

export function CarStep({formData, setFormData, onNext, onBack}: Props) {
    type BrandOption = {
    value: number
    label: string
    }

    const [brands, setBrands] = useState<BrandOption[]>([])

    useEffect(() => {
        getBrands().then(data => {
        const formatted = data.map(brand => ({
            value: brand.id,
            label: brand.name
        }))

        setBrands(formatted)
        })
    }, [])

  return (
    <div>
       <Select
        options={brands}
        placeholder="Selecione a marca"
        value={brands.find(b => b.value === formData.brand_id)}
        onChange={(selected) =>
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

      <button onClick={onNext}>
        Próximo
      </button>

      <button onClick={onBack}>
        Voltar
      </button>


    </div>
  )}