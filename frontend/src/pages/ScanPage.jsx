import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { analyzePlate, saveMeal } from '../services/nutrition'

const foodOptions = [
  { value: 'roti', emoji: '🫓', label: 'Roti' },
  { value: 'dal', emoji: '🥣', label: 'Dal' },
  { value: 'rice', emoji: '🍚', label: 'Rice' },
  { value: 'sabzi', emoji: '🥗', label: 'Sabzi' },
]

const floatingFoods = ['🥗', '🍚', '🫓', '🥕', '🍅', '🌿']

export default function ScanPage() {
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const fileRef = useRef(null)
  const streamRef = useRef(null)

  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')
  const [cameraOn, setCameraOn] = useState(false)
  const [busy, setBusy] = useState(false)
  const [scanStep, setScanStep] = useState(0)

  const [selectedFoods, setSelectedFoods] = useState([
    'roti',
    'dal',
    'sabzi',
  ])

  useEffect(() => {
    return () => stopCamera()
  }, [])

  useEffect(() => {
    if (!busy) return

    const timer = setInterval(() => {
      setScanStep((step) => (step + 1) % 3)
    }, 900)

    return () => clearInterval(timer)
  }, [busy])

  async function startCamera() {
    setError('')

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      setCameraOn(true)
    } catch {
      setError('Camera permission was blocked. Upload a photo instead.')
      setCameraOn(false)
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setCameraOn(false)
  }

  function captureFrame() {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas) return

    canvas.width = video.videoWidth || 720
    canvas.height = video.videoHeight || 720

    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    setPreview(canvas.toDataURL('image/jpeg', 0.85))
    stopCamera()
  }

  function onFile(event) {
    const file = event.target.files?.[0]

    if (!file) return

    const reader = new FileReader()

    reader.onload = () => {
      setPreview(String(reader.result))
    }

    reader.readAsDataURL(file)
    stopCamera()
  }

  function toggleFood(food) {
    setSelectedFoods((current) => {
      if (current.includes(food)) {
        return current.filter((item) => item !== food)
      }

      return [...current, food]
    })
  }

  function resetPhoto() {
    setPreview('')
    setError('')
    setSelectedFoods(['roti', 'dal', 'sabzi'])

    if (fileRef.current) {
      fileRef.current.value = ''
    }
  }

  function analyze() {
    if (!preview) {
      setError('Capture or upload a plate photo first.')
      return
    }

    if (selectedFoods.length === 0) {
      setError('Please select at least one food.')
      return
    }

    setError('')
    setBusy(true)
    setScanStep(0)

    const analysis = analyzePlate(preview, selectedFoods)

    saveMeal(analysis)
    sessionStorage.setItem('annamitra-latest', JSON.stringify(analysis))

    setTimeout(() => setScanStep(1), 900)
    setTimeout(() => setScanStep(2), 1800)

    setTimeout(() => {
      navigate('/results')
    }, 2700)
  }

  const scanMessages = [
    'Finding food on your plate…',
    'Checking selected ingredients…',
    'Preparing nutrition insights…',
  ]

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes scanLine {
          0% {
            top: 8%;
            opacity: 0.4;
          }
          50% {
            top: 88%;
            opacity: 1;
          }
          100% {
            top: 8%;
            opacity: 0.4;
          }
        }

        @keyframes floatFood {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
        }

        @keyframes softPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.08);
            opacity: 1;
          }
        }
      `}</style>

      <header className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">✨</span>

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf">
            Smart plate scan
          </p>
        </div>

        <h1 className="font-display text-3xl text-forest">
          Know what's on your plate.
        </h1>

        <p className="text-sm leading-5 text-ink/70">
          Capture or upload a meal to explore its nutrition.
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {['Food', 'Nutrition', 'Portions'].map((item) => (
            <span
              key={item}
              className="rounded-full bg-sand px-3 py-1 text-xs font-medium text-forest"
            >
              {item}
            </span>
          ))}
        </div>
      </header>

      <section className="relative overflow-hidden rounded-[2rem] bg-forest p-4 shadow-sm">
        <div className="relative overflow-hidden rounded-[1.5rem] bg-cream">
          {preview ? (
            <img
              src={preview}
              alt="Uploaded plate"
              className="h-72 w-full object-cover"
            />
          ) : cameraOn ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-72 w-full object-cover"
            />
          ) : (
            <div className="relative flex h-72 flex-col items-center justify-center overflow-hidden px-6 text-center">
              {floatingFoods.map((food, index) => (
                <span
                  key={`${food}-${index}`}
                  className="absolute text-2xl"
                  style={{
                    left: `${12 + index * 15}%`,
                    top: `${18 + (index % 3) * 25}%`,
                    animation: `floatFood ${
                      2.5 + index * 0.25
                    }s ease-in-out infinite`,
                    animationDelay: `${index * 0.2}s`,
                    opacity: 0.55,
                  }}
                >
                  {food}
                </span>
              ))}

              <div
                className="relative z-10 text-6xl"
                style={{
                  animation: 'softPulse 2.5s ease-in-out infinite',
                }}
              >
                🍽️
              </div>

              <p className="relative z-10 mt-4 font-display text-xl text-forest">
                Your plate goes here
              </p>

              <p className="relative z-10 mt-1 text-sm text-ink/60">
                Take a photo or upload one from your gallery.
              </p>
            </div>
          )}

          {busy && (
            <div className="absolute inset-0 overflow-hidden bg-forest/20 backdrop-blur-[1px]">
              <div
                className="absolute left-3 right-3 h-1 rounded-full bg-leaf shadow-[0_0_22px_rgba(123,168,117,1)]"
                style={{
                  animation: 'scanLine 1.8s ease-in-out infinite',
                }}
              />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-full border border-cream/40 bg-forest/75 px-5 py-2.5 text-xs font-semibold text-cream shadow-lg backdrop-blur">
                  {scanMessages[scanStep]}
                </div>
              </div>

              {floatingFoods.slice(0, 4).map((food, index) => (
                <span
                  key={`scan-${food}-${index}`}
                  className="absolute text-2xl"
                  style={{
                    left: `${15 + index * 22}%`,
                    bottom: `${18 + (index % 2) * 45}%`,
                    animation: `floatFood ${
                      1.8 + index * 0.2
                    }s ease-in-out infinite`,
                    animationDelay: `${index * 0.15}s`,
                  }}
                >
                  {food}
                </span>
              ))}
            </div>
          )}
        </div>

        {!busy && (
          <div className="mt-4 flex flex-wrap gap-2">
            {!cameraOn && (
              <>
                <button
                  type="button"
                  onClick={startCamera}
                  className="flex-1 rounded-2xl bg-cream px-4 py-3 text-sm font-semibold text-forest transition-transform active:scale-95"
                >
                  📷 Open camera
                </button>

                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex-1 rounded-2xl bg-leaf px-4 py-3 text-sm font-semibold text-forest transition-transform active:scale-95"
                >
                  🖼️ Upload image
                </button>
              </>
            )}

            {cameraOn && (
              <button
                type="button"
                onClick={captureFrame}
                className="w-full rounded-2xl bg-leaf px-4 py-3 text-sm font-semibold text-forest transition-transform active:scale-95"
              >
                📸 Capture
              </button>
            )}
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={onFile}
          className="hidden"
        />

        <canvas ref={canvasRef} className="hidden" />
      </section>

      {preview && !busy && (
        <section className="space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-leaf">
              Food selection
            </p>

            <h2 className="mt-1 font-display text-xl text-forest">
              What's in this photo?
            </h2>

            <p className="mt-1 text-sm leading-5 text-ink/65">
              Select all the foods you can see on your plate.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {foodOptions.map((food) => {
              const selected = selectedFoods.includes(food.value)

              return (
                <button
                  key={food.value}
                  type="button"
                  onClick={() => toggleFood(food.value)}
                  className={`rounded-2xl border px-4 py-4 text-left transition-all active:scale-95 ${
                    selected
                      ? 'border-forest bg-forest text-cream shadow-sm'
                      : 'border-forest/10 bg-sand/40 text-forest'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{food.emoji}</span>

                    <span className="text-sm">
                      {selected ? '✓' : '＋'}
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-semibold">
                    {food.label}
                  </p>
                </button>
              )
            })}
          </div>

          <div className="rounded-2xl bg-sand px-4 py-3">
            <p className="text-xs leading-5 text-forest/70">
              💡 Select multiple foods to build your complete plate.
            </p>
          </div>

          {error && (
            <p className="rounded-2xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
              {error}
            </p>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={resetPhoto}
              className="flex-1 rounded-2xl border border-forest/10 bg-card px-4 py-3 text-sm font-semibold text-forest"
            >
              ↩ Retake
            </button>

            <button
              type="button"
              onClick={analyze}
              className="flex-[2] rounded-2xl bg-forest px-4 py-3 text-sm font-semibold text-cream transition-transform active:scale-95"
            >
              ✨ Analyze plate
            </button>
          </div>
        </section>
      )}

      {!preview && error && (
        <p className="rounded-2xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
          {error}
        </p>
      )}

      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-leaf">
          From plate to insight
        </p>

        <div className="grid grid-cols-3 gap-2">
          <StepCard emoji="📸" title="Capture" />
          <StepCard emoji="🥗" title="Select" />
          <StepCard emoji="📊" title="Explore" />
        </div>
      </section>
    </div>
  )
}

function StepCard({ emoji, title }) {
  return (
    <div className="rounded-2xl bg-card p-4 text-center shadow-sm">
      <div className="text-2xl">{emoji}</div>

      <p className="mt-2 text-xs font-semibold text-forest">
        {title}
      </p>
    </div>
  )
}