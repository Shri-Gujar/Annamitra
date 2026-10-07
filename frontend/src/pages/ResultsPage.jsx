import { Link } from 'react-router-dom'
import { loadMealHistory } from '../services/nutrition'

function latestMeal() {
  try {
    const stored = sessionStorage.getItem('annamitra-latest')
    if (stored) return JSON.parse(stored)
  } catch {
    /* ignore */
  }
  return loadMealHistory()[0] ?? null
}

export default function ResultsPage() {
  const meal = latestMeal()

  if (!meal) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-3xl text-forest">Plate results</h1>
        <p className="text-ink/70">No scan yet. Photograph a plate to see estimated nutrition.</p>
        <Link to="/scan" className="inline-flex rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-cream">
          Go to scan
        </Link>
      </div>
    )
  }

  const { items, totals, confidence, disclaimer, imageDataUrl } = meal

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="font-display text-3xl text-forest">Estimated plate</h1>
        <p className="text-sm text-ink/70">
          Detection confidence {Math.round(confidence * 100)}%. Typical Indian thali portions.
        </p>
      </header>

      {imageDataUrl && (
        <img src={imageDataUrl} alt="Analyzed plate" className="h-40 w-full rounded-3xl object-cover" />
      )}

      <section className="grid grid-cols-2 gap-3">
        <Stat label="Calories" value={`${totals.calories} kcal`} />
        <Stat label="Protein" value={`${totals.protein} g`} />
        <Stat label="Carbs" value={`${totals.carbs} g`} />
        <Stat label="Fiber" value={`${totals.fiber} g`} />
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl text-forest">Detected foods</h2>
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.name} className="rounded-2xl bg-card p-4 shadow-sm">
              <div className="flex items-baseline justify-between">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-ink/60">{item.portion}</p>
              </div>
              <p className="mt-1 text-sm text-ink/70">
                {item.calories} kcal · {item.protein}g protein · {item.carbs}g carbs · {item.fiber}g fiber
              </p>
              <p className="mt-1 text-xs uppercase tracking-wide text-leaf">
                Vitamins {item.vitamins.join(', ')}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <p className="rounded-2xl bg-sand px-4 py-3 text-sm leading-relaxed text-ink/75">{disclaimer}</p>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl bg-card p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-leaf">{label}</p>
      <p className="mt-1 font-display text-2xl text-forest">{value}</p>
    </div>
  )
}
