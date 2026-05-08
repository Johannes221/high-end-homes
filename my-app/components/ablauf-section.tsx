import { Mail, FileText, Home, Zap, Check } from "lucide-react"

export function AblaufSection() {
  const steps = [
    {
      icon: Mail,
      nr: "01",
      title: "Anfrage stellen",
      text: "Per Formular oder direkt per E-Mail – schnell & unkompliziert",
    },
    {
      icon: FileText,
      nr: "02",
      title: "Angebot erhalten",
      text: "Erste Preiseinschätzung innerhalb von 24 Stunden",
    },
    {
      icon: Home,
      nr: "03",
      title: "Besichtigung",
      text: "Vor-Ort-Termin zur finalen Einschätzung & Preisfestlegung",
    },
    {
      icon: Zap,
      nr: "04",
      title: "Start in Tagen",
      text: "Nach Beauftragung geht es in wenigen Tagen los",
    },
    {
      icon: Check,
      nr: "05",
      title: "Fertig & übergeben",
      text: "Sauber, pünktlich & mit Gewährleistung",
    },
  ]

  return (
    <section className="ablauf-section">
      <p className="eyebrow">DER PROZESS</p>
      <h2>So einfach geht's</h2>

      <div className="ablauf-steps">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <div key={step.nr} className="flex items-center">
              <div className="step">
                <div className="step-circle">
                  <Icon className="step-icon" strokeWidth={1.5} />
                </div>
                <div className="step-nr">{step.nr}</div>
                <div className="step-title">{step.title}</div>
                <div className="step-text">{step.text}</div>
              </div>
              {index < steps.length - 1 && <div className="step-line" />}
            </div>
          )
        })}
      </div>

      <div className="ablauf-cta">
        <a href="/angebot" className="btn-primary">
          Jetzt Anfrage stellen →
        </a>
      </div>
    </section>
  )
}
