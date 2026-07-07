# StadiumOps Copilot — Documentation Pack
### Challenge 4: Smart Stadiums & Tournament Operations — FIFA World Cup 2026

---

# 1. PRD — Product Requirements Document

## 1.1 Product Summary

StadiumOps Copilot is an AI-powered operations command center for FIFA World Cup 2026 match days. It gives operations managers, volunteer coordinators, accessibility staff, and public communications teams a single live view of crowd congestion, incidents, accessibility requests, and transport disruptions — plus a GenAI copilot that explains what's happening, why it matters, and what to do next, in seconds instead of minutes.

It is not a chatbot bolted onto a dashboard. It is an operations dashboard where the AI is a first-class operator: reading the same live state as the humans, prioritizing across modules, and producing decision-ready outputs (recommendations, multilingual announcements, shift summaries).

## 1.2 Problem Statement

World Cup stadiums run at a scale and complexity that outstrips what human staff can track manually:

- Multiple zones/gates generating congestion signals simultaneously.
- Incidents (medical, crowd, security, facilities) arriving faster than staff can triage.
- Accessibility requests (wheelchair escort, medical assistance, accessible routing) competing for the same limited staff.
- Transport disruptions (shuttle delays, road closures) that ripple into crowd behavior at gates.
- A multilingual fanbase that needs the same critical information in multiple languages, fast, and consistently worded.

The result: slow triage, inconsistent announcements, staff overload, and degraded fan experience — with real safety implications at stadium scale.

## 1.3 Why This Matters for FIFA World Cup 2026 Specifically

- 2026 is the first 48-team World Cup, spread across 16 stadiums in 3 countries, with larger and more diverse crowds per venue than prior tournaments.
- Fans will speak dozens of languages; official communication in only English (or English + host-country language) leaves large fan segments uninformed during disruptions.
- Cross-border logistics (shuttle/transit across US/Mexico/Canada venues) raise the odds of transport disruption cascading into crowd congestion.
- Tournament-scale operations centers are usually staffed by a mix of paid staff and volunteers with uneven experience — an AI copilot standardizes decision quality regardless of who is on shift.

## 1.4 Target Users / Personas

| Persona | Primary Need | Key Frustration Today |
|---|---|---|
| Stadium Operations Manager | Live, prioritized visibility across all zones and incident types | Fragmented radio calls, spreadsheets, no single source of truth |
| Volunteer Coordinator | Know who's free, who's overloaded, and where to route new tasks | Manual headcount tracking, no task-to-capacity matching |
| Accessibility Support Staff | Track and prioritize wheelchair/escort/medical assistance requests | Requests get lost or delayed behind non-urgent items |
| Public Communications / Venue Ops Staff | Fast, accurate, multilingual announcements | Manual translation is slow and inconsistent under pressure |

## 1.5 Key Pain Points

1. No unified real-time view of crowd + incidents + accessibility + transport.
2. Manual prioritization under time pressure leads to inconsistent decisions.
3. Multilingual communication is a bottleneck during fast-moving disruptions.
4. Shift handoffs lose context ("what happened in the last 30 minutes?").
5. Volunteer/staff allocation is reactive, not recommended.

## 1.6 Product Goals

- Give operations staff a single command-center view of stadium state.
- Use GenAI to prioritize, explain, and recommend — not just summarize.
- Cut time-to-decision and time-to-announcement during disruptions.
- Make accessibility requests a first-class, trackable workflow, not an afterthought.
- Produce consistent, correct multilingual public communication.
- Be demoable end-to-end in a realistic match-day scenario.

## 1.7 Non-Goals (MVP)

- No real CCTV / computer vision crowd detection.
- No real ticketing system integration.
- No production-grade authentication or multi-tenant security.
- No real SMS/push notification delivery (simulated only).
- No support for arbitrary/unlimited languages (3 for MVP).
- No mobile native app — responsive web only.

## 1.8 MVP Scope

**In scope:** live dashboard, incidents module, accessibility module, AI copilot + recommendations, multilingual announcement generator (EN/HI/ES), shift/handoff summaries, seeded/simulated data, realistic demo scenarios.

**Out of scope:** listed in 1.7.

## 1.9 Detailed Feature List

