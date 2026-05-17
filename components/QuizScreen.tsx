import { useState } from 'react'
import type { Question, UserAnswer } from '../types'

interface QuizScreenProps {
  questions: Question[]
  onFinish: (answers: UserAnswer[]) => void
}

export default function QuizScreen({ questions, onFinish }: QuizScreenProps) {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [selected, setSelected] = useState<string | null>(null)
  const [animating, setAnimating] = useState(false)

  const q = questions[current]
  const total = questions.length
  const isLast = current === total - 1

  const handleSelect = (opt: string) => {
    if (animating) return
    setSelected(opt)
  }

  const handleNext = () => {
    if (!selected || animating) return

    const newAnswers = { ...answers, [current]: selected }
    setAnswers(newAnswers)

    if (isLast) {
      // Terminer le quiz
      const userAnswers: UserAnswer[] = questions.map((_, i) => ({
        questionIndex: i,
        selected: newAnswers[i] ?? '',
      }))
      onFinish(userAnswers)
      return
    }

    // Animer la transition vers la question suivante
    setAnimating(true)
    setTimeout(() => {
      setCurrent((c) => c + 1)
      setSelected(null)
      setAnimating(false)
    }, 300)
  }

  return (
    <div className="min-h-dvh flex flex-col px-5 py-8 max-w-lg mx-auto">
      {/* Header progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="font-body text-muted text-sm">
            Question <span className="text-cream font-medium">{current + 1}</span> sur {total}
          </p>
          <span className="font-display font-bold text-accent text-sm">
            {Math.round(((current) / total) * 100)}%
          </span>
        </div>
        {/* Barre de progression par segments */}
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                i < current ? 'bg-accent' : i === current ? 'bg-accent/50' : 'bg-border'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Carte question — zone principale */}
      <div className="flex-1 flex flex-col">
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            animating ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'
          }`}
        >
          {/* Badge type */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-1.5 bg-accent/10 border border-accent/20 rounded-full px-3 py-1 text-accent text-xs font-body font-medium tracking-wide uppercase">
              {q.type === 'qcm' ? '🔢 QCM' : '⚖️ Vrai / Faux'}
            </span>
          </div>

          {/* Texte de la question */}
          <div className="bg-card border border-border rounded-2xl p-6 mb-6">
            <p className="font-display font-semibold text-cream text-xl leading-snug">
              {q.question}
            </p>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-3">
            {q.options.map((opt, i) => {
              const isSelected = selected === opt
              const letter = ['A', 'B', 'C', 'D'][i]
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(opt)}
                  className={`w-full text-left px-5 py-4 rounded-2xl border flex items-center gap-4 font-body text-base transition-all active:scale-[0.97] ${
                    isSelected
                      ? 'bg-accent/15 border-accent text-cream'
                      : 'bg-card border-border text-muted hover:border-muted hover:text-cream'
                  }`}
                >
                  <span className={`shrink-0 w-8 h-8 rounded-xl border flex items-center justify-center font-display font-bold text-sm transition-all ${
                    isSelected
                      ? 'border-accent bg-accent text-cream'
                      : 'border-border text-muted'
                  }`}>
                    {letter}
                  </span>
                  <span>{opt}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Bouton suivant / valider */}
        <div className="mt-8">
          <button
            onClick={handleNext}
            disabled={!selected}
            className={`w-full py-4 rounded-2xl font-display font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${
              selected
                ? 'bg-accent text-cream hover:bg-accent-light shadow-lg shadow-accent/20'
                : 'bg-border text-muted cursor-not-allowed'
            }`}
          >
            {isLast ? 'Voir mon score →' : 'Question suivante →'}
          </button>

          {/* Indication discrète si rien sélectionné */}
          {!selected && (
            <p className="text-center text-muted text-sm font-body mt-3">
              Choisis une réponse pour continuer
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
