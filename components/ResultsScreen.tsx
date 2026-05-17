import type { Question, UserAnswer } from '../types'

interface ResultsScreenProps {
  questions: Question[]
  answers: UserAnswer[]
  onRestart: () => void
}

function getScoreEmoji(score: number, total: number): string {
  const pct = score / total
  if (pct >= 0.9) return '🏆'
  if (pct >= 0.7) return '🎉'
  if (pct >= 0.5) return '👍'
  return '💪'
}

function getScoreMessage(score: number, total: number): string {
  const pct = score / total
  if (pct >= 0.9) return 'Excellent ! Tu maîtrises ce cours !'
  if (pct >= 0.7) return 'Très bien ! Continue comme ça !'
  if (pct >= 0.5) return 'Pas mal ! Encore un peu de révision.'
  return 'Courage ! Relis ton cours et réessaie.'
}

export default function ResultsScreen({ questions, answers, onRestart }: ResultsScreenProps) {
  const score = answers.reduce((acc, a) => {
    const q = questions[a.questionIndex]
    return acc + (a.selected === q.answer ? 1 : 0)
  }, 0)

  const total = questions.length
  const pct = Math.round((score / total) * 100)

  return (
    <div className="min-h-dvh px-5 py-8 max-w-lg mx-auto">
      {/* Score card */}
      <div className="mb-8 animate-fade-up">
        <div className="bg-card border border-border rounded-3xl p-8 text-center mb-6">
          <div className="text-6xl mb-4">{getScoreEmoji(score, total)}</div>
          <div className="font-display font-extrabold text-6xl text-cream mb-1">
            {score}<span className="text-muted text-3xl">/{total}</span>
          </div>
          <div className="font-body text-muted text-lg mb-4">{pct}%</div>

          {/* Barre de score */}
          <div className="w-full h-3 bg-border rounded-full overflow-hidden mb-4">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${pct}%`,
                background: pct >= 70 ? '#ff6b35' : pct >= 50 ? '#f59e0b' : '#ef4444',
              }}
            />
          </div>

          <p className="font-display font-semibold text-cream text-lg">
            {getScoreMessage(score, total)}
          </p>
        </div>

        {/* CTA Recommencer */}
        <button
          onClick={onRestart}
          className="w-full py-4 rounded-2xl bg-accent font-display font-bold text-cream text-lg flex items-center justify-center gap-3 hover:bg-accent-light active:scale-[0.98] transition-all shadow-lg shadow-accent/20 mb-3"
        >
          ↩ Nouveau quiz
        </button>
      </div>

      {/* Correction détaillée */}
      <div className="animate-fade-up" style={{ animationDelay: '100ms' }}>
        <h3 className="font-display font-bold text-xl text-cream mb-4">Correction</h3>

        <div className="flex flex-col gap-4 mb-10">
          {questions.map((q, qi) => {
            const userAnswer = answers.find((a) => a.questionIndex === qi)?.selected ?? ''
            const isCorrect = userAnswer === q.answer

            return (
              <div
                key={qi}
                className={`rounded-2xl border p-5 ${
                  isCorrect ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'
                }`}
              >
                {/* Numéro + résultat */}
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-display font-bold text-sm ${
                    isCorrect ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {isCorrect ? '✓' : '✗'}
                  </span>
                  <span className="text-xs font-body text-muted uppercase tracking-wide">Question {qi + 1}</span>
                </div>

                {/* Question */}
                <p className="font-body text-cream text-sm leading-relaxed mb-3">{q.question}</p>

                {/* Ta réponse */}
                {!isCorrect && (
                  <div className="mb-2">
                    <span className="text-xs font-body text-red-400 uppercase tracking-wide">Ta réponse · </span>
                    <span className="font-body text-red-300 text-sm">{userAnswer}</span>
                  </div>
                )}

                {/* Bonne réponse */}
                <div className="mb-3">
                  <span className="text-xs font-body text-green-400 uppercase tracking-wide">Bonne réponse · </span>
                  <span className="font-body text-green-300 text-sm font-medium">{q.answer}</span>
                </div>

                {/* Explication */}
                <div className="bg-ink/40 rounded-xl p-3">
                  <span className="text-xs font-body text-muted uppercase tracking-wide block mb-1">Explication</span>
                  <p className="font-body text-cream/80 text-sm leading-relaxed">{q.explanation}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
