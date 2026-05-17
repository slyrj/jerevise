import { useState } from 'react'
import Head from 'next/head'
import UploadScreen from '../components/UploadScreen'
import LoadingScreen from '../components/LoadingScreen'
import QuizScreen from '../components/QuizScreen'
import ResultsScreen from '../components/ResultsScreen'
import type { AppStep, Quiz, UserAnswer } from '../types'

export default function Home() {
  const [step, setStep] = useState<AppStep>('upload')
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [answers, setAnswers] = useState<UserAnswer[]>([])
  const [errorMsg, setErrorMsg] = useState('')

  // Étape 1 → 2 : envoi des images à l'API
  const handleImagesReady = async (images: string[]) => {
    setStep('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error ?? 'Erreur inconnue')
      }

      setQuiz(data)
      setStep('quiz')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur serveur'
      setErrorMsg(message)
      setStep('upload')
    }
  }

  // Étape 2 → 3 : l'utilisateur valide ses réponses
  const handleQuizFinish = (userAnswers: UserAnswer[]) => {
    setAnswers(userAnswers)
    setStep('results')
  }

  // Retour à l'accueil
  const handleRestart = () => {
    setStep('upload')
    setQuiz(null)
    setAnswers([])
    setErrorMsg('')
  }

  return (
    <>
      <Head>
        <title>Quiz Cours IA</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>

      {/* Message d'erreur flottant */}
      {errorMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm bg-red-500/90 backdrop-blur-sm text-white font-body text-sm text-center px-4 py-3 rounded-2xl shadow-xl animate-fade-up">
          ⚠️ {errorMsg}
          <button onClick={() => setErrorMsg('')} className="ml-3 opacity-70 hover:opacity-100">✕</button>
        </div>
      )}

      {step === 'upload' && (
        <UploadScreen onImagesReady={handleImagesReady} />
      )}

      {step === 'loading' && (
        <LoadingScreen />
      )}

      {step === 'quiz' && quiz && (
        <QuizScreen questions={quiz.questions} onFinish={handleQuizFinish} />
      )}

      {step === 'results' && quiz && (
        <ResultsScreen questions={quiz.questions} answers={answers} onRestart={handleRestart} />
      )}
    </>
  )
}
