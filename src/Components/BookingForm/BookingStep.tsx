import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useEffect, useState, useMemo } from "react"

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

  const [blockedDates, setBlockedDates] = useState({
    Martelinho: [],
    Pintura: []
  })

  useEffect(() => {
  if (!formData.service) return

  async function fetchBlockedDates() {
    try {
      const response = await fetch(
        `http://localhost:8000/bookings/invalid_repair_days?service=${formData.service}`
      ) 

      const data = await response.json()

      setBlockedDates(data)
    } catch (error) {
      console.error("Erro ao buscar datas bloqueadas:", error)
    }
  }

  fetchBlockedDates()
}, [formData.service])

  const martelinhoBlocked = useMemo(() => {
    return blockedDates.Martelinho.map(
      (date: string) => new Date(date + "T00:00:00")
    )
  }, [blockedDates])

  const pinturaIntervals = useMemo(() => {
    return blockedDates.Pintura.map((range: string[]) => {
      const monday = new Date(range[0])
      const friday = new Date(range[1])

      return { start: monday, end: friday}
    })
  }, [blockedDates])
  
  useEffect(() => {
    setDate(null)

    setFormData({
      ...formData,
      booking_dt: ""
    })
  }, [formData.service])

  const timeInterval = useMemo(() => {
    if (formData.reason === "Orçamento") return 15
    if (formData.reason === "Reparo") return 30
    if (formData.reason === "Retorno") return 30

    return 30 // fallback padrão
  }, [formData.reason])

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
            onClick={() => setFormData({ ...formData, service: "Martelinho de ouro" })}
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
            excludeDates={formData.service === "Martelinho de ouro" ? martelinhoBlocked : []}
            excludeDateIntervals={formData.service === "Pintura e(ou) Funilaria" ? pinturaIntervals : []}
          />

          <DatePicker
            selected={date}
            onChange={(selectedDate: Date | null) => setDate(selectedDate)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={timeInterval}
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