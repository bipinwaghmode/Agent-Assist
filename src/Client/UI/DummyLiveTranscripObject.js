const dummyLiveTranscriptObject = {
  "contactId": "amzn-connect-contact-id-xyz",
  "clientId": "client_0042",
  "channel": "voice",
  "status": "active",
  "startedAt": "2026-07-04T10:23:10Z",
  "endedAt": null,
  "participants": [
    { "participantId": "p_agent", "role": "AGENT", "displayName": "Tina" },
    { "participantId": "p_customer", "role": "CUSTOMER", "displayName": "Customer" }
  ],
  "segments": [
    {
        "segmentId": "seg_0001",
        "sequence": 1,
        "speaker": "AGENT",
        "text": "Hello, this is Tina from the Service Desk. How can I help you today?",
        "startTime": "2026-07-04T10:23:15Z",
        "endTime": "2026-07-04T10:23:21Z",
        "isPartial": false,
        "asrConfidence": 0.97,
        "sentiment": "NEUTRAL"
    },
    {
        "segmentId": "seg_0001",
        "sequence": 2,
        "speaker": "CUSTOMER",
        "text": "Hi, I am having trouble logging into my account.",
        "startTime": "2026-07-04T10:23:22Z",
        "endTime": "2026-07-04T10:23:34Z",
        "isPartial": false,
        "asrConfidence": 0.91,
        "sentiment": "NEUTRAL"
    },
    {
        "segmentId": "seg_0001",
        "sequence": 3,
        "speaker": "AGENT",
        "text": "I can help you with that. Can you help me with your employee ID?",
        "startTime": "2026-07-04T10:23:35Z",
        "endTime": "2026-07-04T10:23:41Z",
        "isPartial": false,
        "asrConfidence": 0.93,
        "sentiment": "NEUTRAL"
    },
    {
        "segmentId": "seg_0001",
        "sequence": 4,
        "speaker": "CUSTOMER",
        "text": "Sure, it's EMP-4729",
        "startTime": "2026-07-04T10:23:42Z",
        "endTime": "2026-07-04T10:23:44Z",
        "isPartial": true,
        "asrConfidence": 0.99,
        "sentiment": "FRUSTRATED"
    }
  ],
  "lastUpdatedAt": "2026-07-04T10:23:42Z"
}

const quickResponses = {
  "quickResponses": [
    { "id": "qr_hello", "label": "Hello", "text": "Hello! Thanks for reaching out to (process name). How may I help you today?" },
    { "id": "qr_one_moment", "label": "One moment", "text": "One moment please while I look into this." },
    { "id": "qr_disconnect", "label": "In case of disconnect", "text": "If we get disconnected, I'll call you back at (client phone number)" },
    { "id": "qr_not_responding", "label": "User not responding", "text": "As I have not heard any response from your side for a while, I am disconnecting the call." },
    { "id": "qr_check_colleagues", "label": "Check with colleagues", "text": "Can I put you on mute for a minute. I need to check this with my colleague." },
    { "id": "qr_goodbye_survey", "label": "Goodbye + Survey", "text": "It was pleasure working with you. Please do take time to return the survey. Thank you for calling (process name) and have a great day ahead!" },
    { "id": "qr_goodbye", "label": "Goodbye", "text": "Thank you for calling (process name) and have a great day ahead!" }
  ]
}

export default dummyLiveTranscriptObject;
export {quickResponses};