| # | Feature | Description |
|---|---|---|
| F1 | Live Ops Dashboard | Zone health grid, incident feed, accessibility queue, transport alerts, staffing load — single screen |
| F2 | AI Ops Copilot (chat) | Natural-language Q&A grounded in current simulated state |
| F3 | Incident Prioritization Engine | Ranks open incidents by severity × impact × time-open; explains ranking |
| F4 | Action Recommendation | For each incident: what's happening, why it matters, recommended action, who should handle it, whether a public announcement is warranted |
| F5 | Accessibility Request Workflow | Log, track, prioritize, and resolve wheelchair/escort/restroom/medical requests |
| F6 | Multilingual Announcement Generator | Generates EN/HI/ES versions of a public announcement from an event/incident context |
| F7 | Shift & Situation Summaries | "Last 30 minutes," "incident handoff," "zone status" generated summaries |
| F8 | Staffing/Volunteer Load View | Simple capacity signal per zone to support task routing recommendations |
| F9 | Seeded Scenario Engine | Deterministic simulated data + scripted scenario events for demo reliability |

## 1.10 User Stories

- As an Operations Manager, I want a prioritized incident list so I can act on the highest-risk issue first.
- As an Operations Manager, I want an AI summary of the current stadium situation so I can brief my team in under a minute.
- As a Volunteer Coordinator, I want to see which zones are understaffed so I can reassign volunteers before congestion worsens.
- As Accessibility Staff, I want wheelchair/escort requests automatically prioritized by wait time and urgency so no request is silently delayed.
- As Public Comms Staff, I want a one-click bilingual/trilingual announcement generated from an incident so I can publish accurate information fast.
- As any staff member, I want a "last 30 minutes" summary at shift handoff so I don't lose context.

## 1.11 Success Criteria

- A judge can watch a 3–5 minute demo and see: an incident occur → AI prioritize it → AI recommend action + owner → AI generate a multilingual announcement → dashboard reflect resolution.
- Every AI output is explainable (shows *why*, not just *what*).
- Accessibility requests never disappear from view unresolved.
- Multilingual announcements are consistent in meaning across all 3 languages.
- App remains usable and legible under simulated "peak load" (many simultaneous incidents).

## 1.12 Demo Scenarios

1. **Gate B Congestion + Shuttle Delay (flagship scenario):** Crowd sensor at Gate B trends into "high" risk at the same time a shuttle delay alert fires. AI copilot correlates both, recommends reassigning volunteers, opening overflow routing, and issuing a bilingual EN/ES announcement for fans arriving via the east shuttle drop-off.
2. **Accessibility Escalation:** A wheelchair escort request ages past SLA; AI flags it as top priority over a lower-urgency facilities ticket and recommends nearest available accessibility staff.
3. **Shift Handoff:** New operator logs in mid-match; requests "last 30 minutes" summary and gets a concise, prioritized recap.

## 1.13 Assumptions and Constraints

- All stadium/crowd/transport data is simulated or seeded — no live sensor/IoT integration.
- Single stadium, single match-day session per demo instance (no multi-venue orchestration needed for MVP).
- AI outputs are generated live but grounded only in the app's own simulated state (no external live data dependency).
- Time-boxed hackathon build — favor a small number of deep, working features over many shallow ones.

## 1.14 Alignment with the Challenge Statement

| Challenge Focus Area | How StadiumOps Copilot Addresses It |
|---|---|
| Crowd management | Zone health grid + AI congestion correlation and recommendations |
| Accessibility | Dedicated, prioritized accessibility request workflow |
| Transportation | Transport/shuttle alert feed integrated into AI reasoning |
| Multilingual assistance | EN/HI/ES announcement generation from any incident |
| Operational intelligence | Incident prioritization engine with explainable ranking |
| Real-time decision support | AI copilot answers operational questions against live simulated state |

## 1.15 Scoring Alignment Notes

- **Problem statement alignment:** every core feature maps directly to a named focus area above.
- **Code quality:** modular design (see TRD) — dashboard, incidents, accessibility, and AI services are separated, not entangled.
- **Security:** input validation on all AI-facing endpoints, no secrets in client code, scoped mock-auth roles (see TRD §Security).
- **Efficiency:** lightweight stack, cached AI prompts where safe, small seeded dataset — fast to run and demo.
- **Testing:** unit tests on prioritization logic and API routes; scenario-based manual test script (see TRD §Testing).
- **Accessibility:** WCAG-conscious UI (contrast, keyboard nav, screen-reader labels) — see UI/UX Brief §Accessibility.

