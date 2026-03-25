import { useState, useMemo, useEffect } from "react"
import { Modal } from '../Modal';

type Props = {
  formData: any
  setFormData: any
  onNext: () => void
}




export function CustomerStep({ formData, setFormData, onNext }: Props) {

  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' as 'info' | 'error' | 'success' | 'warning' });

  function handleNext() {
    if (!formData.customer_name) {
      setModal({ isOpen: true, title: 'Atenção', message: 'Digite o nome do cliente!', type: 'error' });
      return
    }

    if (!formData.phone_number) {
      setModal({ isOpen: true, title: 'Atenção', message: 'Digite o telefone!', type: 'error' });
      return
    }

      onNext()
  }

  function formatPhone(value: string){
    const numbers = value.replace(/\D/g, "")

    if (numbers.length <= 2) {
      return numbers
    }

    if(numbers.length <= 7){
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    }

    return `(${numbers.slice(0,2)}) ${numbers.slice(2, 7)}-${numbers.slice(7,11)}`

  }

  const [phoneDisplay, setPhoneDisplay] = useState("")

  const isStepValid = useMemo(() => {
    return (
      formData.customer_name?.trim() !== "" &&
      formData.phone_number?.length === 11
    )
  }, [formData.customer_name, formData.phone_number])

  useEffect(() => {
  if (formData.phone_number) {
    setPhoneDisplay(formatPhone(formData.phone_number))
  }
  }, [formData.phone_number])

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
        value={phoneDisplay}
        onChange={(e) => {
          const raw = e.target.value.replace(/\D/g, "").slice(0, 11)

          setPhoneDisplay(formatPhone(raw))

          setFormData({...formData, phone_number: raw})
        }}
      />

      <button type="button" onClick={handleNext} disabled={!isStepValid}>
        Próximo
      </button>

      <Modal isOpen={modal.isOpen} onClose={() => setModal({ ...modal, isOpen: false })} title={modal.title} message={modal.message} type={modal.type} />
    </div>
  )
}