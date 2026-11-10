import { useEffect, useState } from 'react'

export function upsertSegment(prev, seg) {
  const i = prev.findIndex((s) => s.segmentId === seg.segmentId)
  if (i === -1) return [...prev, seg]                      // new line, appended
  if (!prev[i].isPartial && seg.isPartial) return prev     // a partial never overwrites a final
  const next = prev.slice()
  next[i] = seg                                            // patched in place, same position
  return next
}

export function useTranscriptSocket(agentId) {
  const [segments, setSegments] = useState([])
  const [contactId, setContactId] = useState(null)
  const [callEnded, setCallEnded] = useState(false)
  const [connected, setConnected] = useState(false)
  const [replaced, setReplaced] = useState(false)

  useEffect(() => {
    let ws
    let retryTimer
    let attempts = 0
    let cancelled = false

    const connect = () => {
      ws = new WebSocket(`ws://localhost:8080/ws/transcript?agentId=${encodeURIComponent(agentId)}`)

      ws.onopen = () => { attempts = 0; setConnected(true); setReplaced(false) }

      ws.onmessage = (e) => {
        const msg = JSON.parse(e.data)
        if (msg.type === 'session_start') {
          setSegments([])
          setContactId(msg.contactId)
          setCallEnded(false)
        } else if (msg.type === 'segment_update') {
          setSegments((prev) => upsertSegment(prev, msg.segment))
        } else if (msg.type === 'session_end') {
          setCallEnded(true)
        }
      }

      ws.onclose = (e) => {
        setConnected(false)
        if (cancelled) return
        if (e.code === 4000) { setReplaced(true); return }   // another tab took over: don't fight it
        retryTimer = setTimeout(connect, Math.min(1000 * 2 ** attempts++, 10000))
      }
    }

    connect()
    return () => { cancelled = true; clearTimeout(retryTimer); ws?.close() }
  }, [agentId])

  return { segments, contactId, callEnded, connected, replaced }
}