import React from 'react'

const DetailedTSSteps = ({detailedSteps}) => {
  return (
    <ol className="list-decimal list-inside font-literal text-mutedText pl-7 pt-1">
        {
            detailedSteps.map((currentStep)=>{
                    return(<li key={currentStep.stepNumber}>{currentStep.instruction}</li>);
                }
            )
        }
    </ol>
  )
}

export default DetailedTSSteps