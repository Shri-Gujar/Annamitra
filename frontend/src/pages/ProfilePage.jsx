import { useEffect, useState } from 'react'

const PROFILE_KEY = 'annamitra-profile'

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    age: '',
    sex: 'female',
    height: '',
    weight: '',
    water: '',
    bodyFat: '',
  })

  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PROFILE_KEY)
      if (stored) {
        setProfile(JSON.parse(stored))
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

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-leaf">
          Annamitra
        </p>

        <h1 className="mt-2 font-display text-3xl text-forest">
          Body Profile
        </h1>

        <p className="mt-1 text-sm leading-relaxed text-ink/70">
          Enter your basic details to calculate BMR, hydration and body metrics.
        </p>
      </header>

      <form onSubmit={saveProfile} className="space-y-4">
        <Field
          label="Age"
          name="age"
          type="number"
          value={profile.age}
          onChange={handleChange}
          placeholder="Example: 21"
          min="1"
          max="120"
        />

        <div>
          <label className="mb-1 block text-sm font-medium">
            Sex
          </label>

          <select
            name="sex"
            value={profile.sex}
            onChange={handleChange}
            className="w-full rounded-2xl border border-forest/20 bg-card px-4 py-3 outline-none"
          >
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </div>

        <Field
          label="Height (cm)"
          name="height"
          type="number"
          value={profile.height}
          onChange={handleChange}
          placeholder="Example: 156"
          min="50"
          max="250"
        />

        <Field
          label="Weight (kg)"
          name="weight"
          type="number"
          value={profile.weight}
          onChange={handleChange}
          placeholder="Example: 54"
          min="10"
          max="300"
          step="0.1"
        />

        <Field
          label="Daily water intake (litres)"
          name="water"
          type="number"
          value={profile.water}
          onChange={handleChange}
          placeholder="Example: 2"
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
          placeholder="Example: 25"
          min="2"
          max="60"
          step="0.1"
        />

        <button
          type="submit"
          className="w-full rounded-full bg-forest px-5 py-3 text-sm font-semibold text-cream"
        >
          Save profile
        </button>

        {saved && (
          <p className="rounded-2xl bg-sand px-4 py-3 text-center text-sm text-forest">
            Profile saved successfully ✓
          </p>
        )}

        {saved && profile.bmr && (
          <div className="rounded-2xl bg-card p-4 text-center shadow-sm">
            <p className="text-xs uppercase tracking-wide text-leaf">
              Your BMR
            </p>

            <p className="mt-1 font-display text-3xl text-forest">
              {profile.bmr} kcal/day
            </p>

            <p className="mt-1 text-xs text-ink/60">
              Estimated calories your body uses at rest.
            </p>
          </div>
        )}

        {saved && profile.hydration && (
          <div className="rounded-2xl bg-card p-4 text-center shadow-sm">
            <p className="text-xs uppercase tracking-wide text-leaf">
              Daily Hydration Target
            </p>

            <p className="mt-1 font-display text-3xl text-forest">
              {profile.hydration} L/day
            </p>

            <p className="mt-1 text-xs text-ink/60">
              Estimated daily water target based on body weight.
            </p>
          </div>
        )}

        {saved && profile.skeletalMuscleMass && (
          <div className="rounded-2xl bg-card p-4 text-center shadow-sm">
            <p className="text-xs uppercase tracking-wide text-leaf">
              Estimated Skeletal Muscle Mass
            </p>

            <p className="mt-1 font-display text-3xl text-forest">
              {profile.skeletalMuscleMass} kg
            </p>

            <p className="mt-1 text-xs text-ink/60">
              Approximate estimate based on body weight and body fat.
            </p>
          </div>
        )}
      </form>
    </div>
  )
}

function Field({ label, name, type, value, onChange, placeholder, min, max, step }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">
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
        className="w-full rounded-2xl border border-forest/20 bg-card px-4 py-3 outline-none"
      />
    </div>
  )
}