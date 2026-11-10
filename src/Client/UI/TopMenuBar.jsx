import React, { useState } from 'react'
import dummyAIResposeObject from "./DummyAIResposeObject"
import AISuggestions from "./AISuggestions"
import LiveTranscript from './LiveTranscript';
import {quickResponses} from './DummyLiveTranscripObject';
import { useTranscriptSocket } from './useTranscriptSocket';

const TopMenuBar = () => {
    const [keys, setKeys] = useState(
        ["AI Suggestions",
        "Transcript"
        ]
    );

    const { segments, callEnded, connected, replaced } = useTranscriptSocket('agent-1');   // hardcoded until auth exists

    const [selectedKey, setSelectedKey] = useState("AI Suggestions");

    const handleClick = (selectedKey) => {
        setSelectedKey(selectedKey);
    }

    return (
        <div className="flex flex-col min-h-screen w-full items-center bg-card">
            <div className="flex flex-col w-1/2 border border-[#dedee0] rounded-xl my-5">

                {/* <div className="" id="activeConnections"> */}
                    <ol className="flex flex-row justify-evenly text-card bg-card max-w-full h-16 border-b-[#dedee0] border-[0.5px] rounded-t-xl p-2.5">
                        {
                            keys.map((currentKey)=>{
                                    return(<li key={currentKey} onClick={() => {handleClick(currentKey)}} className={currentKey===selectedKey ? "cursor-pointer bg-accent text-card min-w-[48%] py-2 text-center rounded-xl font-headers font-medium" : "cursor-pointer text-mutedText min-w-[48%] py-2 text-center rounded-xl font-headers font-medium hover:bg-canvas"}>{currentKey}</li>)
                                }
                            )
                        }
                    </ol>
                {/* </div> */}
            
                <div className="bg-canvas px-5 pb-5 rounded-b-xl">
                    {
                        (selectedKey==="AI Suggestions") ? <AISuggestions aiSuggestionsArray={dummyAIResposeObject.suggestions} /> : <LiveTranscript segments={segments} connected={connected} callEnded={callEnded} replaced={replaced} quickResponses={quickResponses} />
                    }
                </div>
            </div>
        </div>
    );
}

export default TopMenuBar