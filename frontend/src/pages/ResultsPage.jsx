import { Link } from 'react-router-dom'
import { loadMealHistory, nutrientTargets } from '../services/nutrition'

function latestMeal() {
  try {
    const stored = sessionStorage.getItem('annamitra-latest')

    if (stored) {
      return JSON.parse(stored)
    }
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
        <h1 className="font-display text-3xl text-forest">
          Plate results
        </h1>

        <p className="text-ink/70">
          No scan yet. Photograph a plate to see estimated nutrition.
        </p>

        <Link
          to="/scan"
          className="inline-flex rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-cream"
        >
          Go to scan
        </Link>
      </div>
    )
  }

  const { items, totals, disclaimer, imageDataUrl } = meal

  const nutrients = [
    {
      key: 'calories',
      label: 'Calories',
      value: totals.calories,
      target: nutrientTargets.calories,
      unit: 'kcal',
      emoji: '🔥',
    },
    {
      key: 'protein',
      label: 'Protein',
      value: totals.protein,
      target: nutrientTargets.protein,
      unit: 'g',
      emoji: '💪',
    },
    {
      key: 'carbs',
      label: 'Carbs',
      value: totals.carbs,
      target: nutrientTargets.carbs,
      unit: 'g',
      emoji: '🍚',
    },
    {
      key: 'fiber',
      label: 'Fiber',
      value: totals.fiber,
      target: nutrientTargets.fiber,
      unit: 'g',
      emoji: '🌿',
    },
  ]

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-2xl">✨</span>

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf">
            Scan complete
          </p>
        </div>

        <h1 className="font-display text-3xl text-forest">
          Your plate insights
        </h1>

        <p className="text-sm leading-5 text-ink/70">
          Here's what this meal adds to your daily nutrition goals.
        </p>
      </header>

      {imageDataUrl && (
        <div className="relative overflow-hidden rounded-[2rem]">
          <img
            src={imageDataUrl}
            alt="Analyzed plate"
            className="h-48 w-full object-cover"
          />

          <div className="absolute bottom-3 left-3 rounded-full bg-forest/90 px-3 py-1.5 text-xs font-medium text-cream backdrop-blur-sm">
            🍽️ Estimated meal
          </div>
        </div>
      )}

      <section className="space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-leaf">
            Daily nutrition
          </p>

          <h2 className="mt-1 font-display text-xl text-forest">
            What you have vs what you need
          </h2>
        </div>

        <div className="space-y-3">
          {nutrients.map((nutrient) => (
            <NutritionCard
              key={nutrient.key}
              nutrient={nutrient}
            />
          ))}
        </div>
      </section>

      <section className="rounded-[1.8rem] bg-forest p-5 text-cream shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cream/50">
          This meal
        </p>

        <h2 className="mt-1 font-display text-2xl">
          {totals.calories} kcal
        </h2>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <MiniStat
            label="Protein"
            value={`${totals.protein}g`}
          />

          <MiniStat
            label="Carbs"
            value={`${totals.carbs}g`}
          />

          <MiniStat
            label="Fiber"
            value={`${totals.fiber}g`}
          />
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-leaf">
            Plate breakdown
          </p>

          <h2 className="mt-1 font-display text-xl text-forest">
            Selected foods
          </h2>
        </div>

        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.name}
              className="rounded-2xl bg-card p-4 shadow-sm"
            >
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-semibold">{item.name}</p>

                <p className="text-sm text-ink/60">
                  {item.portion}
                </p>
              </div>

              <p className="mt-1 text-sm text-ink/70">
                {item.calories} kcal · {item.protein}g protein ·{' '}
                {item.carbs}g carbs · {item.fiber}g fiber
              </p>

              <p className="mt-1 text-xs uppercase tracking-wide text-leaf">
                Vitamins {item.vitamins.join(', ')}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-[1.5rem] bg-sand p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-forest text-lg">
            ✨
          </div>

          <div>
            <p className="font-semibold text-forest">
              Nutrition estimate
            </p>

            <p className="mt-1 text-sm leading-5 text-ink/70">
              Based on your selected foods, typical serving sizes,
              and the nutrition database used by Annamitra.
            </p>
          </div>
        </div>
      </section>

      <p className="rounded-2xl bg-sand px-4 py-3 text-sm leading-relaxed text-ink/75">
        {disclaimer}
      </p>

      <Link
        to="/scan"
        className="flex w-full items-center justify-center rounded-2xl bg-forest px-5 py-3.5 text-sm font-semibold text-cream transition-transform active:scale-95"
      >
        📸 Scan another meal
      </Link>
    </div>
  )
}

function NutritionCard({ nutrient }) {
  const {
    label,
    value,
    target,
    unit,
    emoji,
  } = nutrient

  const remaining = target - value
  const progress = Math.min((value / target) * 100, 100)
  const isOver = remaining < 0

  return (
    <div className="rounded-[1.5rem] bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-forest/5 text-lg">
            {emoji}
          </div>

          <div>
            <p className="font-semibold text-forest">
              {label}
            </p>

            <p className="text-xs text-ink/50">
              Daily target: {target} {unit}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="font-display text-xl text-forest">
            {value}

            <span className="ml-1 text-xs font-medium text-ink/50">
              {unit}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-forest/10">
        <div
          className={`h-full rounded-full transition-all ${
            isOver
              ? 'bg-terracotta'
              : 'bg-leaf'
          }`}
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between">
        <p
          className={`text-xs font-semibold ${
            isOver
              ? 'text-terracotta'
              : 'text-leaf'
          }`}
        >
          {isOver
            ? `${Math.abs(remaining)} ${unit} over target`
            : `${remaining} ${unit} remaining`}
        </p>

        <p className="text-xs text-ink/40">
          {Math.round((value / target) * 100)}% of target
        </p>
      </div>
    </div>
  )
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl bg-cream/10 p-3">
      <p className="text-[10px] uppercase tracking-wide text-cream/50">
        {label}
      </p>

      <p className="mt-1 font-display text-lg">
        {value}
      </p>
    </div>
  )
}