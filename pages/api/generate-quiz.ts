import type { NextApiRequest, NextApiResponse } from 'next'
import type { Quiz } from '../../types'

// Augmenter la limite de taille pour recevoir les images en base64
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
}

function buildPrompt(): string {
  return `Tu es un assistant scolaire expert en lecture d'écriture manuscrite et en création de quiz.

ÉTAPE 1 — TRANSCRIPTION OBLIGATOIRE :
Lis attentivement chaque image fournie. Transcris MOT POUR MOT tout le texte visible sur les feuilles de cours (titres, définitions, dates, formules, listes, phrases, exemples...). Ne résume pas, ne devine pas le sujet : lis vraiment ce qui est écrit.

ÉTAPE 2 — GÉNÉRATION DU QUIZ :
À partir UNIQUEMENT du texte que tu viens de transcrire, génère exactement 10 questions de quiz.

⛔ INTERDIT ABSOLU — NE JAMAIS ÉCRIRE CES MOTS DANS UNE QUESTION :
"selon le cours", "d'après le cours", "d'après le texte", "selon le document", "dans le cours", "le cours indique", "le texte dit", "d'après la leçon"
Si tu utilises l'un de ces mots, tu as échoué ta mission.

✅ STYLE OBLIGATOIRE DES QUESTIONS :
Écris chaque question comme un professeur qui interroge un élève à l'oral.
Exemples de bon style :
- "Quelle est la définition de la photosynthèse ?"
- "En quelle année a eu lieu la Révolution française ?"
- "Quel organe produit l'insuline ?"
- "Combien de planètes compte le système solaire ?"

AUTRES RÈGLES :
- Chaque question porte sur un fait précis du texte transcrit
- Mélange QCM (au moins 7) et Vrai/Faux (au plus 3)
- Pour les QCM : 4 options de réponse, une seule correcte
- Pour les Vrai/Faux : options ["Vrai", "Faux"]
- Explications courtes (1-2 phrases)

IMPORTANT : Réponds UNIQUEMENT avec du JSON valide, sans texte avant ou après, sans balises markdown.

Format JSON attendu :
{
  "questions": [
    {
      "type": "qcm",
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "answer": "A",
      "explanation": "..."
    },
    {
      "type": "vrai_faux",
      "question": "...",
      "options": ["Vrai", "Faux"],
      "answer": "Vrai",
      "explanation": "..."
    }
  ]
}`
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Seulement les requêtes POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' })
  }

  // Vérifier la clé API Mistral
  const apiKey = process.env.MISTRAL_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Clé API Mistral manquante. Configure MISTRAL_API_KEY dans .env.local' })
  }

  const { images } = req.body as { images: string[] }

  if (!images || images.length === 0) {
    return res.status(400).json({ error: 'Aucune image fournie' })
  }

  // Construire le contenu multimodal (images + prompt)
  const imageContent = images.map((base64: string) => {
    // Extraire le type MIME et les données
    const match = base64.match(/^data:(.+);base64,(.+)$/)
    if (!match) return null
    return {
      type: 'image_url',
      image_url: { url: base64 }, // Mistral accepte le data URL directement
    }
  }).filter(Boolean)

  const messages = [
    {
      role: 'user',
      content: [
        ...imageContent,
        {
          type: 'text',
          text: buildPrompt(),
        },
      ],
    },
  ]

  try {
    // Appel à l'API Mistral (modèle vision)
    const mistralRes = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'pixtral-12b-2409', // Modèle vision de Mistral
        messages,
        max_tokens: 3000,
        temperature: 0.2, // Basse pour un JSON stable
      }),
    })

    if (!mistralRes.ok) {
      const err = await mistralRes.text()
      console.error('Erreur Mistral:', err)
      return res.status(500).json({ error: `Erreur API Mistral: ${mistralRes.status}` })
    }

    const data = await mistralRes.json()
    const rawContent: string = data.choices?.[0]?.message?.content ?? ''

    // Nettoyer le contenu (retirer les balises markdown si présentes)
    const cleaned = rawContent
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()

    // Parser le JSON
    let quiz: Quiz
    try {
      quiz = JSON.parse(cleaned)
    } catch {
      console.error('JSON invalide reçu de Mistral:', cleaned)
      return res.status(500).json({ error: 'Le quiz généré est invalide. Réessaie avec une image plus lisible.' })
    }

    // Validation basique
    if (!quiz.questions || quiz.questions.length === 0) {
      return res.status(500).json({ error: 'Aucune question générée. Vérifie que ton image est lisible.' })
    }

    // Les images ne sont JAMAIS sauvegardées — traitement uniquement en mémoire
    return res.status(200).json(quiz)

  } catch (error) {
    console.error('Erreur serveur:', error)
    return res.status(500).json({ error: 'Erreur serveur. Réessaie dans quelques secondes.' })
  }
}
