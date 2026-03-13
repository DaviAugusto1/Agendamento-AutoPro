type Props = {
  formData: any
  setFormData: any
  onNext: () => void
}



export function CustomerStep({ formData, setFormData, onNext }: Props) {7

  function handleNext() {
    if (!formData.customer_name) {
      alert("Digite o nome do cliente!")
      return
    }

    if (!formData.phone_number) {
      alert("Digite o telefone!")
      return
    }

      onNext()
  }

  return (
    <div>

      <input
        placeholder="Nome do cliente"
        value={formData.customer_name}
        onChange={(e) =>
          setFormData({ ...formData, customer_name: e.target.value })
        }
      />

      <input
        placeholder="Telefone"
        value={formData.phone_number}
        onChange={(e) =>
          setFormData({ ...formData, phone_number: e.target.value })
        }
      />

      <button type="button" onClick={handleNext} disabled={!formData.customer_name || !formData.phone_number}>
        Próximo
      </button>

    </div>
  )
}