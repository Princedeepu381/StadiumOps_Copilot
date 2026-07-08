import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();
dotenv.config({ path: '../.env' });

// Determine if we have a valid API key. If not, we will use mock AI responses.
const apiKey = process.env.GEMINI_API_KEY;
const isMock = !apiKey || apiKey === "YOUR_API_KEY" || apiKey.trim() === "";

if (isMock) {
  console.warn("⚠️ No GEMINI_API_KEY found or key is default. Using high-fidelity mock AI service.");
}

const ai = isMock ? null : new GoogleGenAI({ apiKey });
const MODEL_NAME = 'gemini-2.0-flash';

// Helper to call Gemini or fallback to mock
async function getGeminiResponse(prompt, systemInstruction = "", isJson = false) {
  if (isMock) {
    throw new Error("Mock Mode Active");
  }

  try {
    const config = {};
    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }
    if (isJson) {
      config.responseMimeType = "application/json";
    }

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: config
    });

    const text = response.text;
    if (isJson) {
      return JSON.parse(text);
    }
    return text;
  } catch (error) {
    console.error("Gemini API call failed, falling back to mock behavior:", error);
    throw error; // Let the caller catch and apply the specific mock fallback
  }
}

/**
 * AI Service Interfaces
 */

// 1. Open-ended Q&A Copilot Chat
export async function handleCopilotChat(chatHistory, userQuestion, stadiumState) {
  const systemInstruction = `You are StadiumOps Copilot, a helpful AI operations command center assistant for the FIFA World Cup 2026. 
You are grounded in the current live stadium state. 
Do not make up facts. Only answer based on the current state provided.
Keep your answers brief, professional, and action-oriented.
If the state shows critical issues (red) or watch items (yellow), prioritize explaining them first.
 staduimState: ${JSON.stringify(stadiumState)}`;

  const prompt = `Chat History: ${JSON.stringify(chatHistory)}
User Question: "${userQuestion}"`;

  try {
    return await getGeminiResponse(prompt, systemInstruction, false);
  } catch {
    // Mock Fallback
    return getMockChatResponse(userQuestion, stadiumState);
  }
}

// 2. Incident Recommendation Triage
export async function getIncidentRecommendation(incident, zone, transportAlerts, staffing) {
  const systemInstruction = `You are an AI Operations Triage Engine for the FIFA World Cup 2026. 
Analyze the provided incident, the zone status, transport alerts, and staffing levels.
Provide a structured JSON recommendation with the following fields:
- whatIsHappening: Short summary of the incident and context.
- whyItMatters: Assessment of operational impact (congestion, safety, logistics).
- recommendedAction: Specific action steps for staff to resolve it.
- suggestedOwnerRole: The role that should be assigned (e.g. "Volunteer Coordinator", "Accessibility Support Staff", "Operations Manager").
- announcementNeeded: Boolean flag indicating if a public announcement should be broadcasted to fans.`;

  const prompt = `Incident Details: ${JSON.stringify(incident)}
Zone Status: ${JSON.stringify(zone)}
Active Transport Alerts: ${JSON.stringify(transportAlerts)}
Staffing Levels: ${JSON.stringify(staffing)}`;

  try {
    return await getGeminiResponse(prompt, systemInstruction, true);
  } catch {
    // Mock Fallback
    return getMockIncidentRecommendation(incident, zone, transportAlerts);
  }
}

// 3. Multilingual Announcement Generator
export async function generateMultilingualAnnouncement(incidentContext) {
  const systemInstruction = `You are a Public Address (PA) and Communication Coordinator for the FIFA World Cup 2026. 
Create a clear, concise, and helpful public safety/informational announcement based on the incident context.
You must return a JSON object with:
- textEn: Announcement in English.
- textHi: Announcement in Hindi.
- textEs: Announcement in Spanish.
Ensure the meaning is identical and accurate across all three languages. The tone should be calm, clear, and instructional.`;

  const prompt = `Incident Context: ${JSON.stringify(incidentContext)}`;

  try {
    return await getGeminiResponse(prompt, systemInstruction, true);
  } catch {
    // Mock Fallback
    return getMockAnnouncement(incidentContext);
  }
}

