import React, { useEffect, useRef, useState } from 'react'

const LiveTranscript = ({ segments, connected, callEnded, replaced, quickResponses }) => {
  const [selectedQuickResponse, setSelectedQuickResponse] = useState({"id": "qr_goodbye_survey", "label": "Goodbye + Survey", "text": "It was pleasure working with you. Please do take time to return the survey. Thank you for calling (process name) and have a great day ahead!"});
  const listRef = useRef(null)
  const stickToBottom = useRef(true)
  const [showJump, setShowJump] = useState(false)

  const handleQuickResponseSelect = (qr) => setSelectedQuickResponse(qr)

  // The scroll position alone decides whether the button shows.
  const handleScroll = () => {
    const el = listRef.current
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40
    stickToBottom.current = atBottom
    setShowJump(!atBottom)
  }

  // New segments: follow the newest line only if the user is already at the bottom.
  useEffect(() => {
    const el = listRef.current
    if (!el) return
    if (stickToBottom.current) el.scrollTop = el.scrollHeight
  }, [segments])

  const jumpToLatest = () => {
    const el = listRef.current
    el.scrollTop = el.scrollHeight
    stickToBottom.current = true
    setShowJump(false)
  }

  const live = connected && !callEnded && segments.length > 0
  const statusText = replaced ? 'Open in another tab'
    : !connected ? 'Reconnecting...'
    : callEnded ? 'Call ended'
    : segments.length ? 'Live transcription active'
    : 'Waiting for a call'

  return (
    <>
      <div className="relative bg-card rounded-xl mt-5 p-5 h-75 overflow-hidden flex flex-col justify-between">
        <ul ref={listRef} onScroll={handleScroll} className="flex-1 min-h-0 overflow-y-auto pr-1">
          {segments.length === 0 && (
            <li className="py-2 font-body text-mutedText">Waiting for the call transcript...</li>
          )}
          {segments.map((currentSegment) => (
            <li key={currentSegment.segmentId} className="py-2">
              <div>
                {currentSegment.speaker === "AGENT"
                  ? <span className="rounded-4xl bg-blue-50 text-blue-950 font-body px-3 py-2">A</span>
                  : <span className="rounded-4xl bg-neutral-100 text-neutral-950 font-body px-3 py-2">C</span>}
                &nbsp;
                <span className="font-literal text-mutedText">
                  {currentSegment.isPartial ? "Transcribing..." : new Date(currentSegment.beginTime).toTimeString().split(" ")[0]}
                </span>
              </div>
              <div className={currentSegment.isPartial
                ? "px-10 pb-4 border-b border-b-[#dedee0] font-body text-mutedText"
                : "px-10 pb-4 border-b border-b-[#dedee0] font-body text-ink"}>
                {currentSegment.text}
              </div>
            </li>
          ))}
        </ul>
        {showJump && (
          <button
          onClick={jumpToLatest}
          aria-label="Jump to latest"
          title="Jump to latest"
          className="absolute bottom-12 left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-accent text-card hover:opacity-90 cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M8 3v10M3.5 8.5L8 13l4.5-4.5" />
            </svg>
          </button>
        )}
        <div className="font-literal text-center text-[#A8ADB6] pt-2">
          <span className={`${live ? 'text-confidenceHigh' : 'text-mutedText'} text-5xl leading-px`}>.</span>{statusText}
        </div>
      </div>

      <div className="rounded-xl mt-5 p-5 flex flex-wrap gap-2">
        {
          quickResponses.quickResponses.map(
            (currentQuickRespose) => {
              return(
                <span key={currentQuickRespose.id} onClick={() => {handleQuickResponseSelect(currentQuickRespose)}} className={currentQuickRespose.id===selectedQuickResponse.id ? "cursor-pointer border bg-accent text-card px-3 py-1 rounded-2xl font-body inline-block hover:opacity-90" : "cursor-pointer border text-mutedText px-3 py-1 rounded-2xl font-body inline-block hover:bg-card"}>{currentQuickRespose.label}</span>
              );
            }
          )
        }
      </div>
      <div className="bg-card rounded-xl mt-5 p-5 font-literal text-mutedText h-23 overflow-y-auto">
        {selectedQuickResponse.text}
      </div>
    </>
  )
}

export default LiveTranscript