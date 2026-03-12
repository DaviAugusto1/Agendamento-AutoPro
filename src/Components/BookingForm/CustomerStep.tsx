type Props = {
  formData: any
  setFormData: any
  onNext: () => void
}

export function CustomerStep({ formData, setFormData, onNext }: Props) {

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

      <button type="button" onClick={onNext}>
        Próximo
      </button>

    </div>
  )
}