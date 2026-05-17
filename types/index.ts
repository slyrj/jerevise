// Types partagés entre les composants et l'API

export interface Question {
  type: 'qcm' | 'vrai_faux'
  question: string
  options: string[]
  answer: string
  explanation: string
}

export interface Quiz {
  questions: Question[]
}

export type AppStep = 'upload' | 'loading' | 'quiz' | 'results'

export interface UserAnswer {
  questionIndex: number
  selected: string
}
