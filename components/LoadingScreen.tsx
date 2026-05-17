import { useEffect, useState } from 'react'

const STEPS = [
  { emoji: '🔍', text: 'Lecture du cours...' },
  { emoji: '🧠', text: 'Analyse des notions clés...' },
  { emoji: '✏️', text: 'Création des questions...' },
  { emoji: '✅', text: 'Finalisation du quiz...' },
]

export default function LoadingScreen() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => Math.min(s + 1, STEPS.length - 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-5 gap-10">
      {/* Spinner animé */}
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-4 border-border" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-accent animate-spin-slow" />
        <div className="absolute inset-0 flex items-center justify-center text-4xl">
          {STEPS[step].emoji}
        </div>
      </div>

      {/* Texte dynamique */}
      <div className="text-center">
        <p
          key={step}
          className="font-display font-bold text-2xl text-cream animate-fade-up"
        >
          {STEPS[step].text}
        </p>
        <p className="font-body text-muted text-sm mt-2">
          Ça prend environ 15–20 secondes…
        </p>
      </div>

      {/* Barre de progression visuelle */}
      <div className="w-full max-w-xs flex gap-2">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1 rounded-full transition-all duration-700 ${
              i <= step ? 'bg-accent' : 'bg-border'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
