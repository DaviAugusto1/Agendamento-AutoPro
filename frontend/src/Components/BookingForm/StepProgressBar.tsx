type Props = {
  step: number
}

export function StepProgressBar({ step }: Props) {

  return (
    <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>

      <span style={{ fontWeight: step === 1 ? "bold" : "normal" }}>
        Cliente
      </span>

      <span style={{ fontWeight: step === 2 ? "bold" : "normal" }}>
        Carro
      </span>

      <span style={{ fontWeight: step === 3 ? "bold" : "normal" }}>
        Agendamento
      </span>

    </div>
  )
}