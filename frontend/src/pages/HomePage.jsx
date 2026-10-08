import { Link } from 'react-router-dom'

const features = [
  {
    icon: '📸',
    title: 'Scan your plate',
    body: 'Capture or upload a meal in seconds.',
  },
  {
    icon: '✨',
    title: 'Get food insights',
    body: 'See estimated calories and key nutrients.',
  },
  {
    icon: '📊',
    title: 'Track your day',
    body: 'Keep your meals and nutrition goals together.',
  },
]

export default function HomePage() {
  return (
    <div className="space-y-7 pb-2">
      {/* Hero */}
      <header className="relative overflow-hidden rounded-[2rem] bg-forest p-6 text-cream shadow-sm">
        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-turmeric/10" />
        <div className="absolute -bottom-16 -left-10 h-32 w-32 rounded-full bg-leaf/10" />

        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-turmeric">
                Annamitra
              </p>

              <p className="mt-1 text-xs text-cream/50">
                Smart food companion
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cream/10 text-xl">
              🥗
            </div>
          </div>

          <h1 className="mt-8 max-w-xs font-display text-4xl leading-tight">
            Know what&apos;s on your plate.
          </h1>

          <p className="mt-3 max-w-sm text-sm leading-6 text-cream/70">
            Explore your Indian meals through estimated nutrition,
            simple insights, and daily tracking.
          </p>

          <Link
            to="/scan"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-turmeric px-5 py-3 text-sm font-semibold text-ink shadow-sm transition-transform active:scale-95"
          >
            📸 Scan a plate
          </Link>
        </div>
      </header>

      {/* Quick stats */}
      <section className="grid grid-cols-3 gap-2">
        <QuickStat icon="🔥" label="Calories" />
        <QuickStat icon="💪" label="Protein" />
        <QuickStat icon="🌿" label="Fiber" />
      </section>

      {/* Main feature */}
      <section className="rounded-[1.8rem] bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-leaf">
              Your nutrition journey
            </p>

            <h2 className="mt-1 font-display text-2xl text-forest">
              From plate to insight ✨
            </h2>
          </div>

          <div className="text-3xl">🍛</div>
        </div>

        <p className="mt-3 text-sm leading-6 text-ink/65">
          Scan a meal and explore its estimated nutrition. Then use your
          daily dashboard to keep track of what you have logged.
        </p>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <StepBadge number="01" text="Capture" />
          <StepBadge number="02" text="Analyze" />
          <StepBadge number="03" text="Explore" />
        </div>
      </section>

      {/* Features */}
      <section className="space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-leaf">
            What you can do
          </p>

          <h2 className="mt-1 font-display text-xl text-forest">
            Simple. Visual. Useful.
          </h2>
        </div>

        <div className="space-y-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex gap-4 rounded-[1.5rem] bg-card p-4 shadow-sm transition-transform hover:-translate-y-0.5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sand text-xl">
                {feature.icon}
              </div>

              <div>
                <p className="font-semibold text-forest">
                  {feature.title}
                </p>

                <p className="mt-1 text-sm leading-5 text-ink/60">
                  {feature.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="rounded-[1.8rem] bg-sand p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-leaf">
          How it works
        </p>

        <div className="mt-4 space-y-4">
          <TimelineItem
            number="1"
            title="Photograph your meal"
            body="Use your camera or upload a clear plate image."
          />

          <TimelineItem
            number="2"
            title="Explore the estimate"
            body="View detected foods and estimated nutrition values."
          />

          <TimelineItem
            number="3"
            title="Track your day"
            body="See your logged meals and nutrition progress."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-[1.8rem] border border-forest/10 bg-card p-5 text-center shadow-sm">
        <div className="text-3xl">🌱</div>

        <h2 className="mt-2 font-display text-xl text-forest">
          Ready to explore your plate?
        </h2>

        <p className="mt-1 text-sm text-ink/60">
          Start with your next meal.
        </p>

        <Link
          to="/scan"
          className="mt-4 inline-flex rounded-full bg-forest px-6 py-3 text-sm font-semibold text-cream transition-transform active:scale-95"
        >
          ✨ Start scanning
        </Link>
      </section>

      {/* Demo note */}
      <p className="px-4 text-center text-xs leading-5 text-ink/45">
        Annamitra provides estimated nutrition for demonstration purposes.
        Values are not a substitute for professional dietary advice.
      </p>
    </div>
  )
}

function QuickStat({ icon, label }) {
  return (
    <div className="rounded-2xl bg-card p-3 text-center shadow-sm">
      <div className="text-lg">{icon}</div>

      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-ink/45">
        {label}
      </p>
    </div>
  )
}

function StepBadge({ number, text }) {
  return (
    <div className="rounded-2xl bg-sand px-2 py-3 text-center">
      <p className="text-[10px] font-bold text-leaf">{number}</p>

      <p className="mt-1 text-xs font-semibold text-forest">
        {text}
      </p>
    </div>
  )
}

function TimelineItem({ number, title, body }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest text-xs font-semibold text-cream">
        {number}
      </div>

      <div>
        <p className="font-semibold text-forest">{title}</p>

        <p className="mt-0.5 text-sm leading-5 text-ink/60">
          {body}
        </p>
      </div>
    </div>
  )
}