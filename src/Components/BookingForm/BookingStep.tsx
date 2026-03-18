import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useEffect, useState, useMemo } from "react"
import { getUnavailableTimes } from "../../services/booking_service"

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

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<Date | null>(null)

  const [blockedDates, setBlockedDates] = useState({
    Martelinho: [],
    Pintura: []
  })

  useEffect(() => {
  if (!formData.service || formData.reason !== "Reparo") {
    setBlockedDates({
      Martelinho: [],
      Pintura: []
    })
    return
  }

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

  const timeInterval = useMemo(() => {
    if (formData.reason === "Orçamento") return 15
    if (formData.reason === "Reparo") return 30
    if (formData.reason === "Retorno") return 30

    return 30 // fallback padrão
  }, [formData.reason])

  const [blockedTimeRanges, setBlockedTimes] = useState<string[][]>([])

  useEffect(() => {
    if (!formData.booking_dt) return

    async function fetchTimes() {
      try {
        const data = await getUnavailableTimes(formData.booking_dt)

        setBlockedTimes(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchTimes()
  }, [formData.booking_dt])

  const blockedRangesFormatted = useMemo(() => {
    if (!selectedDate) return []

    return blockedTimeRanges.map(([start, end]) => {
      const [sh, sm] = start.split(":").map(Number)
      const [eh, em] = end.split(":").map(Number)

      const startDate = new Date(selectedDate)
      startDate.setHours(sh, sm, 0)

      const endDate = new Date(selectedDate)
      endDate.setHours(eh, em, 0)

      return { start: startDate, end: endDate }
    })
  }, [blockedTimeRanges, selectedDate])

  const filterTime = (time: Date) => {
    const timeMinutes = time.getHours() * 60 + time.getMinutes()

    for (const range of blockedRangesFormatted) {
      const startMinutes = range.start.getHours() * 60 + range.start.getMinutes()

      const endMinutes = range.end.getHours() * 60 + range.end.getMinutes()

      if (timeMinutes >= startMinutes && timeMinutes <= endMinutes) {
        return false 
      }
    }
    return true
  }

  useEffect(() => {
    setSelectedDate(null)

    setFormData({
      ...formData,
      booking_dt: ""
    })
  }, [formData.reason])

  const generateAvailableTimes = () => {
    const times: Date[] = []

    const start = new Date()
    start.setHours(8, 30, 0)

    const end = new Date()
    end.setHours(17, 0, 0)

    while (start <= end) {
      times.push(new Date(start))
      start.setMinutes(start.getMinutes() + timeInterval)
    }

    return times
  }

  const availableTimes = useMemo(() => {
    return generateAvailableTimes()
  }, [timeInterval])

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
            selected={selectedDate}
            onChange={(date: Date | null) => {
              setSelectedDate(date)

              setFormData({
                ...formData,
                booking_dt: date?.toISOString().split("T")[0] || ""
              })
            }}
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecione a data"
            minDate={new Date()}
            filterDate={(date: Date) => date.getDay() !== 0 && date.getDay() !== 6}
            excludeDates={formData.service === "Martelinho de ouro" && formData.reason === "Reparo" ? martelinhoBlocked : [] }
            excludeDateIntervals={formData.service === "Pintura e(ou) Funilaria" && formData.reason === "Reparo" ? pinturaIntervals : []}
          />

         <DatePicker
            selected={selectedTime}
            onChange={(time: Date | null) => {
              setSelectedTime(time)

              setFormData({
                ...formData,
                booking_hr: time
                  ? time.toTimeString().slice(0, 5)
                  : ""
              })
            }}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={timeInterval}
            timeCaption="Horário"
            dateFormat="HH:mm"
            filterTime={filterTime}
            includeTimes={availableTimes}
          />
        </div>

        <button type="button" onClick={onBack}>
        Voltar
        </button>

        <button type="button" onClick={handleSubmit} 
        disabled={!formData.booking_dt || !formData.booking_hr || !formData.service || !formData.reason}>
          Finalizar Agendamento
        </button>
        

    </div>
  )}