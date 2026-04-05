import { useState, useMemo} from "react"
import { Modal } from '../Modal';

type Props = {
  formData: any
  setFormData: any
  onNext: () => void
}


function formatPhone(value: string) {
    const numbers = value.replaceAll(/\D/g, "")
    
    const normalized = numbers.startsWith("9") ? numbers : "9" + numbers
    
    if (normalized.length <= 2) {
      return normalized
    }
    
    if (normalized.length <= 10) {
      return `(${normalized.slice(0, 2)}) ${normalized.slice(2)}`
    }
    
    return `(${normalized.slice(0, 2)}) ${normalized.slice(2, 3)}-${normalized.slice(3, 7)}-${normalized.slice(7, 11)}`
}

export function CustomerStep({ formData, setFormData, onNext }: Readonly<Props>) {

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

  

  const [phoneDisplay, setPhoneDisplay] = useState("9")

  const isStepValid = useMemo(() => {
    return (
      formData.customer_name?.trim() !== "" &&
      formData.phone_number?.length === 10
    )
  }, [formData.customer_name, formData.phone_number])

  // useEffect(() => {
  //   if (formData.phone_number && formData.phone_number !== "9") {
  //     setPhoneDisplay(formatPhone(formData.phone_number))
  //   } else if (formData.phone_number === "9") {
  //     setPhoneDisplay("9")
  //   }
  // }, [formData.phone_number])

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
          const raw = e.target.value.replaceAll(/\D/g, "")
          
          const withoutPrefix9 = raw.startsWith("9") ? raw.slice(1) : raw
          const normalized = "9" + withoutPrefix9
          const limited = normalized.slice(0, 10)
          
          setPhoneDisplay(formatPhone(limited))
          setFormData({...formData, phone_number: limited})
        }}
      />

      <button type="button" onClick={handleNext} disabled={!isStepValid}>
        Próximo
      </button>

      <Modal isOpen={modal.isOpen} onClose={() => setModal({ ...modal, isOpen: false })} title={modal.title} message={modal.message} type={modal.type} />
    </div>
  )
}