import React from 'react'

const PreviousTicketsCard = ({previousTicket}) => {
  return (
    <>
      <span className="inline-flex items-center gap-1.5 align-middle">
        <svg 
          className="w-3.5 h-3.5 shrink-0" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M3 5h18v14H3V5zm5 0v14"
          />
        </svg>
        
        <span>
          {previousTicket.ticketId} — {previousTicket.shortDescription}
        </span>
      </span>
      {/* Similarity Score : {(previousTicket.similarityScore>=0.8) ? <span className="text-green-700">High</span> : (previousTicket.similarityScore>=0.5) ? <span className="text-orange-600">Medium</span> : <span className="text-yellow-500">Low</span>} */}
    </>
  )
}

export default PreviousTicketsCard