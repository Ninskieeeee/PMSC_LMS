import { useEffect, useRef, useState } from 'react'
import jsQR from 'jsqr'
import { Camera, CheckCircle2, AlertTriangle, XCircle, ScanLine } from 'lucide-react'
import api from '../../utils/api'
import { formatDateTime } from '../../utils/helpers'

const FEEDBACK_STYLES = {
  success: { border: 'border-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle2 },
  duplicate: { border: 'border-amber-500', bg: 'bg-amber-50', text: 'text-amber-700', icon: AlertTriangle },
  unknown: { border: 'border-red-500', bg: 'bg-red-50', text: 'text-red-700', icon: XCircle },
}

export default function Scanner() {
  const [events, setEvents] = useState([])
  const [eventId, setEventId] = useState('')
  const [scanning, setScanning] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [log, setLog] = useState([])
  const [cameraError, setCameraError] = useState('')

  const videoRef = useRef(null)
  const canvasRef = useRef(document.createElement('canvas'))
  const streamRef = useRef(null)
  const frameRef = useRef(null)
  const processingRef = useRef(false)
  const cooldownRef = useRef(false)

  useEffect(() => {
    api.get('/ssg/events').then((res) => setEvents(res.data))
  }, [])

  useEffect(() => () => stopCamera(), [])

  async function startCamera() {
    setCameraError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setScanning(true)
      frameRef.current = requestAnimationFrame(tick)
    } catch {
      setCameraError('Unable to access the camera. Check permissions and try again.')
    }
  }

  function stopCamera() {
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setScanning(false)
  }

  function tick() {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (video && video.readyState === video.HAVE_ENOUGH_DATA && !processingRef.current && !cooldownRef.current) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height)

      if (code?.data) {
        handleScan(code.data)
      }
    }

    frameRef.current = requestAnimationFrame(tick)
  }

  async function handleScan(code) {
    if (!eventId) return
    processingRef.current = true
    try {
      const { data } = await api.post('/ssg/attendance/scan', { event_id: eventId, code })
      setFeedback({ type: 'success', message: 'Attendance recorded.', student: data.student })
      setLog((prev) => [{ id: Date.now(), type: 'success', student: data.student, time: new Date().toISOString() }, ...prev])
    } catch (err) {
      if (err.response?.status === 409) {
        setFeedback({ type: 'duplicate', message: 'Already scanned for this event.', student: err.response.data.student })
        setLog((prev) => [{ id: Date.now(), type: 'duplicate', student: err.response.data.student, time: new Date().toISOString() }, ...prev])
      } else {
        setFeedback({ type: 'unknown', message: 'Unrecognized QR code.', student: null })
        setLog((prev) => [{ id: Date.now(), type: 'unknown', student: null, code, time: new Date().toISOString() }, ...prev])
      }
    } finally {
      cooldownRef.current = true
      setTimeout(() => {
        cooldownRef.current = false
        processingRef.current = false
        setFeedback(null)
      }, 2500)
    }
  }

  const style = feedback ? FEEDBACK_STYLES[feedback.type] : null
  const FeedbackIcon = style?.icon

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Attendance Scanner</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400">Scan a student's QR code to record event attendance.</p>
      </div>

      <div className="max-w-xs">
        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-slate-300">Event</label>
        <select
          value={eventId}
          onChange={(e) => { setEventId(e.target.value); stopCamera() }}
          className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        >
          <option value="">Select an event…</option>
          {events.map((event) => <option key={event.id} value={event.id}>{event.name}</option>)}
        </select>
      </div>

      {cameraError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{cameraError}</p>}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-slate-700 bg-black">
          <video ref={videoRef} className="aspect-video w-full object-cover" muted playsInline />
          {!scanning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 text-white">
              <Camera size={32} />
              <button
                type="button"
                onClick={startCamera}
                disabled={!eventId}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
              >
                {eventId ? 'Start Scanner' : 'Select an event first'}
              </button>
            </div>
          )}
          {scanning && (
            <button
              type="button"
              onClick={stopCamera}
              className="absolute bottom-3 right-3 rounded-lg bg-white dark:bg-slate-900/90 px-3 py-1.5 text-xs font-medium text-gray-800 dark:text-slate-100 hover:bg-white dark:bg-slate-900"
            >
              Stop Scanner
            </button>
          )}
          {style && FeedbackIcon && (
            <div className={`absolute inset-x-3 top-3 flex items-center gap-2 rounded-lg border-2 ${style.border} ${style.bg} px-3 py-2 text-sm font-medium ${style.text}`}>
              <FeedbackIcon size={18} />
              <span>
                {feedback.message}
                {feedback.student && ` — ${feedback.student.user?.name}`}
              </span>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-slate-100">
            <ScanLine size={16} /> Session Scan Log
          </h2>
          {log.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-slate-500">No scans yet this session.</p>
          ) : (
            <div className="max-h-96 space-y-2 overflow-y-auto">
              {log.map((entry) => {
                const entryStyle = FEEDBACK_STYLES[entry.type]
                return (
                  <div key={entry.id} className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${entryStyle.bg}`}>
                    <div>
                      <p className={`font-medium ${entryStyle.text}`}>
                        {entry.student?.user?.name ?? entry.code ?? 'Unknown code'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">{formatDateTime(entry.time)}</p>
                    </div>
                    <span className={`text-xs font-semibold uppercase ${entryStyle.text}`}>{entry.type}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
