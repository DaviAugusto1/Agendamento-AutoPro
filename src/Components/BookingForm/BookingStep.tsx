import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useState } from "react"

type Props = {
  formData: any
  setFormData: any
  onBack: () => void
}

export function BookingStep({formData, setFormData, onBack}: Props) {

  function handleSubmit(){

    if (!formData.service) {
      alert("Selecione o Serviço!")
      return
    }

    if (!formData.reason) {
      alert("Selecione o motivo do agendamento!")
      return
    }

    if (!formData.booking_dt) {
      alert("Selecione a data do agendamento!")
      return
    }

    if (!formData.booking_dt) {
      alert("Selecione o horário do agendamento!")
      return
    }

  console.log(formData)
  } 

  const [date, setDate] = useState<Date | null>(null)

  const blockedDates = []

  return(
    <div>

        <strong>Selecione o motivo do agendamento</strong>
        <button
            type="button"
            onClick={() => setFormData({ ...formData, reason: "Orçamento" })}
        >
            Orçamento
        </button>

        <button
            type="button"
            onClick={() => setFormData({ ...formData, reason: "Reparo" })}
        >
            Reparo
        </button>

        <button
            type="button"
            onClick={() => setFormData({ ...formData, reason: "Retorno" })}
        >
            Retorno
        </button>

        <strong>Selecione o serviço desejado</strong>
        <button
            type="button"
            onClick={() => setFormData({ ...formData, service: "Martelinho de Ouro" })}
        >
            Martelinho de Ouro
        </button>

        <button
            type="button"
            onClick={() => setFormData({ ...formData, service: "Pintura e(ou) Funilaria" })}
        >
            Pintura e(ou) Funilaria
        </button>

        <div>
          <DatePicker
            selected={date}
            onChange={(selectedDate: Date | null) => {
              setDate(selectedDate)

              setFormData({
                ...formData,
                booking_dt: selectedDate?.toISOString().split("T")[0] || ""
              })
            }}
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecione a data"
            minDate={new Date()}
            filterDate={(date: Date) => date.getDay() !== 0 && date.getDay() !== 6}
            //excludedDates={blockedDates}
          />

          <DatePicker
            selected={date}
            onChange={(selectedDate: Date | null) => setDate(selectedDate)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={30}
            timeCaption="Horário"
            dateFormat="HH:mm"
          />
        </div>

        <input
         placeholder="Horário do agendamento"
         value={formData.booking_hr}
         onChange={(e) =>
           setFormData({ ...formData, booking_hr: e.target.value })
         }
        />

        <button type="button" onClick={onBack}>
        Voltar
        </button>

        <button type="button" onClick={handleSubmit} 
        disabled={!formData.booking_dt || !formData.booking_hr || !formData.service || !formData.reason}>
          Finalizar Agendamento
        </button>
        

    </div>
  )}