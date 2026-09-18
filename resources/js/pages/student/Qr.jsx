import { useEffect, useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'
import QRCode from 'qrcode'
import { Download } from 'lucide-react'
import api from '../../utils/api'
import { useAuth } from '../../context/AuthContext'

export default function Qr() {
  const { role } = useAuth()
  const [qrCode, setQrCode] = useState('')
  const [loading, setLoading] = useState(true)
  const canvasRef = useRef(null)

  useEffect(() => {
    if (role === 'parent') return
    api.get('/student/qr').then((res) => setQrCode(res.data.qr_code)).finally(() => setLoading(false))
  }, [role])

  useEffect(() => {
    if (qrCode && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, qrCode, { width: 260, margin: 2 })
    }
  }, [qrCode])

  if (role === 'parent') {
    return <Navigate to="/student" replace />
  }

  function download() {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `${qrCode}-qr.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">My QR Code</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400">Present this code for event attendance scanning.</p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500 dark:text-slate-400">Loading…</p>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8">
          <canvas ref={canvasRef} className="rounded-lg border border-gray-100 dark:border-slate-800" />
          <p className="font-mono text-sm text-gray-600 dark:text-slate-300">{qrCode}</p>
          <button
            type="button"
            onClick={download}
            className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            <Download size={15} /> Download PNG
          </button>
        </div>
      )}
    </div>
  )
}
