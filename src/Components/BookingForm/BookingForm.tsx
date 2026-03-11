import { useState } from "react"
import { CustomerStep } from "./CustomerStep"
import { CarStep } from "./CarStep"
import { BookingStep } from "./BookingStep"
import { StepProgressBar } from "./StepProgressBar"
export function BookingForm() {

  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState({
    //ClientStep
    customer_name: "",
    phone_number: "",

    //CarStep
    brand_name: "",
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

  function next() {
    setStep(step + 1)
  }

  function back() {
    setStep(step - 1)
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