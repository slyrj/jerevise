import { useRef, useState } from 'react'

interface UploadScreenProps {
  onImagesReady: (images: string[]) => void
}

export default function UploadScreen({ onImagesReady }: UploadScreenProps) {
  const [previews, setPreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  // Convertir un fichier en base64
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  // Traiter les fichiers sélectionnés
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    const newPreviews: string[] = []
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue
      const b64 = await fileToBase64(file)
      newPreviews.push(b64)
    }
    setPreviews((prev) => [...prev, ...newPreviews])
  }

  // Supprimer une image
  const removeImage = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const canSubmit = previews.length > 0

  return (
    <div className="min-h-dvh flex flex-col px-5 py-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-10 animate-fade-up" style={{ animationDelay: '0ms' }}>
        <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-3 py-1 mb-6">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse-slow" />
          <span className="text-accent text-xs font-body font-medium tracking-wide">IA · Gratuit</span>
        </div>
        <h1 className="font-display font-extrabold text-4xl text-cream leading-none mb-3">
          Transforme ton cours<br />
          <span className="text-accent">en quiz</span>
        </h1>
        <p className="font-body text-muted text-base leading-relaxed">
          Prends une photo de ton cours et révise en quelques secondes.
        </p>
      </div>

      {/* Zone d'upload */}
      <div className="flex-1">
        {previews.length === 0 ? (
          /* État vide — zone de drop stylisée */
          <div
            className="animate-fade-up border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center py-14 gap-4 cursor-pointer hover:border-accent/40 transition-colors"
            style={{ animationDelay: '80ms' }}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 rounded-2xl bg-card flex items-center justify-center text-3xl">
              📸
            </div>
            <div className="text-center">
              <p className="font-display font-semibold text-cream text-lg">Ajoute tes photos de cours</p>
              <p className="font-body text-muted text-sm mt-1">JPG, PNG — plusieurs fichiers acceptés</p>
            </div>
          </div>
        ) : (
          /* Grille de miniatures */
          <div className="animate-fade-up grid grid-cols-2 gap-3 mb-4" style={{ animationDelay: '0ms' }}>
            {previews.map((src, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden aspect-[4/3] bg-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Cours ${i + 1}`} className="w-full h-full object-cover" />
                {/* Bouton supprimer */}
                <button
                  onClick={() => removeImage(i)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-ink/80 backdrop-blur-sm flex items-center justify-center text-cream text-sm hover:bg-red-500/80 transition-colors"
                  aria-label="Supprimer"
                >
                  ×
                </button>
                <div className="absolute bottom-2 left-2 bg-ink/70 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-body text-cream">
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Boutons d'action */}
        <div className={`flex flex-col gap-3 ${previews.length > 0 ? 'mt-2' : 'mt-6'} animate-fade-up`} style={{ animationDelay: '140ms' }}>
          {/* Ajouter depuis la galerie */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-4 rounded-2xl bg-card border border-border font-display font-semibold text-cream text-base flex items-center justify-center gap-3 hover:border-accent/40 active:scale-[0.98] transition-all"
          >
            <span className="text-xl">🖼️</span>
            {previews.length > 0 ? 'Ajouter une autre image' : 'Choisir depuis la galerie'}
          </button>

          {/* Prendre une photo */}
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="w-full py-4 rounded-2xl bg-card border border-border font-display font-semibold text-cream text-base flex items-center justify-center gap-3 hover:border-accent/40 active:scale-[0.98] transition-all"
          >
            <span className="text-xl">📷</span>
            Prendre une photo
          </button>

          {/* Terminer — CTA principal */}
          {canSubmit && (
            <button
              onClick={() => onImagesReady(previews)}
              className="w-full py-4 rounded-2xl bg-accent font-display font-bold text-cream text-lg flex items-center justify-center gap-3 hover:bg-accent-light active:scale-[0.98] transition-all shadow-lg shadow-accent/20"
            >
              Générer le quiz →
            </button>
          )}
        </div>

        {/* Compteur */}
        {previews.length > 0 && (
          <p className="text-center text-muted text-sm font-body mt-4">
            {previews.length} image{previews.length > 1 ? 's' : ''} sélectionnée{previews.length > 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Inputs cachés */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}
