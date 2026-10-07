import { Link } from 'react-router-dom'

const steps = [
  { title: 'Photograph the plate', body: 'Use the camera or upload a thali photo.' },
  { title: 'Detect Indian foods', body: 'The app looks for items like dal, roti, and sabzi.' },
  { title: 'Estimate nutrition', body: 'Totals come from typical portions plus a food database.' },
]

export default function HomePage() {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-leaf">Annamitra</p>
        <h1 className="font-display text-4xl leading-tight text-forest">
          Know what is on the plate.
        </h1>
        <p className="text-[15px] leading-relaxed text-ink/75">
          AI-assisted Indian food nutrition estimates from a photo. Built as a progressive
          web app for phone and laptop demos.
        </p>
      </header>

      <section className="overflow-hidden rounded-3xl bg-forest p-5 text-cream shadow-sm">
        <p className="text-sm text-cream/70">Today&apos;s milestone</p>
        <h2 className="mt-1 font-display text-2xl">Camera → plate → estimate</h2>
        <p className="mt-2 text-sm leading-relaxed text-cream/80">
          Scan a meal, see detected items, and get calories, protein, carbs, and fiber.
          Values are estimates, not lab results.
        </p>
        <Link
          to="/scan"
          className="mt-5 inline-flex rounded-full bg-turmeric px-5 py-2.5 text-sm font-semibold text-ink"
        >
          Scan a plate
        </Link>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl text-forest">How it works</h2>
        <ol className="space-y-3">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-3 rounded-2xl bg-card p-4 shadow-sm">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sand font-semibold text-forest">
                {index + 1}
              </span>
              <div>
                <p className="font-semibold">{step.title}</p>
                <p className="text-sm text-ink/70">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
