import { Link } from 'react-router-dom'
import { loadMealHistory, nutrientTargets } from '../services/nutrition'

export default function DashboardPage() {
  const meals = loadMealHistory()

  const today = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.totals.calories,
      protein: acc.protein + meal.totals.protein,
      carbs: acc.carbs + meal.totals.carbs,
      fiber: acc.fiber + meal.totals.fiber,
    }),
    { calories: 0, protein: 0, carbs: 0, fiber: 0 },
  )

  const calorieRemaining = nutrientTargets.calories - today.calories

  const overallProgress = Math.round(
    ((today.calories / nutrientTargets.calories) * 100 +
      (today.protein / nutrientTargets.protein) * 100 +
      (today.carbs / nutrientTargets.carbs) * 100 +
      (today.fiber / nutrientTargets.fiber) * 100) /
      4,
  )

  const status =
    meals.length === 0
      ? 'Ready to start your day'
      : calorieRemaining > 0
        ? 'You are on track today 🌱'
        : 'You have reached your calorie target'

  return (
    <div className="space-y-6 pb-2">
      {/* Header */}
      <header>
        <div className="flex items-center gap-2">
          <span className="text-2xl">📊</span>

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf">
            Daily overview
          </p>
        </div>

        <h1 className="mt-1 font-display text-3xl text-forest">
          Your day
        </h1>

        <p className="mt-1 text-sm text-ink/70">
          Keep an eye on your nutrition as you move through the day.
        </p>
      </header>

      {/* Daily summary */}
      <section className="relative overflow-hidden rounded-[2rem] bg-forest p-5 text-cream shadow-sm">
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-turmeric/10" />

        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-cream/50">
                Today's progress
              </p>

              <h2 className="mt-1 font-display text-3xl">
                {overallProgress}%
              </h2>

              <p className="mt-1 text-sm text-cream/65">
                {status}
              </p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cream/10 text-2xl">
              {meals.length === 0 ? '🍽️' : '🌱'}
            </div>
          </div>

          <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-cream/10">
            <div
              className="h-full rounded-full bg-turmeric transition-all"
              style={{ width: `${Math.min(overallProgress, 100)}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-cream/50">
            <span>{meals.length} meal{meals.length === 1 ? '' : 's'} logged</span>
            <span>Daily goals</span>
          </div>
        </div>
      </section>

      {/* Calories highlight */}
      <section className="rounded-[1.8rem] bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-leaf">
              Calories
            </p>

            <p className="mt-1 font-display text-3xl text-forest">
              {today.calories}
              <span className="ml-1 text-sm font-medium text-ink/40">
                kcal
              </span>
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-turmeric/15 text-xl">
            🔥
          </div>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-sand">
          <div
            className={`h-full rounded-full ${
              calorieRemaining < 0 ? 'bg-terracotta' : 'bg-leaf'
            }`}
            style={{
              width: `${Math.min(
                100,
                (today.calories / nutrientTargets.calories) * 100,
              )}%`,
            }}
          />
        </div>

        <div className="mt-2 flex justify-between text-xs">
          <span className="text-ink/50">
            Target: {nutrientTargets.calories} kcal
          </span>

          <span
            className={
              calorieRemaining < 0
                ? 'font-semibold text-terracotta'
                : 'font-semibold text-leaf'
            }
          >
            {calorieRemaining < 0
              ? `${Math.abs(calorieRemaining)} kcal over`
              : `${calorieRemaining} kcal remaining`}
          </span>
        </div>
      </section>

      {/* Nutrient cards */}
      <section>
        <div className="mb-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-leaf">
            Nutrition goals
          </p>

          <h2 className="mt-1 font-display text-xl text-forest">
            What you have today
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <NutrientCard
            emoji="💪"
            label="Protein"
            value={today.protein}
            target={nutrientTargets.protein}
            unit="g"
          />

          <NutrientCard
            emoji="🍚"
            label="Carbs"
            value={today.carbs}
            target={nutrientTargets.carbs}
            unit="g"
          />

          <NutrientCard
            emoji="🌿"
            label="Fiber"
            value={today.fiber}
            target={nutrientTargets.fiber}
            unit="g"
          />

          <NutrientCard
            emoji="🍽️"
            label="Meals"
            value={meals.length}
            target={3}
            unit=""
          />
        </div>
      </section>

      {/* Meal history */}
      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-leaf">
              Your meals
            </p>

            <h2 className="mt-1 font-display text-xl text-forest">
              Meal history
            </h2>
          </div>

          <Link
            to="/scan"
            className="rounded-full bg-terracotta px-4 py-2 text-xs font-semibold text-cream"
          >
            + Add plate
          </Link>
        </div>

        {meals.length === 0 ? (
          <div className="rounded-[1.7rem] bg-sand px-5 py-8 text-center">
            <div className="text-3xl">🍽️</div>

            <p className="mt-3 font-display text-lg text-forest">
              Your day starts here
            </p>

            <p className="mt-1 text-sm text-ink/60">
              Scan your first plate to start tracking your nutrition.
            </p>

            <Link
              to="/scan"
              className="mt-4 inline-flex rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-cream"
            >
              Scan a plate
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {meals.slice(0, 8).map((meal) => (
              <li
                key={meal.id}
                className="flex gap-3 rounded-2xl bg-card p-3 shadow-sm"
              >
                {meal.imageDataUrl ? (
                  <img
                    src={meal.imageDataUrl}
                    alt=""
                    className="h-16 w-16 shrink-0 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-sand text-2xl">
                    🍛
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-forest">
                    {meal.items.map((item) => item.name).join(', ')}
                  </p>

                  <p className="mt-1 text-sm text-ink/70">
                    {meal.totals.calories} kcal · {meal.totals.protein}g protein
                  </p>

                  <p className="mt-1 text-xs text-ink/40">
                    {new Date(meal.detectedAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                <div className="flex items-center text-forest/30">
                  ›
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Bottom note */}
      <div className="rounded-2xl bg-sand px-4 py-3 text-center">
        <p className="text-xs leading-5 text-ink/60">
          Your logged meals stay on this device for the demo.
        </p>
      </div>
    </div>
  )
}

function NutrientCard({ emoji, label, value, target, unit }) {
  const pct = Math.min(100, Math.round((value / target) * 100))
  const remaining = target - value
  const isOver = remaining < 0

  return (
    <div className="rounded-[1.5rem] bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-lg">{emoji}</p>

          <p className="mt-2 text-sm font-semibold text-forest">
            {label}
          </p>
        </div>

        <p className="font-display text-xl text-forest">
          {value}
          <span className="ml-1 text-xs font-medium text-ink/40">
            {unit}
          </span>
        </p>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-sand">
        <div
          className={`h-full rounded-full ${
            isOver ? 'bg-terracotta' : 'bg-leaf'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <p
        className={`mt-2 text-[10px] font-semibold ${
          isOver ? 'text-terracotta' : 'text-ink/45'
        }`}
      >
        {label === 'Meals'
          ? `${Math.max(0, remaining)} more to go`
          : isOver
            ? `${Math.abs(remaining)}${unit} over`
            : `${remaining}${unit} remaining`}
      </p>
    </div>
  )
}