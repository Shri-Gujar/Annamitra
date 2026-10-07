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

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl text-forest">Today</h1>
        <p className="mt-1 text-sm text-ink/70">Logged plates stay on this device for the demo.</p>
      </header>

      <section className="space-y-3 rounded-3xl bg-card p-5 shadow-sm">
        <Progress label="Calories" value={today.calories} target={nutrientTargets.calories} unit="kcal" />
        <Progress label="Protein" value={today.protein} target={nutrientTargets.protein} unit="g" />
        <Progress label="Carbs" value={today.carbs} target={nutrientTargets.carbs} unit="g" />
        <Progress label="Fiber" value={today.fiber} target={nutrientTargets.fiber} unit="g" />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-forest">Meal history</h2>
          <Link to="/scan" className="text-sm font-semibold text-terracotta">
            Add plate
          </Link>
        </div>
        {meals.length === 0 ? (
          <p className="rounded-2xl bg-sand px-4 py-6 text-sm text-ink/70">
            No meals yet. Scan a plate to start the day.
          </p>
        ) : (
          <ul className="space-y-3">
            {meals.slice(0, 8).map((meal) => (
              <li key={meal.id} className="flex gap-3 rounded-2xl bg-card p-3 shadow-sm">
                {meal.imageDataUrl && (
                  <img src={meal.imageDataUrl} alt="" className="h-16 w-16 rounded-xl object-cover" />
                )}
                <div>
                  <p className="font-semibold">{meal.items.map((item) => item.name).join(', ')}</p>
                  <p className="text-sm text-ink/70">{meal.totals.calories} kcal</p>
                  <p className="text-xs text-ink/50">
                    {new Date(meal.detectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function Progress({ label, value, target, unit }) {
  const pct = Math.min(100, Math.round((value / target) * 100))
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-ink/60">
          {value} / {target} {unit}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-sand">
        <div className="h-full rounded-full bg-leaf" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