---

# 2. TRD — Technical Requirements Document

## 2.1 Recommended Architecture (Hackathon MVP)

A simple three-tier architecture, chosen for speed of build and reliability of demo:

```
[React Frontend] <--REST/JSON--> [Node/Express Backend] <--> [In-memory / SQLite seeded store]
                                          |
                                          v
                                  [AI Service Layer] --> [LLM API (Claude)]
```

- **Frontend:** React (SPA), fetch-based REST calls, polling or lightweight interval refresh for "live" feel (no need for websockets at MVP scale, though noted as a stretch goal).
- **Backend:** Node.js + Express (or equivalent lightweight framework). Owns all business logic: prioritization, state transitions, scenario engine.
- **Data layer:** SQLite or in-memory JSON store, seeded at boot. Keeps setup near-zero and avoids infra dependencies.
- **AI Service Layer:** A dedicated backend module that assembles grounded prompts (current state + user question) and calls the LLM API. The frontend never calls the LLM directly.

## 2.2 Why This Stack

- **React:** fastest path to a dashboard-grade UI with component reuse across zones/incidents/accessibility.
- **Node/Express:** same language front-to-back, minimal context switching under time pressure.
- **SQLite/in-memory:** zero external infra, deterministic seed data, easy reset between demo runs.
- **Server-side AI calls only:** keeps API keys off the client (security) and lets the backend control exactly what state is exposed to the model (efficiency + security).

## 2.3 Data Flow Overview

1. Scenario engine seeds/updates zones, incidents, accessibility requests, transport alerts on a timer or via scripted demo triggers.
2. Frontend polls `/api/state` (or module-specific endpoints) to refresh dashboard views.
3. When a user asks the copilot a question or requests a recommendation/announcement, frontend calls a backend AI endpoint.
4. Backend assembles a grounded context payload (current relevant state slice) + user intent, sends to the LLM, receives structured response.
5. Backend validates/shapes the AI response before returning to frontend (never passes raw model output straight to UI untyped).

## 2.4 AI Service Responsibilities

| Responsibility | Description |
|---|---|
| Situation summarization | Turn current state into a concise natural-language summary |
| Incident explanation | For a given incident, produce what/why/action/owner/announcement-needed |
| Cross-signal correlation | Detect related signals (e.g., congestion + transport delay) and recommend combined action |
| Multilingual announcement generation | Produce EN/HI/ES versions of one announcement, consistent in meaning |
| Summary generation | "Last 30 minutes," handoff, and zone-status summaries on demand |

All AI responsibilities are implemented as distinct backend functions/prompts — not one giant "do everything" prompt — for clarity, testability, and judge-readability of code.

## 2.5 Simulation / Mock Data Strategy

- A **seed dataset** defines baseline zones, staff, and starting conditions.
- A **scenario script** (JSON-defined sequence of events with timestamps or trigger buttons) drives the flagship demo scenarios deterministically, so the demo doesn't depend on random chance.
- Optional lightweight randomization layer for a "free play" mode, kept separate from the scripted demo path.
- Clearly labeled in-code as `MOCK_DATA` / `SEEDED` to keep judges' code-quality review straightforward.

## 2.6 Core Backend Modules

| Module | Responsibility |
|---|---|
| `zones` | Zone state, congestion level, capacity signal |
| `incidents` | CRUD + prioritization for incident records |
| `accessibility` | CRUD + prioritization for accessibility requests |
| `transport` | Transport/shuttle alert records |
| `staffing` | Volunteer/staff availability and load per zone |
| `ai-copilot` | Q&A endpoint, grounded in current state |
| `ai-recommendations` | Incident-level action/owner/announcement-needed generation |
| `ai-announcements` | Multilingual announcement generation |
| `ai-summaries` | Time-window and handoff summaries |
| `scenario-engine` | Seed data and scripted event playback |

