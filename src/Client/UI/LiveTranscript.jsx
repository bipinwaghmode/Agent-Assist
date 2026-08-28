import React, { useState } from 'react'

const LiveTranscript = ({dummyLiveTranscriptObject, quickResponses}) => {
  const [selectedQuickResponse, setSelectedQuickResponse] = useState({"id": "qr_goodbye_survey", "label": "Goodbye + Survey", "text": "It was pleasure working with you. Please do take time to return the survey. Thank you for calling (process name) and have a great day ahead!"});

  const handleQuickResponseSelect = (selectedQuickResponse) => {
    setSelectedQuickResponse(selectedQuickResponse);
  }

  return (
    <>
      <div className="bg-card rounded-xl mt-5 p-5 h-75 overflow-y-auto flex flex-col justify-between">
        <ul className="overflow-y-auto pr-1">
          {
            dummyLiveTranscriptObject.segments.map(
              (currentSegment) => {
                return(
                  <li key={`${currentSegment.segmentId}${currentSegment.sequence}`} className="py-2">
                    <div>{currentSegment.speaker==="AGENT" ? <span className="rounded-4xl bg-blue-50 text-blue-950 font-body px-3 py-2">A</span> : <span className="rounded-4xl bg-neutral-100 text-neutral-950 font-body px-3 py-2">C</span>}&nbsp;<span className="font-literal text-mutedText">{currentSegment.isPartial ? "Transcribing..." : new Date(currentSegment.startTime).toTimeString().split(" ")[0]}</span></div>
                    <div className={currentSegment.isPartial ? "px-10 pb-4 border-b border-b-[#dedee0] font-body text-mutedText" : "px-10 pb-4 border-b border-b-[#dedee0] font-body text-ink"}>{currentSegment.text}</div>
                  </li>
                );
              }
            )
          }
        </ul>
        <div className="font-literal text-center text-[#A8ADB6] pt-2"><span className="text-confidenceHigh text-5xl leading-px">.</span>Live transcription active</div>
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