// 4. Shift Handoff / Situation Summaries
export async function generateSituationSummary(windowName, recentLogs, openIncidents, openAccRequests, transportAlerts) {
  const systemInstruction = `You are StadiumOps Copilot. Generate a structured Operations Summary for the window: "${windowName}".
Include the following key sections in your response (formatted as markdown):
1. Key Highlights & Status
2. Open Critical Risks & Congestion Points
3. Recently Resolved Items
4. Recommended Focus Areas for Next Shift`;

  const prompt = `Recent Activity Log: ${JSON.stringify(recentLogs)}
Open Incidents: ${JSON.stringify(openIncidents)}
Open Accessibility Requests: ${JSON.stringify(openAccRequests)}
Active Transport Alerts: ${JSON.stringify(transportAlerts)}`;

  try {
    return await getGeminiResponse(prompt, systemInstruction, false);
  } catch {
    // Mock Fallback
    return getMockSummary(windowName, openIncidents, openAccRequests, transportAlerts);
  }
}

/**
 * Mock Fallbacks (used when API key is missing or calls fail)
 */

function getMockChatResponse(question, state) {
  const q = question.toLowerCase();
  
  if (q.includes("gate b") || q.includes("congestion")) {
    const gateB = state.zones.find(z => z.id === "zone-gateB");
    const activeAlert = state.transportAlerts.find(t => t.affectedZoneId === "zone-gateB");
    
    if (gateB && gateB.congestionLevel === "critical" || gateB.congestionLevel === "high") {
      return `**Live Status: Gate B Congestion Alert**
Gate B is currently experiencing **${gateB.congestionLevel.toUpperCase()}** congestion at **${gateB.capacityPercent}% capacity**.
*   **Triggering Event:** A shuttle delay of ${activeAlert?.estimatedDelayMinutes || 25} minutes on the East Shuttle Line has halted outbound crowd dispersion.
*   **Recommended Actions:** Reassign at least 3 volunteers from Gate A (low congestion) to redirect arrivals. Dispatch accessibility staff to Gate B to assist high-urgency wheelchair requests currently in queue.`;
    }
    return `Gate B is currently at **${gateB?.capacityPercent || 68}% capacity** with **${gateB?.congestionLevel || 'medium'}** congestion. No immediate alarms, but we are monitoring shuttle connections.`;
  }
  
  if (q.includes("accessibility") || q.includes("wheelchair")) {
    const openReqs = state.accessibilityRequests.filter(r => r.status !== "resolved");
    if (openReqs.length > 0) {
      return `There are currently **${openReqs.length} active accessibility requests** in the queue:
1.  **Wheelchair Assistance** at Gate A (Urgency: Standard, aging in queue).
2.  **Escort Escort** in North Concourse (Urgency: High).
Recommend assigning Amina Patel (Accessibility Staff, North Concourse) to the High Urgency request immediately.`;
    }
    return "All accessibility requests are currently resolved. Staff are in standby.";
  }

  if (q.includes("priority") || q.includes("highest")) {
    const openInc = state.incidents.filter(i => i.status !== "resolved");
    if (openInc.length > 0) {
      const top = openInc[0];
      return `The highest priority incident is **${top.id}** (${top.type} incident at ${top.zoneId === "zone-gateB" ? "Gate B" : "South Concourse"}) with **${top.severity.toUpperCase()}** severity. 
Description: "${top.description}". 
Triage recommends assigning an available Staff member and issuing a public announcement if crowd diversion is required.`;
    }
    return "All incidents are currently resolved. The stadium is operating normally.";
  }

  return `Stadium Operations is currently monitoring the match day. 
*   **Active Zones:** 6 zones monitored.
*   **Incidents:** ${state.incidents.filter(i => i.status !== 'resolved').length} open incidents.
*   **Accessibility:** ${state.accessibilityRequests.filter(r => r.status !== 'resolved').length} requests pending.
*   **Transport:** ${state.transportAlerts.length} delays active.
Ask me specifically about "Gate B congestion", "accessibility queue", or "highest priority" for details.`;
}

