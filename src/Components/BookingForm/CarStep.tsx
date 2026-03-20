import Select from "react-select"
import { useEffect, useState } from "react"
import { getBrands } from "../../services/brand_service"
import { customStyles } from "./style"
import { getDetailsByPlate } from "../../services/car_details_service"

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

  const [autoFilled, setAutoFilled] = useState(false)

  useEffect(() => {
    if (formData.car_plate?.length !== 7) return

    async function fetchVehicle() {
        const response = await getDetailsByPlate(formData.car_plate)

        if (response){setFormData((prev: any) => ({
          ...prev,
          car_model: response.car_model,
          car_color: response.car_color,
          car_year: response.car_year,
          brand_id: response.brand_id
        }))
        setAutoFilled(true)
      } else {
        setAutoFilled(false)
      }
    } 
    fetchVehicle()
}, [formData.car_plate])

  useEffect(() => {
    if (formData.car_plate.length !== 7) return

    const timeout = setTimeout(() => {
      getDetailsByPlate(formData.car_plate)
    }, 500) // 500ms debounce

    return () => clearTimeout(timeout)
  }, [formData.car_plate])

  return (
    <div>
        <input
        placeholder="Placa do carro"
        maxLength={7}
        value={formData.car_plate}
        onChange={(e) => {
          const value = e.target.value
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, "")
          .slice(0, 7)
          setFormData({ ...formData, car_plate: value })

          if (value.length === 0 && autoFilled){
            setFormData({
              ...formData, 
              car_plate: "",
              car_color: "",
              car_year: "",
              brand_id: null,
              car_model: ""})

            setAutoFilled(false)
          }
        }}
        />

       <Select
        styles={customStyles}
        options={brands}
        placeholder="Selecione a marca"
        value={brands.find(b => b.value === formData.brand_id) || null}
        isDisabled={autoFilled}
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
        disabled={autoFilled}
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



        <button type="button" onClick={handleNext} disabled={!formData.car_plate || !formData.car_model}>
          Próximo
        </button>

        <button type="button" onClick={onBack}>
          Voltar
        </button>
    </div>
  )}