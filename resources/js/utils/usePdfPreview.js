import { useCallback, useEffect, useRef, useState } from 'react'

export default function usePdfPreview() {
  const [state, setState] = useState({ open: false, url: null, filename: '' })
  const urlRef = useRef(null)

  const preview = useCallback(async (request, filename) => {
    const response = await request()
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
    urlRef.current = url
    setState({ open: true, url, filename })
  }, [])

  const close = useCallback(() => {
    if (urlRef.current) {
      window.URL.revokeObjectURL(urlRef.current)
      urlRef.current = null
    }
    setState({ open: false, url: null, filename: '' })
  }, [])

  // Release the blob URL if the component unmounts while a preview is still open.
  useEffect(() => () => {
    if (urlRef.current) window.URL.revokeObjectURL(urlRef.current)
  }, [])

  return { open: state.open, url: state.url, filename: state.filename, preview, close }
}
