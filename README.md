# StadiumOps Copilot

StadiumOps Copilot is an AI-powered operations command center for FIFA World Cup 2026 match days. It gives operations managers, volunteer coordinators, accessibility support staff, and public communications teams a single live view of crowd congestion, incidents, accessibility requests, and transport disruptions.

## 🏗️ Architecture

- **Backend (`/backend`):** A Node.js + Express server that manages the state of stadium zones, incidents, accessibility requests, transport alerts, staffing logs, and triggers mock simulations. It interfaces with the Google GenAI SDK (`@google/genai`) to call the Gemini API, falling back to a mock model if no credentials are set.
- **Frontend (`/frontend`):** A Vite-powered React application with custom NOC-themed styling, dark mode layouts, role-based workflows, and a natural language Copilot chat sidebar.

## 🚀 How to Run Locally

### 1. Prerequisites
- **Node.js** (v20+ recommended)
- A **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 2. Configuration
Verify that you have a `.env` file at the root of the workspace directory containing your API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```

### 3. Startup Backend
Navigate to the `backend` folder and run the server:
```bash
cd backend
npm install
node server.js
```
The backend will run on `http://localhost:3001/`. You can query `http://localhost:3001/health` to confirm the server status and check if the Gemini key is loaded.

### 4. Startup Frontend
Navigate to the `frontend` folder and start the Vite development server:
```bash
cd frontend
npm install
npm run dev
```
The frontend application will boot on `http://localhost:5173/`.

---

## 💥 Flagship Demo Scenario Script

Use the **Demo Scenario Center** banner at the top of the dashboard to trigger the flagship World Cup 2026 operations scenario:

1. **Trigger Incident:** Click **"Gate B Congestion + Shuttle Delay"**. 
2. **Observe Dashboard:** Note that Gate B occupancy spikes to `94%` (turns red/critical) and a transport delay is posted for the East Shuttle Line. A high-priority crowd bottleneck incident is logged.
3. **Inspect AI Triage:** Click on the new Gate B incident in the feed. The system queries Gemini to output a structured recommendation (*What's happening*, *Why it matters*, *Action recommended*, and *Suggested dispatcher*).
4. **Broadcast Announcement:** Click **"Generate Announcement"** to transition to the PA screen. Under the draft tab, inspect the synchronized English, Hindi, and Spanish public announcements. Use the **"Listen Audio Preview"** button to check the pronunciation, then click **"Approve & Publish"**.
5. **Handoff Briefing:** Go to the **"Shift Summary"** tab, select **"Last 30 Minutes"**, and click **"Generate Situation Briefing"**. Copy the compiled Markdown report to share with incoming shift leads.