function getMockIncidentRecommendation(incident, zone, _transportAlerts) {
  const isGateB = incident.zoneId === "zone-gateB" || incident.description.toLowerCase().includes("gate b");
  
  if (isGateB) {
    return {
      whatIsHappening: "Severe crowd bottleneck developing at Gate B (East Entry) due to fans queuing up at the turnstiles.",
      whyItMatters: "High risk of crush congestion. High capacity (90%+) combined with shuttle arrival delays prevents crowd flow, causing a critical backup.",
      recommendedAction: "1. Temporarily pause East Shuttle arrivals. 2. Activate overflow gates B3 and B4. 3. Reassign 3 volunteers from Gate A to assist with queue management and direct fans to the overflow gates.",
      suggestedOwnerRole: "Operations Manager",
      announcementNeeded: true
    };
  }

  // Facilities leakage mock
  return {
    whatIsHappening: `Active ${incident.type} incident: "${incident.description}" at ${zone ? zone.name : "South Concourse"}.`,
    whyItMatters: "Creates safety/slipping hazard in high-traffic pedestrian walkway, potentially slowing down flow and causing minor local congestion.",
    recommendedAction: "1. Dispatch Facilities maintenance team to shut off local valve and clean water. 2. Place wet-floor warning signs. 3. Route pedestrian traffic away from the immediate leak.",
    suggestedOwnerRole: "Facilities Lead",
    announcementNeeded: false
  };
}

function getMockAnnouncement(incidentContext) {
  const isGateB = incidentContext.zoneId === "zone-gateB" || (incidentContext.description && incidentContext.description.toLowerCase().includes("gate b"));
  
  if (isGateB) {
    return {
      textEn: "Attention fans arriving at Gate B: due to heavy crowding, please follow directions from volunteers to access overflow turnstiles B3 and B4. Expect minor entry delays.",
      textHi: "गेट बी पर पहुंचने वाले दर्शकों ध्यान दें: भारी भीड़ के कारण, कृपया ओवरफ्लो टर्नस्टाइल बी3 और बी4 तक जाने के लिए स्वयंसेवकों के निर्देशों का पालन करें। प्रवेश में थोड़ी देरी की संभावना है।",
      textEs: "Atención a los aficionados que llegan a la Puerta B: debido a la gran afluencia, sigan las instrucciones de los voluntarios para acceder a los torniquetes de desborde B3 y B4. Se esperan ligeros retrasos."
    };
  }

  return {
    textEn: "Notice: Stadium Operations is currently resolving a minor service issue. Please proceed with caution and follow staff directions.",
    textHi: "सूचना: स्टेडियम संचालन वर्तमान में एक छोटी सेवा समस्या का समाधान कर रहा है। कृपया सावधानी बरतें और कर्मचारियों के निर्देशों का पालन करें।",
    textEs: "Aviso: Operaciones del Estadio está resolviendo actualmente un problema menor de servicio. Proceda con precaución y siga las instrucciones del personal."
  };
}

function getMockSummary(windowName, openIncidents, openAccRequests, transportAlerts) {
  const openIncList = openIncidents.map(i => `*   **[${i.severity.toUpperCase()}]** ${i.description} (${i.id})`).join("\n") || "*   None";
  const openAccList = openAccRequests.map(r => `*   **[${r.urgency.toUpperCase()}]** Wheelchair/escort support at Zone: ${r.zoneId} (${r.id})`).join("\n") || "*   None";
  const trnList = transportAlerts.map(t => `*   **${t.route}**: ${t.alertType} (${t.estimatedDelayMinutes}m delay)`).join("\n") || "*   None";

  return `# Stadium Operations Handoff Summary — ${windowName}

## 1. Key Highlights & Status
*   **Match Day State:** Active tournament operation. Gate B experienced a major congestion peak that is currently being mitigated.
*   **Staff Allocation:** Volunteers have been dynamically routed to assist Gate B. Other gates are normal.

## 2. Open Critical Risks & Congestion Points
${openIncList}

## 3. Active Transport Interruptions
${trnList}

## 4. Accessibility Queue Status
${openAccList}

## 5. Recommended Focus Areas for Next Shift
*   Monitor crowd dispersion at Gate B once the shuttle delay clears.
*   Clear the remaining accessibility escort request at North Concourse.
*   Confirm facilities team has completed wet-floor cleanup in the South Concourse.`;
}