## 2.7 API Route Plan

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/state` | Full current dashboard state snapshot |
| GET | `/api/zones` | Zone list with congestion/capacity |
| GET | `/api/incidents` | Prioritized incident list |
| POST | `/api/incidents` | Create incident (scenario engine or manual) |
| PATCH | `/api/incidents/:id` | Update/resolve an incident |
| GET | `/api/accessibility` | Prioritized accessibility request list |
| POST | `/api/accessibility` | Create accessibility request |
| PATCH | `/api/accessibility/:id` | Update/resolve a request |
| GET | `/api/transport` | Transport alert list |
| GET | `/api/staffing` | Staffing/volunteer load per zone |
| POST | `/api/ai/copilot` | Natural-language Q&A |
| POST | `/api/ai/recommend/:incidentId` | Action recommendation for one incident |
| POST | `/api/ai/announce` | Multilingual announcement generation |
| POST | `/api/ai/summary` | Time-window / handoff summary |

## 2.8 Data Model / Entities (Overview — full detail in Doc 5)

Zones, Incidents, AccessibilityRequests, TransportAlerts, AIRecommendations, Announcements, Volunteers/Staffing, ActivityLog.

## 2.9 Non-Functional Requirements

- Dashboard refresh perceived as "live" (≤5s staleness).
- AI copilot response within a few seconds for demo-grade responsiveness.
- Stateless AI calls (all needed context passed per-request) for simplicity and reliability.
- Clean separation of concerns: no AI logic embedded directly in UI components.

## 2.10 Security Considerations

- LLM API key stored server-side only (env var), never shipped to client.
- Input validation/sanitization on all POST/PATCH bodies before persistence or LLM prompt assembly.
- Backend-side allowlist of what state fields are eligible to be included in AI prompts (avoid leaking unrelated internal fields).
- Simple role-based mock auth (Operations Manager / Coordinator / Accessibility / Comms) to demonstrate access boundaries, without building full production auth.
- Rate-limit AI endpoints to prevent runaway calls during demo/testing.

## 2.11 Accessibility Considerations

- Semantic HTML, ARIA labels on all interactive components.
- Keyboard-navigable incident/accessibility queues.
- Color is never the only status signal (icon/text + color).
- Minimum WCAG AA contrast ratios on status indicators.
- Screen-reader-friendly announcement preview before publish.

## 2.12 Performance / Efficiency Considerations

- Seeded dataset kept small and realistic (tens, not thousands, of records) — fast load, clear demo.
- Debounce/poll intervals tuned to avoid excessive backend/AI calls.
- Cache last AI summary per time-window bucket to avoid redundant LLM calls on repeated requests.

## 2.13 Testing Strategy

- **Unit tests:** prioritization/ranking logic (incidents, accessibility) — pure functions, easy to test deterministically.
- **API tests:** each route returns correct shape/status for valid and invalid input.
- **Scenario test script:** manual/documented run-through of the flagship demo scenario to confirm end-to-end behavior before presenting.
- **AI output shape validation:** backend validates that AI responses conform to expected structure before forwarding to frontend (defensive parsing).

## 2.14 Deployment Assumptions

- Single-process local or simple cloud deployment (e.g., one backend service + static frontend build) — no orchestration/Kubernetes needed for MVP.
- Environment variables for API keys; `.env.example` provided, no real secrets committed.

## 2.15 Tradeoffs and Simplifications for MVP

- Polling instead of websockets (simpler, sufficient for demo cadence).
- SQLite/in-memory instead of a hosted database (zero infra setup).
- 3 languages instead of full localization.
- Scripted scenario engine instead of real sensor ingestion.
- Simple role-based mock auth instead of production identity system.

---

# 3. App Flow / Information Architecture

## 3.1 Sitemap / Page List

| Page | Purpose |
|---|---|
| Login / Role Select | Choose persona (Ops Manager / Coordinator / Accessibility / Comms) — mock auth |
| Dashboard (Home) | Command-center overview: zones, incidents, accessibility, transport, staffing |
| Incidents | Full incident list, filters, detail view with AI recommendation |
| Accessibility | Accessibility request queue, detail view, resolution actions |
| Announcements | Announcement generator + history of published announcements |
| Copilot | Full-screen chat-style interface for open-ended Q&A |
| Summary / Handoff | Generate and view time-window or handoff summaries |

## 3.2 Role-Based Flow

| Persona | Default Landing | Primary Pages Used |
|---|---|---|
| Operations Manager | Dashboard | Dashboard, Incidents, Copilot, Summary |
| Volunteer Coordinator | Dashboard (staffing-focused view) | Dashboard, Incidents (assignment view) |
| Accessibility Staff | Accessibility | Accessibility, Copilot |
| Public Comms Staff | Announcements | Announcements, Copilot |

## 3.3 Primary User Flow

Login/Role Select → Dashboard → (drill into Incident / Accessibility Request) → AI Recommendation shown → Action taken (assign/resolve/announce) → state updates on Dashboard → Summary generated at handoff.

## 3.4 Dashboard Flow

1. User lands on Dashboard.
2. Sees zone health grid (color+icon status), incident feed (top 5 prioritized), accessibility queue count, transport alerts, staffing load.
3. Clicking any card drills into the relevant module page with full detail.
4. A persistent "Ask Copilot" affordance is available from every dashboard view.

## 3.5 Incident Management Flow

1. Incident appears in feed (scenario engine or manual creation).
2. System auto-ranks by severity × impact × time-open.
3. User opens incident → sees AI-generated: what/why/action/owner/announcement-needed.
4. User assigns owner, marks in-progress, resolves, or triggers announcement directly from this view.
5. Resolved incidents move to a collapsed "recently resolved" list (not deleted — feeds activity log).

## 3.6 Accessibility Request Flow

1. Request logged (type: wheelchair / escort / restroom guidance / medical escalation).
2. Auto-prioritized by urgency + wait time.
3. Accessibility staff view queue, claim a request, mark en route/resolved.
4. Aging/overdue requests visually escalate (e.g., moves up queue, status flag) — never silently disappears.

## 3.7 AI Copilot Interaction Flow

1. User asks a natural-language question ("What's the highest-priority issue right now?").
2. Backend assembles grounded context (current relevant state) + question.
3. Copilot responds with a direct answer, optionally linking to the relevant incident/request for one-click drill-down.
4. Follow-up questions retain short conversational context within the session.

## 3.8 Announcement Generation Flow

1. Triggered from an incident/transport alert ("Generate announcement") or manually from Announcements page.
2. User provides/confirms key facts (what happened, affected zone, expected resolution time).
3. AI generates EN/HI/ES versions.
4. User reviews (readable, screen-reader preview) and confirms "publish" (simulated — logs to Announcements history, no real broadcast).

## 3.9 Report / Summary Generation Flow

1. User selects window (last 30 min / full shift / custom) or "handoff summary."
2. AI generates a structured summary: key incidents, resolved items, open risks, accessibility status, recommended focus for next shift.
3. Summary is saved to history for audit/reference.

## 3.10 Error / Empty / Fallback States

| State | Handling |
|---|---|
| No open incidents | Friendly "All clear" state with last-resolved timestamp, not a blank screen |
| AI service timeout/error | Graceful fallback message + retry option; dashboard data still shown (AI failure never blocks core ops view) |
| No accessibility requests | "No active requests" state, distinct from an error |
| Invalid/malformed AI response | Backend catches and returns a safe fallback summary rather than surfacing raw errors to UI |
| Network/API failure | Toast/inline error, last-known-good state remains visible (no full-screen crash) |

---

# 4. UI/UX Design Brief

## 4.1 Design Direction / Visual Identity

A **command-center** aesthetic: dark-mode-first, high-contrast, information-dense but not cluttered — closer to an air-traffic-control or NOC dashboard than a consumer app. This signals operational seriousness to judges and matches real stadium ops-room environments.

## 4.2 Color and Status System

| Status | Color | Usage |
|---|---|---|
| Normal / Clear | Green | Zone healthy, request resolved |
| Watch | Amber/Yellow | Elevated congestion, aging request approaching SLA |
| Critical | Red | High-severity incident, overdue accessibility request |
| Info / Neutral | Blue/Gray | Transport alerts, informational announcements |

Color is always paired with an icon and text label — never the sole signal (accessibility requirement).

## 4.3 Layout Structure

- **Top bar:** stadium name, match context, current role, global "Ask Copilot" entry point.
- **Left/primary zone:** zone health grid (visual map or grid of zone cards).
- **Right rail:** incident feed + accessibility queue snapshot.
- **Bottom strip:** transport alerts + staffing load ticker.
- **Modal/drawer:** incident and accessibility detail views open as overlays to preserve dashboard context.

## 4.4 Key Components

- Zone Health Card (status color, congestion %, capacity signal).
- Incident Card (severity badge, age, one-line summary, "View AI Recommendation" action).
- Accessibility Request Card (type icon, urgency, wait time).
- Copilot Chat Panel (slide-in from top bar, persists across pages).
- Announcement Preview Card (tabbed EN/HI/ES view).
- Summary Panel (structured sections: Highlights / Open Risks / Resolved / Recommended Focus).

## 4.5 Information Hierarchy

1. Anything Critical (red) surfaces first, regardless of module.
2. Aging/overdue items visually rise in their queue.
3. AI recommendations are always presented adjacent to the item they explain — never in a disconnected panel.

## 4.6 Accessibility Design Requirements

- WCAG AA minimum contrast throughout, including on status colors.
- Full keyboard navigation for all queues and the copilot panel.
- ARIA live regions for real-time updates (new critical incident) so screen readers announce changes.
- Text resizing support without layout breakage.
- Announcement preview includes a plain-text/screen-reader-friendly rendering, not just styled cards.

## 4.7 Responsive Behavior

- Primary target: tablet/desktop (realistic ops-room hardware).
- Graceful single-column stacking on smaller viewports for judge demo flexibility (e.g., viewing on a laptop vs. projector).

## 4.8 Copy / Tone Suggestions

- Operational, concise, action-oriented: "Assign volunteer" not "Would you like to assign a volunteer?"
- AI explanations follow a consistent structure: **What → Why it matters → Recommended action → Owner → Announcement needed? (Y/N)**.
- Announcements: plain, calm, instructional tone appropriate for public safety communication — no jargon.

## 4.9 Making the Demo Visually Impressive Without Overbuilding

- Invest polish in: zone grid visual clarity, incident card severity signaling, and the copilot panel's response formatting — these are what judges will look at longest.
- Avoid: custom animation frameworks, complex charting libraries, or decorative elements that don't carry operational meaning.
- One flagship visual moment: the Gate B congestion + shuttle delay scenario visibly changing zone color and triggering an AI recommendation live, in real time, during the demo.

---

# 5. Backend Schema / Data Model Document

## 5.1 Zones

**Purpose:** Represents a physical stadium area (gate, concourse, section) and its live congestion/capacity state.

| Field | Type | Notes |
|---|---|---|
| `id` | string | Unique zone identifier |
| `name` | string | e.g., "Gate B", "North Concourse" |
| `congestionLevel` | enum(low/medium/high/critical) | Drives status color |
| `capacityPercent` | number | Simulated occupancy percentage |
| `lastUpdated` | timestamp | For staleness checks |

Example: `{ id: "zone-gateB", name: "Gate B", congestionLevel: "high", capacityPercent: 92, lastUpdated: "..." }`

Relationships: referenced by Incidents, AccessibilityRequests, TransportAlerts, Volunteers (via `zoneId`).
Data origin: **simulated** (scenario engine).

## 5.2 Incidents

**Purpose:** Tracks operational incidents (crowd, medical, security, facilities) requiring triage.

| Field | Type | Notes |
|---|---|---|
| `id` | string | Unique incident id |
| `type` | enum(crowd/medical/security/facilities/other) | Category |
| `zoneId` | string | Linked zone |
| `severity` | enum(low/medium/high/critical) | Base severity |
| `status` | enum(open/in-progress/resolved) | Lifecycle state |
| `createdAt` | timestamp | Used for age-based prioritization |
| `description` | string | Short human-entered or seeded description |
| `assignedTo` | string (nullable) | Staff/volunteer owner |

Example: `{ id: "inc-1042", type: "crowd", zoneId: "zone-gateB", severity: "high", status: "open", createdAt: "...", description: "Congestion building at Gate B entry" }`

Relationships: belongs to a Zone; may generate an AIRecommendation and/or Announcement.
Data origin: **simulated** (scenario engine) + **user-generated** (manual entry) + **AI-generated** (recommendation attached).

## 5.3 AccessibilityRequests

**Purpose:** Tracks individual accessibility support needs.

| Field | Type | Notes |
|---|---|---|
| `id` | string | Unique request id |
| `type` | enum(wheelchair/escort/restroom/medical-escalation) | Request category |
| `zoneId` | string | Location context |
| `urgency` | enum(standard/high/critical) | Base urgency |
| `status` | enum(queued/in-progress/resolved) | Lifecycle |
| `requestedAt` | timestamp | For wait-time/SLA tracking |
| `assignedTo` | string (nullable) | Staff owner |

Example: `{ id: "acc-233", type: "wheelchair", zoneId: "zone-northConcourse", urgency: "high", status: "queued", requestedAt: "..." }`

Relationships: belongs to a Zone; may reference a Volunteer/staff assignment.
Data origin: **simulated** + **user-generated**.

## 5.4 TransportAlerts

**Purpose:** Represents shuttle/transit disruptions relevant to stadium operations.

| Field | Type | Notes |
|---|---|---|
| `id` | string | Unique alert id |
| `route` | string | e.g., "East Shuttle Line" |
| `alertType` | enum(delay/closure/reroute) | Category |
| `affectedZoneId` | string | Nearest impacted zone |
| `estimatedDelayMinutes` | number | Nullable if not applicable |
| `activeSince` | timestamp | For duration tracking |

Example: `{ id: "trn-88", route: "East Shuttle", alertType: "delay", affectedZoneId: "zone-gateB", estimatedDelayMinutes: 25, activeSince: "..." }`

Relationships: linked to Zones; may trigger correlated AIRecommendations with Incidents.
Data origin: **simulated**.

## 5.5 AIRecommendations

**Purpose:** Stores AI-generated triage output for an incident or correlated situation.

| Field | Type | Notes |
|---|---|---|
| `id` | string | Unique recommendation id |
| `relatedIncidentId` | string (nullable) | Linked incident, if any |
| `whatIsHappening` | string | AI-generated |
| `whyItMatters` | string | AI-generated |
| `recommendedAction` | string | AI-generated |
| `suggestedOwnerRole` | string | e.g., "Volunteer Coordinator" |
| `announcementNeeded` | boolean | AI-generated flag |
| `generatedAt` | timestamp | |

Data origin: **AI-generated**, grounded in current simulated state at generation time.

## 5.6 Announcements

**Purpose:** Stores generated multilingual public announcements.

| Field | Type | Notes |
|---|---|---|
| `id` | string | Unique announcement id |
| `sourceIncidentId` | string (nullable) | What triggered it |
| `textEn` | string | English version |
| `textHi` | string | Hindi version |
| `textEs` | string | Spanish version |
| `status` | enum(draft/published) | Simulated publish state |
| `createdAt` | timestamp | |

Data origin: **AI-generated** (text), **user-generated** (trigger/confirmation facts).

## 5.7 Volunteers / Staffing

**Purpose:** Tracks staffing/volunteer capacity signals per zone for task-routing recommendations.

| Field | Type | Notes |
|---|---|---|
| `id` | string | Unique staffer id |
| `role` | enum(volunteer/accessibility-staff/ops-staff) | |
| `zoneId` | string | Current assignment |
| `status` | enum(available/assigned/on-break) | |

Example: `{ id: "vol-014", role: "volunteer", zoneId: "zone-gateB", status: "available" }`

Data origin: **simulated**.

## 5.8 Activity Log

**Purpose:** Chronological audit trail of state changes (incident created/resolved, request assigned, announcement published) — supports summaries and demo transparency.

| Field | Type | Notes |
|---|---|---|
| `id` | string | Unique log entry id |
| `entityType` | enum(incident/accessibility/announcement/transport) | |
| `entityId` | string | Reference id |
| `action` | string | e.g., "resolved", "assigned" |
| `timestamp` | timestamp | |

Data origin: **system-generated** (derived automatically from all state transitions).

## 5.9 Data Origin Summary

| Origin | Examples |
|---|---|
| Simulated (scenario engine) | Zones, base Incidents/TransportAlerts/Volunteers state |
| User-generated | Manually logged incidents/accessibility requests, assignment actions, announcement trigger facts |
| AI-generated | AIRecommendations, Announcement text, Summaries |
| System-generated | Activity Log entries |

---

# 6. Implementation Plan for Vibe Coding

## Phase A — Project Setup and Base Architecture

**Goal:** Establish a clean, working skeleton with frontend/backend talking to each other.

- Files/modules: `/frontend` (React app scaffold), `/backend` (Express app scaffold), `.env.example`, base routing, health-check endpoint.
- Dependencies: React, Express, dotenv, basic HTTP client.
- Deliverables: Frontend loads, hits `/api/health`, displays "connected" status.
- Risk areas: environment/config mismatches; CORS setup between frontend/backend.
- Validate before moving on: frontend successfully fetches from backend with no CORS errors.

## Phase B — Mock Data and Backend Scaffolding

**Goal:** Seed realistic operational data and expose it via API.

- Files/modules: `seedData.js`, `scenarioEngine.js`, `zones` / `incidents` / `accessibility` / `transport` / `staffing` route modules.
- Dependencies: Phase A complete.
- Deliverables: `/api/state`, `/api/zones`, `/api/incidents`, `/api/accessibility`, `/api/transport`, `/api/staffing` all return seeded data.
- Risk areas: over-complicating the data model early; keep entities close to Doc 5 spec.
- Validate: all core GET routes return correctly shaped, realistic seed data.

## Phase C — Dashboard UI and Shared Components

**Goal:** Build the command-center dashboard visual shell.

- Files/modules: `ZoneGrid`, `IncidentFeed`, `AccessibilityQueueSnapshot`, `TransportTicker`, `StaffingLoad`, shared `StatusBadge` component.
- Dependencies: Phase B APIs available.
- Deliverables: Dashboard renders live (polled) data with correct status coloring per Doc 4.
- Risk areas: overbuilding visual polish before functionality is proven — keep components simple first pass.
- Validate: dashboard correctly reflects seed data changes on refresh/poll.

## Phase D — Incidents and Recommendations Module

**Goal:** Full incident lifecycle + AI recommendation integration.

- Files/modules: `IncidentDetail` component, `PATCH /api/incidents/:id`, `POST /api/ai/recommend/:incidentId`, `ai-recommendations` backend module.
- Dependencies: Phase C dashboard, LLM API key configured.
- Deliverables: Opening an incident shows AI-generated what/why/action/owner/announcement-needed; assign/resolve actions update state and Activity Log.
- Risk areas: unvalidated/malformed AI responses breaking the UI — add defensive parsing per TRD §2.13.
- Validate: flagship Gate B scenario produces a coherent, correct recommendation end-to-end.

## Phase E — Accessibility Workflow Module

**Goal:** Fully functional accessibility request queue.

- Files/modules: `AccessibilityQueue`, `AccessibilityDetail`, `POST/PATCH /api/accessibility`.
- Dependencies: Phase B/C.
- Deliverables: Requests prioritized by urgency + wait time; claim/resolve flow works; aging requests visually escalate.
- Risk areas: prioritization logic edge cases (equal urgency, tie-breaking by time).
- Validate: unit tests on prioritization function pass; overdue request visibly surfaces.

## Phase F — AI Copilot and Announcements

**Goal:** Natural-language Q&A and multilingual announcement generation.

- Files/modules: `CopilotPanel`, `POST /api/ai/copilot`, `AnnouncementGenerator`, `POST /api/ai/announce`, `ai-summaries` module, `POST /api/ai/summary`.
- Dependencies: Phases B–E for grounded context to exist.
- Deliverables: Copilot answers questions grounded in current state; announcement generator produces consistent EN/HI/ES text; summary generation works for time-window and handoff requests.
- Risk areas: prompt grounding — ensure AI only reasons over actual current state, not hallucinated context; multilingual consistency checks.
- Validate: flagship scenario question ("What should staff do about Gate B congestion?") produces a correct, specific, non-generic answer; trilingual announcement is meaning-consistent across languages.

## Phase G — Testing, Accessibility, Polish, README

**Goal:** Harden for judging — correctness, accessibility, and presentation.

- Files/modules: unit test suite (prioritization logic, API routes), accessibility pass (ARIA, contrast, keyboard nav), `README.md`, scenario test script document.
- Dependencies: all prior phases functionally complete.
- Deliverables: passing test suite, accessibility checklist completed, polished README with setup instructions and demo script, final run-through of flagship scenario.
- Risk areas: running out of time for polish — timebox this phase and prioritize README + one clean scenario run over additional features.
- Validate: full flagship demo runs cleanly end-to-end at least twice without errors before presenting.

---

*End of documentation pack. This pack is the single source of truth for building StadiumOps Copilot — all six documents describe one coherent product and architecture.*
