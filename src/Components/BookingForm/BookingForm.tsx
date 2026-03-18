import { useState } from "react"
import { CustomerStep } from "./CustomerStep"
import { CarStep } from "./CarStep"
import { BookingStep } from "./BookingStep"
import { StepProgressBar } from "./StepProgressBar"
import type { BookingFormData } from "../../types/booking"
export function BookingForm() {

  const [formData, setFormData] = useState<BookingFormData>({
    //ClientStep
    customer_name: "",
    phone_number: "",

    //CarStep
    brand_id: null,
    car_model: "",
    car_color: "",
    car_year: "",
    car_plate: "",

    //BookingStep
    reason: "",
    service: "",
    booking_dt: "",
    booking_hr: ""
  })

  const [step, setStep] = useState(1)

  function next() {
    setStep((prev) => Math.min(prev + 1, 3))
  }

  function back() {
    setStep((prev) => Math.max(prev - 1, 1))
  }
  
  return (
    <div>
      <StepProgressBar step={step} />
      
      {step === 1 &&
        <CustomerStep
          formData={formData}
          setFormData={setFormData}
          onNext={next}
        />
      }

      {step === 2 &&
        <CarStep
          formData={formData}
          setFormData={setFormData}
          onNext={next}
          onBack={back}
        />
      }

      {step === 3 &&
        <BookingStep
          formData={formData}
          setFormData={setFormData}
          onBack={back}
        />
      }

    </div>
  )
}