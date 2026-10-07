import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { analyzePlate, saveMeal } from '../services/nutrition'

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

  useEffect(() => {
    return () => stopCamera()
  }, [])

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
    reader.onload = () => setPreview(String(reader.result))
    reader.readAsDataURL(file)
    stopCamera()
  }

  function analyze() {
    if (!preview) {
      setError('Capture or upload a plate photo first.')
      return
    }
    setBusy(true)
    const analysis = analyzePlate(preview)
    saveMeal(analysis)
    sessionStorage.setItem('annamitra-latest', JSON.stringify(analysis))
    navigate('/results')
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-3xl text-forest">Scan food</h1>
        <p className="mt-1 text-sm text-ink/70">
          Point the camera at a thali, or choose an image from your gallery.
        </p>
      </header>

      <div className="overflow-hidden rounded-3xl bg-forest">
        {preview ? (
          <img src={preview} alt="Selected plate" className="aspect-[4/5] w-full object-cover" />
        ) : (
          <video
            ref={videoRef}
            className={`aspect-[4/5] w-full object-cover ${cameraOn ? 'block' : 'hidden'}`}
            playsInline
            muted
          />
        )}
        {!preview && !cameraOn && (
          <div className="flex aspect-[4/5] flex-col items-center justify-center gap-2 px-6 text-center text-cream">
            <p className="font-display text-2xl">Ready when you are</p>
            <p className="text-sm text-cream/70">Camera needs permission on first use.</p>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />

      {error && <p className="rounded-2xl bg-terracotta/15 px-4 py-3 text-sm text-terracotta">{error}</p>}

      <div className="grid grid-cols-2 gap-3">
        {cameraOn ? (
          <button
            type="button"
            onClick={captureFrame}
            className="rounded-full bg-turmeric px-4 py-3 text-sm font-semibold"
          >
            Capture
          </button>
        ) : (
          <button
            type="button"
            onClick={startCamera}
            className="rounded-full bg-forest px-4 py-3 text-sm font-semibold text-cream"
          >
            Open camera
          </button>
        )}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="rounded-full border border-forest/20 bg-card px-4 py-3 text-sm font-semibold"
        >
          Upload image
        </button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFile} />

      {preview && (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setPreview('')}
            className="flex-1 rounded-full border border-forest/20 px-4 py-3 text-sm font-semibold"
          >
            Retake
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={analyze}
            className="flex-1 rounded-full bg-terracotta px-4 py-3 text-sm font-semibold text-cream disabled:opacity-60"
          >
            {busy ? 'Analyzing…' : 'Analyze plate'}
          </button>
        </div>
      )}
    </div>
  )
}
