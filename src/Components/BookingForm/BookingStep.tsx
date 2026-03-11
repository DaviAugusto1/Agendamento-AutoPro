type Props = {
  formData: any
  setFormData: any
  onBack: () => void
}

export function BookingStep({formData, setFormData, onBack}: Props) {
/*
  booking_dt: string;
  booking_hr: string;
*/
  return (
    <div>

        <input
         placeholder="Motivo do agendamento"
         value={formData.reason}
         onChange={(e) =>
           setFormData({ ...formData, reason: e.target.value })
         }
        />

        <strong>Selecione o serviço desejado</strong>
        <button
            type="button"
            onClick={() => setFormData({ ...formData, service: "Martelinho de Ouro" })}
        >
            Martelinho de Ouro
        </button>

        <button
            type="button"
            onClick={() => setFormData({ ...formData, service: "Pintura e/ou Funilaria" })}
        >
            Pintura e/ou Funilaria
        </button>

        <input
         placeholder="Data do agendamento"
         value={formData.booking_dt}
         onChange={(e) =>
           setFormData({ ...formData, booking_dt: e.target.value })
         }
        />

        <input
         placeholder="Horário do agendamento"
         value={formData.booking_hr}
         onChange={(e) =>
           setFormData({ ...formData, booking_hr: e.target.value })
         }
        />

        <button onClick={onBack}>
        Voltar
      </button>
        

    </div>
  )}