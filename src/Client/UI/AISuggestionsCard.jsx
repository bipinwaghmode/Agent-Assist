import React from "react";
import DetailedTSSteps from "./DetailedTSSteps";
import KBArticlesCard from "./KBArticlesCard";
import PreviousTicketsCard from "./PreviousTicketsCard";

const AISuggestionsCard = ({aiSuggestion}) => {
    return(
        <>
            <div className="flex flex-row justify-between">
                <span className="font-body text-ink pr-5">{aiSuggestion.title}</span>
                {aiSuggestion.confidence.score>=0.8 ? 
                    <span className="text-confidenceHigh text-5xl leading-px">...</span> : 
                    (aiSuggestion.confidence.score>=0.5 ? 
                        <span className="text-confidenceMedium text-5xl leading-px">..<span className="text-canvas text-5xl leading-px">.</span></span> : 
                        <span className="text-confidenceLow text-5xl leading-px">.<span className="text-canvas text-5xl leading-px">..</span></span>
                    )
                }            
            </div> <br />

            <span className="font-body text-mutedText">{aiSuggestion.summary}</span> <br /> <br />

            <details className="group">
                <summary className="flex items-center font-body text-accent cursor-pointer list-none gap-2">
                    <svg 
                        className="w-5 h-5 text-accent transition-transform duration-200 group-open:rotate-90" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 5l7 7-7 7" 
                        />
                    </svg>
                    <span>Show Detailed Steps</span>
                </summary>

                <DetailedTSSteps detailedSteps={aiSuggestion.detailedSteps} />
            </details><br />

            <div className="font-body text-mutedText text-sm border-t border-[#dedee0] pt-1">REFERENCED SOURCES</div> <br />

            <details className="group">
                <summary className="flex items-center font-body text-accent cursor-pointer list-none gap-2">
                    <svg 
                        className="w-5 h-5 text-accent transition-transform duration-200 group-open:rotate-90" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 5l7 7-7 7" 
                        />
                    </svg>
                    <span>Referred Knowledge Base Articles</span>
                </summary>

                <ol className="text-mutedText font-literal pl-7 pt-1">
                    {
                        aiSuggestion.sources.knowledgeArticles.map((currentArticle) => {
                            return(
                                <li key={currentArticle.kbId}>
                                    <KBArticlesCard KBArticle={currentArticle} />
                                </li>
                            );
                        })
                    }
                </ol>
            </details>
            
            <details className="group">
                <summary className="flex items-center font-body text-accent cursor-pointer list-none gap-2">
                    <svg 
                        className="w-5 h-5 text-accent transition-transform duration-200 group-open:rotate-90" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 5l7 7-7 7" 
                        />
                    </svg>
                    <span>Referred Incident Tickets</span>
                </summary>

                <ol className="text-mutedText font-literal pl-7 pt-1">
                    {
                        aiSuggestion.sources.previousTickets.map((currentPreviousTicket) => {
                            return(
                                <li key={currentPreviousTicket.ticketId} className={(currentPreviousTicket.similarityScore>=0.8) ? "border border-[#dedee0] rounded-md shadow-[-3px_0_0px_0px_#2F9E68] my-1 pl-2" : (currentPreviousTicket.similarityScore>=0.5 ? "border border-[#dedee0] rounded-md shadow-[-3px_0_0px_0px_#C98A2B] my-1 pl-2" : "border border-[#dedee0] rounded-md shadow-[-3px_0_0px_0px_#B4483D] my-1 pl-2")}>
                                    <PreviousTicketsCard previousTicket={currentPreviousTicket} />
                                </li>
                            );
                        })
                    }
                </ol>
            </details>
            

        </>
    );
}

export default AISuggestionsCard;