const dummyAIResposeObject = {
  "responseId": "sugg_8f3a1c2e",
  "contactId": "amzn-connect-contact-id-xyz",
  "clientId": "client_0042",
  "generatedAt": "2026-07-04T10:23:45Z",
  "triggerReason": "transcript_update",
  "triggerContext": {
    "transcriptSegmentId": "seg_0004",
    "detectedIntent": "password_reset",
    "keyEntities": ["employee_id", "login_failure"]
  },
  "suggestions": [
    {
        "suggestionId": "sugg_8f3a1c2e_1",
        "rank": 1,
        "title": "Password Reset Procedure",
        "category": "Authentication",
        "summary": "Guide the user to reset their password through the self-service portal.",
        "confidence": {
            "level": "High",
            "score": 0.91,
            "basis": "kb_match_and_ticket_precedent"
        },
        "detailedSteps": [
            { "stepNumber": 1, "instruction": "Navigate to portal.company.com" },
            { "stepNumber": 2, "instruction": "Click 'Forgot Password'" },
            { "stepNumber": 3, "instruction": "Enter employee ID and email" },
            { "stepNumber": 4, "instruction": "Follow email instructions" }
        ],
        "sources": {
            "knowledgeArticles": [
                {
                    "kbId": "KB0011",
                    "title": "Password Reset - Self Service",
                    "category": "Authentication",
                    "url": "https://yourinstance.service-now.com/kb_view.do?sysparm_article=KB0011",
                    "relevanceScore": 0.94,
                    "matchedExcerpt": "Users can reset their own password via the self-service portal without agent intervention.",
                    "viewCount": 1523,
                    "lastUpdated": "2026-05-12"
                },
                
                {
                    "kbId": "KB0024",
                    "title": "Account Lockout Troubleshooting",
                    "category": "Authentication",
                    "url": "https://yourinstance.service-now.com/kb_view.do?sysparm_article=KB0011",
                    "relevanceScore": 0.67,
                    "matchedExcerpt": "Users can reset their own password via the self-service portal without agent intervention.",
                    "viewCount": 892,
                    "lastUpdated": "2026-05-12"
                },

                {
                    "kbId": "KB0156",
                    "title": "Common Login Issues and Solutions",
                    "category": "Access",
                    "url": "https://yourinstance.service-now.com/kb_view.do?sysparm_article=KB0011",
                    "relevanceScore": 0.41,
                    "matchedExcerpt": "Users can reset their own password via the self-service portal without agent intervention.",
                    "viewCount": 2341,
                    "lastUpdated": "2026-05-12"
                }
            ],
            "previousTickets": [
                {
                    "ticketId": "INC0040213",
                    "shortDescription": "User unable to log in after 3 failed attempts",
                    "resolutionNotes": "Account was locked; unlocked via Active Directory and password reset.",
                    "resolvedAt": "2026-04-02",
                    "similarityScore": 0.87,
                    "url": "https://yourinstance.service-now.com/incident.do?sys_id=..."
                },

                {
                    "ticketId": "INC0060716",
                    "shortDescription": "User wanted his printers mapped",
                    "resolutionNotes": "Account was locked; unlocked via Active Directory and password reset.",
                    "resolvedAt": "2026-04-02",
                    "similarityScore": 0.31,
                    "url": "https://yourinstance.service-now.com/incident.do?sys_id=..."
                },
                
                {
                    "ticketId": "INC0080311",
                    "shortDescription": "Blue Screen of Death after powering on the laptop",
                    "resolutionNotes": "Account was locked; unlocked via Active Directory and password reset.",
                    "resolvedAt": "2026-04-02",
                    "similarityScore": 0.57,
                    "url": "https://yourinstance.service-now.com/incident.do?sys_id=..."
                }
            ]
        },
        "feedback": {
            "status": "pending",
            "submittedAt": null,
            "agentId": null
        }
    },

    {
        "suggestionId": "sugg_8f3a1c2e_1",
        "rank": 2,
        "title": "Check Account Lock Status",
        "category": "Authentication",
        "summary": "Verify if the account is locked due to multiple failed login attempts.",
        "confidence": {
            "level": "High",
            "score": 0.13,
            "basis": "kb_match_and_ticket_precedent"
        },
        "detailedSteps": [
            { "stepNumber": 1, "instruction": "Navigate to Active Directory" },
            { "stepNumber": 2, "instruction": "Search user and double click on user id" },
            { "stepNumber": 3, "instruction": "Go to Accounts tab" },
            { "stepNumber": 4, "instruction": "Check 'Unlock Account'" },
            { "stepNumber": 5, "instruction": "Save" }
        ],
        "sources": {
            "knowledgeArticles": [
                {
                    "kbId": "KB0024",
                    "title": "Account Lockout Troubleshooting",
                    "category": "Authentication",
                    "url": "https://yourinstance.service-now.com/kb_view.do?sysparm_article=KB0011",
                    "relevanceScore": 0.67,
                    "matchedExcerpt": "Users can reset their own password via the self-service portal without agent intervention.",
                    "viewCount": 892,
                    "lastUpdated": "2026-05-12"
                },

                {
                    "kbId": "KB0156",
                    "title": "Common Login Issues and Solutions",
                    "category": "Access",
                    "url": "https://yourinstance.service-now.com/kb_view.do?sysparm_article=KB0011",
                    "relevanceScore": 0.41,
                    "matchedExcerpt": "Users can reset their own password via the self-service portal without agent intervention.",
                    "viewCount": 2341,
                    "lastUpdated": "2026-05-12"
                }                
            ],
            "previousTickets": [
                {
                    "ticketId": "INC0060716",
                    "shortDescription": "User wanted his printers mapped",
                    "resolutionNotes": "Account was locked; unlocked via Active Directory and password reset.",
                    "resolvedAt": "2026-04-02",
                    "similarityScore": 0.31,
                    "url": "https://yourinstance.service-now.com/incident.do?sys_id=..."
                },
                
                {
                    "ticketId": "INC0080311",
                    "shortDescription": "Blue Screen of Death after powering on the laptop",
                    "resolutionNotes": "Account was locked; unlocked via Active Directory and password reset.",
                    "resolvedAt": "2026-04-02",
                    "similarityScore": 0.57,
                    "url": "https://yourinstance.service-now.com/incident.do?sys_id=..."
                }                
            ]
        },
        "feedback": {
            "status": "pending",
            "submittedAt": null,
            "agentId": null
        }
    },

    {
        "suggestionId": "sugg_8f3a1c2e_1",
        "rank": 3,
        "title": "VPN Connection Issue. Ask the user to check for the network connectivity at home. Ask the user to check for the network connectivity at home. Ask the user to check for the network connectivity at home. Ask the user to check for the network connectivity at home.",
        "category": "Authentication",
        "summary": "Ask the user to check for the network connectivity at home.",
        "confidence": {
            "level": "High",
            "score": 0.71,
            "basis": "kb_match_and_ticket_precedent"
        },
        "detailedSteps": [
            { "stepNumber": 1, "instruction": "Ask the user to power off the laptop" },
            { "stepNumber": 2, "instruction": "Ask the user to power off the router" },
            { "stepNumber": 3, "instruction": "Ask to wait for two minutes" },
            { "stepNumber": 4, "instruction": "Power on the router and wait till it boots up" },
            { "stepNumber": 5, "instruction": "Power on the laptop" },
            { "stepNumber": 6, "instruction": "Verify connecting to the VPN" }
        ],
        "sources": {
            "knowledgeArticles": [
                {
                    "kbId": "KB0011",
                    "title": "Password Reset - Self Service",
                    "category": "Authentication",
                    "url": "https://yourinstance.service-now.com/kb_view.do?sysparm_article=KB0011",
                    "relevanceScore": 0.94,
                    "matchedExcerpt": "Users can reset their own password via the self-service portal without agent intervention.",
                    "viewCount": 1523,
                    "lastUpdated": "2026-05-12"
                }
            ],
            "previousTickets": [
                {
                    "ticketId": "INC0040213",
                    "shortDescription": "User unable to log in after 3 failed attempts",
                    "resolutionNotes": "Account was locked; unlocked via Active Directory and password reset.",
                    "resolvedAt": "2026-04-02",
                    "similarityScore": 0.87,
                    "url": "https://yourinstance.service-now.com/incident.do?sys_id=..."
                }                
            ]
        },
        "feedback": {
            "status": "pending",
            "submittedAt": null,
            "agentId": null
        }
    }
  ],
  "metadata": {
    "modelVersion": "suggestion-engine-v1.3",
    "retrievalSet": "kb+tickets",
    "latencyMs": 812,
    "promptTokens": 2140,
    "completionTokens": 430
  }
}

export default dummyAIResposeObject;