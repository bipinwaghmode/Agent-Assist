import React from 'react'
import AISuggestionsCard from "./AISuggestionsCard";

const AISuggestions = ({aiSuggestionsArray}) => {
  return (
    <>
      {
        aiSuggestionsArray.map((currentAISuggestion) => {
          return(
            <div key={currentAISuggestion.rank} className={currentAISuggestion.confidence.score>=0.8 ? "w-full bg-card rounded-xl shadow-[-3px_0_0px_0px_#2F9E68] p-5 mt-5" : (currentAISuggestion.confidence.score>=0.5 ? "w-full bg-card rounded-xl shadow-[-3px_0_0px_0px_#C98A2B] p-5 mt-5" : "w-full bg-card rounded-xl shadow-[-3px_0_0px_0px_#B4483D] p-5 mt-5")}>
              <AISuggestionsCard aiSuggestion={currentAISuggestion}/>
            </div>
          );
        })
      }
    </>
  )
}

export default AISuggestions