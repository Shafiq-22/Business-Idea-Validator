# FORGE — Business Idea Validator

A full-stack web app that validates business ideas using AI-powered research. Drop your idea in, and FORGE searches Reddit, YouTube, and social media for real pain points, maps existing solutions, and scores viability — no fluff.

## Stack

- **Frontend**: React 18 + Vite
- **Backend**: Express.js (API proxy)
- **AI**: Anthropic Claude API with web search

## Project Structure

```
forge-validator/
├── backend/        # Express API proxy
├── frontend/       # React + Vite app
├── .gitignore
└── README.md
```

## Setup

### 1. Clone and configure the backend

```bash
cd backend
cp .env.example .env
# Edit .env and add your Anthropic API key
npm install
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Run the app

In one terminal, start the backend:
```bash
cd backend
npm run dev
```

In another terminal, start the frontend:
```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Environment Variables

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key (get one at console.anthropic.com) |
| `PORT` | Backend port (default: 3001) |

## How It Works

1. You enter a business idea
2. The backend makes **two sequential Claude API calls**:
   - **Call 1 (Research)**: Uses Claude with web search to find real pain points, competitors, and market signals
   - **Call 2 (Synthesis)**: Converts raw research into a structured JSON validation report
3. The frontend renders scores, pain points, competitor gaps, and a verdict

## Verdict Scale

| Verdict | Meaning |
|---|---|
| PROMISING | Strong signal, go build it |
| NICHE | Real market but small, proceed carefully |
| RISKY | High competition or weak pain signal |
| AVOID | Not worth pursuing |
