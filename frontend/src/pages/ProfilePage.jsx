import { useEffect, useState } from 'react'

const PROFILE_KEY = 'annamitra-profile'
const WATER_KEY = 'annamitra-water'

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    age: '',
    sex: 'female',
    height: '',
    weight: '',
    water: '',
    bodyFat: '',
  })

  const [waterConsumed, setWaterConsumed] = useState(0)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem(PROFILE_KEY)
      const storedWater = localStorage.getItem(WATER_KEY)

      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile)
        setProfile(parsedProfile)

        if (parsedProfile.bmr) {
          setSaved(true)
        }
      }

      if (storedWater) {
        setWaterConsumed(Number(storedWater))
      }
    } catch {
      /* ignore */
    }
  }, [])

  function handleChange(event) {
    const { name, value } = event.target

    setProfile((current) => ({
      ...current,
      [name]: value,
    }))

    setSaved(false)
  }

  function saveProfile(event) {
    event.preventDefault()

    const age = Number(profile.age)
    const height = Number(profile.height)
    const weight = Number(profile.weight)
    const bodyFat = Number(profile.bodyFat)

    const hydration = Number((weight * 0.035).toFixed(1))

    let bmr

    if (profile.sex === 'female') {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5
    }

    const leanBodyMass = weight * (1 - bodyFat / 100)
    const skeletalMuscleMass = Number((leanBodyMass * 0.5).toFixed(1))

    const updatedProfile = {
      ...profile,
      bmr: Math.round(bmr),
      hydration,
      skeletalMuscleMass,
    }

    localStorage.setItem(PROFILE_KEY, JSON.stringify(updatedProfile))
    setProfile(updatedProfile)
    setSaved(true)
  }

  const hydrationTarget = Number(profile.hydration) || 0
  const targetMl = hydrationTarget * 1000

  const waterProgress =
    targetMl > 0
      ? Math.min((waterConsumed / targetMl) * 100, 100)
      : 0

  const remainingWater = Math.max(targetMl - waterConsumed, 0)

  function addWater() {
    const nextWater = Math.min(
      waterConsumed + 250,
      targetMl || Infinity,
    )

    setWaterConsumed(nextWater)
    localStorage.setItem(WATER_KEY, String(nextWater))
  }

  function resetWater() {
    setWaterConsumed(0)
    localStorage.setItem(WATER_KEY, '0')
  }

  return (
    <div className="space-y-6 pb-4">
      {/* Premium Header */}
      <header className="relative overflow-hidden rounded-[2rem] bg-forest p-6 text-cream shadow-lg">
        <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-leaf/20" />
        <div className="absolute -bottom-20 -left-12 h-40 w-40 rounded-full bg-cream/5" />

        <div className="relative">
          <div className="flex items-center justify-between">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cream/10 text-2xl backdrop-blur">
              👤
            </div>

            <div className="rounded-full border border-cream/10 bg-cream/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-cream/60">
              Wellness
            </div>
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-cream/50">
            Annamitra
          </p>

          <h1 className="mt-2 font-display text-3xl font-semibold">
            Your Health Profile
          </h1>

          <p className="mt-2 max-w-xs text-sm leading-relaxed text-cream/65">
            Understand your body and build healthier daily habits.
          </p>
        </div>
      </header>

      {/* Personal Details */}
      <section className="rounded-[2rem] border border-forest/10 bg-card p-5 shadow-sm">
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-leaf" />

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-leaf">
              Personal details
            </p>
          </div>

          <h2 className="mt-2 font-display text-xl font-semibold text-forest">
            Body information
          </h2>

          <p className="mt-1 text-xs text-ink/50">
            Used to personalize your health insights.
          </p>
        </div>

        <form onSubmit={saveProfile} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Age"
              name="age"
              type="number"
              value={profile.age}
              onChange={handleChange}
              placeholder="21"
              min="1"
              max="120"
            />

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink/60">
                Sex
              </label>

              <select
                name="sex"
                value={profile.sex}
                onChange={handleChange}
                className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3 text-sm text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-leaf/20"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Height (cm)"
              name="height"
              type="number"
              value={profile.height}
              onChange={handleChange}
              placeholder="156"
              min="50"
              max="250"
            />

            <Field
              label="Weight (kg)"
              name="weight"
              type="number"
              value={profile.weight}
              onChange={handleChange}
              placeholder="54"
              min="10"
              max="300"
              step="0.1"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Water (L)"
              name="water"
              type="number"
              value={profile.water}
              onChange={handleChange}
              placeholder="2"
              min="0"
              max="10"
              step="0.1"
            />

            <Field
              label="Body Fat (%)"
              name="bodyFat"
              type="number"
              value={profile.bodyFat}
              onChange={handleChange}
              placeholder="25"
              min="2"
              max="60"
              step="0.1"
            />
          </div>

          <button
            type="submit"
            className="group relative w-full overflow-hidden rounded-2xl bg-forest px-5 py-3.5 text-sm font-semibold text-cream shadow-md transition duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
          >
            <span className="relative z-10">
              {saved ? 'Profile Updated ✓' : 'Save Profile'}
            </span>

            <span className="absolute inset-0 -translate-x-full bg-leaf/30 transition-transform duration-500 group-hover:translate-x-0" />
          </button>

          {saved && (
            <div className="rounded-2xl bg-sand px-4 py-3 text-center text-sm font-medium text-forest">
              Profile saved successfully ✓
            </div>
          )}
        </form>
      </section>

      {/* Premium Metrics */}
      {saved && (
        <section className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-leaf">
                  Your metrics
                </p>

                <h2 className="mt-1 font-display text-2xl font-semibold text-forest">
                  Body overview
                </h2>
              </div>

              <span className="rounded-full bg-sand px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-forest">
                Live
              </span>
            </div>
          </div>

          {/* Main BMR Card */}
          <div className="group relative overflow-hidden rounded-[2rem] bg-forest p-5 text-cream shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-leaf/20 transition-transform duration-500 group-hover:scale-125" />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cream/50">
                  Basal Metabolic Rate
                </p>

                <p className="mt-3 font-display text-4xl font-semibold">
                  {profile.bmr}
                </p>

                <p className="mt-1 text-sm text-cream/55">
                  calories burned at rest / day
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cream/10 text-xl">
                🔥
              </div>
            </div>

            <div className="relative mt-5 h-px bg-cream/10" />

            <div className="relative mt-4 flex items-center justify-between">
              <span className="text-xs text-cream/45">
                Personalized estimate
              </span>

              <span className="text-xs font-semibold text-cream/70">
                Based on your profile
              </span>
            </div>
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <PremiumMetric
              icon="💧"
              title="Hydration"
              value={profile.hydration}
              unit="L / day"
              accent="Target"
            />

            <PremiumMetric
              icon="💪"
              title="Muscle mass"
              value={profile.skeletalMuscleMass}
              unit="kg"
              accent="Estimate"
            />

            <PremiumMetric
              icon="⚖️"
              title="Body weight"
              value={profile.weight}
              unit="kg"
              accent="Current"
            />

            <PremiumMetric
              icon="📏"
              title="Height"
              value={profile.height}
              unit="cm"
              accent="Current"
            />
          </div>
        </section>
      )}

      {/* Hydration Tracker */}
      {saved && (
        <section className="relative overflow-hidden rounded-[2rem] bg-forest p-5 text-cream shadow-lg">
          <div className="absolute -bottom-16 -right-12 h-40 w-40 rounded-full bg-leaf/10" />

          <div className="relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cream/50">
                  Daily wellness
                </p>

                <h2 className="mt-1 font-display text-2xl font-semibold">
                  Hydration
                </h2>

                <p className="mt-1 text-sm text-cream/60">
                  Keep your body refreshed today.
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cream/10 text-2xl">
                💧
              </div>
            </div>

            <div className="mt-6 flex items-end justify-between">
              <div>
                <p className="font-display text-4xl font-semibold">
                  {(waterConsumed / 1000).toFixed(2)}
                  <span className="ml-1 text-lg text-cream/50">L</span>
                </p>

                <p className="mt-1 text-xs text-cream/50">
                  of {hydrationTarget.toFixed(1)} L daily target
                </p>
              </div>

              <div className="text-right">
                <p className="font-display text-2xl font-semibold">
                  {Math.round(waterProgress)}%
                </p>

                <p className="text-[10px] uppercase tracking-wider text-cream/40">
                  complete
                </p>
              </div>
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-cream/10">
              <div
                className="h-full rounded-full bg-cream transition-all duration-700 ease-out"
                style={{ width: `${waterProgress}%` }}
              />
            </div>

            <div className="mt-3 flex justify-between text-xs text-cream/40">
              <span>0 L</span>
              <span>{hydrationTarget.toFixed(1)} L</span>
            </div>

            <div className="mt-6 grid grid-cols-[1fr_auto] gap-3">
              <button
                type="button"
                onClick={addWater}
                disabled={waterProgress >= 100}
                className="rounded-2xl bg-cream px-4 py-3.5 text-sm font-bold text-forest shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {waterProgress >= 100
                  ? 'Target Reached ✓'
                  : '+ Add 250 ml'}
              </button>

              <button
                type="button"
                onClick={resetWater}
                className="rounded-2xl border border-cream/15 px-4 py-3.5 text-sm font-medium text-cream/70 transition hover:bg-cream/10 active:scale-[0.97]"
              >
                Reset
              </button>
            </div>

            <div className="mt-4 rounded-2xl bg-cream/5 px-4 py-3 text-center">
              <p className="text-xs text-cream/60">
                {remainingWater > 0
                  ? `${(remainingWater / 1000).toFixed(2)} L remaining to reach today's target`
                  : "You've reached your hydration target for today ✓"}
              </p>
            </div>

            <p className="mt-4 text-center text-[11px] leading-relaxed text-cream/40">
              Hydration target is an approximate estimate based on body weight.
            </p>
          </div>
        </section>
      )}
    </div>
  )
}

function Field({
  label,
  name,
  type,
  value,
  onChange,
  placeholder,
  min,
  max,
  step,
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink/60">
        {label}
      </label>

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        required
        className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/30 focus:border-forest focus:ring-2 focus:ring-leaf/20"
      />
    </div>
  )
}

function PremiumMetric({ icon, title, value, unit, accent }) {
  return (
    <div className="group rounded-[1.6rem] border border-forest/10 bg-card p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sand text-lg transition duration-300 group-hover:scale-110">
          {icon}
        </div>

        <span className="text-[9px] font-bold uppercase tracking-widest text-leaf">
          {accent}
        </span>
      </div>

      <p className="mt-5 text-xs font-medium text-ink/50">
        {title}
      </p>

      <div className="mt-1 flex items-baseline gap-1">
        <span className="font-display text-2xl font-semibold text-forest">
          {value}
        </span>

        <span className="text-[10px] font-medium text-ink/40">
          {unit}
        </span>
      </div>
    </div>
  )
}