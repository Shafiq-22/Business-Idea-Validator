# FORGE — Business Idea Validator

> Validate your idea. Brutally.

A web application that takes a business idea and researches it in real time — scanning for pain points across Reddit, YouTube, and forums, mapping existing competitors, and scoring viability across five dimensions using the Anthropic Claude API with live web search.

---

## What It Does

1. You enter a business idea in plain language
2. The engine makes two sequential API calls:
   - **Call 1 (Research):** Claude searches the web for real user complaints, existing solutions, and market signals
   - **Call 2 (Synthesis):** Claude structures the findings into a scored validation report
3. You get back:
   - An overall score (0–100) and a verdict: `PROMISING` / `NICHE` / `RISKY` / `AVOID`
   - Scores across 5 dimensions: Pain Severity, Market Size, Blue Ocean, Feasibility, Monetization
   - Real pain point quotes with sources and severity tags
   - Competitor breakdown with specific gaps
   - Market insights and key opportunity/risk callouts

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| AI | Anthropic Claude Sonnet (claude-sonnet-4-20250514) |
| Web Search | Anthropic built-in web search tool |
| Fonts | IBM Plex Mono + Syne (Google Fonts) |
| Styling | Inline styles + CSS-in-JS (no external CSS framework) |

---

## Project Structure

```
forge-validator/
├── backend/
│   ├── index.js          # Express API proxy server
│   ├── package.json
│   └── .env.example      # Environment variable template
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx               # Root component, state manager
│   │   └── components/
│   │       ├── InputScreen.jsx   # Idea input form
│   │       ├── LoadingScreen.jsx # Animated phase tracker
│   │       └── ResultScreen.jsx  # Full validation report
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## Prerequisites

Before you start, make sure you have:

- **Node.js v18 or higher** — check with `node --version`
- **npm v9 or higher** — check with `npm --version`
- **An Anthropic API key** — get one at [console.anthropic.com](https://console.anthropic.com)
  - Your account must have access to `claude-sonnet-4-20250514`
  - The web search tool (`web_search_20250305`) must be available on your account tier

> **Note for Linux Mint users:** Node.js from the default apt repository is often outdated. Use `nvm` (Node Version Manager) to install a current version — instructions below.

---

## Installation

### Step 1 — Install Node.js (if not already installed or version is old)

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Reload shell
source ~/.bashrc

# Install Node 20 LTS
nvm install 20
nvm use 20

# Verify
node --version   # should show v20.x.x
npm --version    # should show 10.x.x
```

---

### Step 2 — Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/forge-validator.git
cd forge-validator
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

### Step 3 — Set Up the Backend

```bash
cd backend
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Open `.env` and add your Anthropic API key:

```bash
nano .env
```

The file should look like this:

```
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
PORT=3001
```

Save and exit (`Ctrl+O`, `Enter`, `Ctrl+X` in nano).

---

### Step 4 — Set Up the Frontend

```bash
cd ../frontend
npm install
```

No environment variables needed for the frontend — it proxies through the backend.

---

### Step 5 — Run the Application

You need **two terminals** running simultaneously.

**Terminal 1 — Start the backend:**
```bash
cd forge-validator/backend
npm run dev
```

You should see:
```
FORGE backend running on http://localhost:3001
```

**Terminal 2 — Start the frontend:**
```bash
cd forge-validator/frontend
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

Open your browser and go to **http://localhost:5173**

---

## How the API Integration Works

The backend acts as a secure proxy — your API key never leaves your server.

```
Browser → POST /api/validate → Express backend → Anthropic API (Call 1: Research)
                                                → Anthropic API (Call 2: Synthesis)
                             ← { validation JSON } ←
```

**Why two API calls?**

The Anthropic web search tool causes Claude to perform live searches during inference. The first call allows Claude to freely search and return unstructured research findings. The second call (without tools) takes those findings and converts them into structured JSON — separating the search phase from the formatting phase prevents format corruption.

---

## Usage

1. Open http://localhost:5173
2. Type or paste your business idea into the text box (minimum 10 characters)
3. Click **→ Run Validation**
4. Watch the three-phase loader:
   - ⚡ Scanning Pain Points (web search in progress)
   - 🔭 Mapping Market
   - ⚖️ Scoring & Verdict
5. Read your validation report (typically takes 15–30 seconds)
6. Click **← Validate Another Idea** to start over

---

## Troubleshooting

### "Cannot connect to backend" or CORS errors
- Make sure the backend is running on port 3001
- Make sure you started it with `npm run dev` from inside the `backend/` directory
- Check that nothing else is using port 3001: `lsof -i :3001`

### "HTTP 401" error
- Your API key is invalid or not set
- Open `backend/.env` and verify the key is correctly pasted with no extra spaces
- Make sure the `.env` file is in the `backend/` folder, not the root

### "HTTP 400" or model error
- Your Anthropic account may not have access to `claude-sonnet-4-20250514`
- Try changing the model in `backend/index.js` to `claude-3-5-sonnet-20241022` as a fallback

### "No research data returned"
- The web search tool may not be enabled on your API tier
- Check your Anthropic console to verify feature access

### Frontend shows blank page
- Make sure you ran `npm install` inside the `frontend/` directory
- Check the browser console (F12) for errors

### Port conflicts
Change the backend port in `backend/.env`:
```
PORT=3002
```
Then update `frontend/vite.config.js` to proxy to the new port.

---

## Pushing to GitHub

After cloning and verifying everything works, push to your own GitHub repository:

```bash
# From the project root
git remote set-url origin https://github.com/YOUR_USERNAME/forge-validator.git
git push -u origin main
```

Or if you're starting fresh (not cloned):

```bash
git remote add origin https://github.com/YOUR_USERNAME/forge-validator.git
git branch -M main
git push -u origin main
```

> **Important:** Never commit the `.env` file. It is already listed in `.gitignore`. Double-check before pushing with `git status` — you should not see `.env` in the list.

---

## Customisation

### Change the AI model
In `backend/index.js`, find both API calls and change the `model` field:
```javascript
model: "claude-opus-4-20250514"  // More capable, slower, more expensive
model: "claude-haiku-4-5-20251001" // Faster, cheaper, less thorough
```

### Adjust validation depth
In `backend/index.js`, increase `max_tokens` on Call 1 for more research depth (up to 8192).

### Add your own scoring dimensions
In `ResultScreen.jsx`, update `SCORE_LABELS` and add corresponding fields to the JSON prompt in `backend/index.js`.

---

## Cost Estimate

Each validation runs two API calls:
- Call 1 (research + web search): ~1500–2500 tokens in, ~800–1500 tokens out
- Call 2 (synthesis): ~2000–3500 tokens in, ~400–600 tokens out

At current Claude Sonnet pricing, each full validation costs approximately **$0.01–$0.03 USD**.

---

## License

MIT — build on it, modify it, ship it.
