require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/validate', async (req, res) => {
  const { idea } = req.body;

  if (!idea || typeof idea !== 'string' || idea.trim().length < 10) {
    return res.status(400).json({ error: 'Please provide a valid business idea (at least 10 characters).' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'Server misconfiguration: missing API key.' });
  }

  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': process.env.ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01',
  };

  // ── Call 1: Research with web search ──────────────────────────────────────
  let researchText = '';
  try {
    const researchResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 3000,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [
          {
            role: 'user',
            content: `You are a business idea researcher. Research this idea: "${idea.trim()}"

Search the web for:
- Real user complaints and pain points on Reddit, forums, YouTube comments
- Existing products or services solving this problem
- Market size or demand signals

Write a detailed plain-text research report. Include specific quotes and source names.`,
          },
        ],
      }),
    });

    if (!researchResponse.ok) {
      const errBody = await researchResponse.text();
      console.error('Research API error:', researchResponse.status, errBody);
      return res.status(502).json({ error: `Research step failed (status ${researchResponse.status}). Check your API key.` });
    }

    const researchData = await researchResponse.json();
    researchText = (researchData.content || [])
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim();

    if (!researchText) {
      return res.status(502).json({ error: 'Research step returned no text. Please try again.' });
    }
  } catch (err) {
    console.error('Research fetch error:', err);
    return res.status(502).json({ error: 'Failed to reach the AI research service. Please try again.' });
  }

  // ── Call 2: Synthesis — JSON output only ──────────────────────────────────
  let parsed;
  try {
    const synthesisResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: `Here is research about a business idea: "${idea.trim()}"

RESEARCH:
${researchText}

Convert this into a JSON validation report. Reply with ONLY raw JSON — no markdown fences, no explanation, nothing else before or after the JSON.

Use exactly this structure:
{
  "summary": "2-3 sentence honest assessment",
  "painPoints": [
    {"source": "Reddit/r/something", "quote": "specific complaint", "severity": "high"},
    {"source": "YouTube", "quote": "specific complaint", "severity": "medium"},
    {"source": "Twitter/X", "quote": "specific complaint", "severity": "high"},
    {"source": "Forum", "quote": "specific complaint", "severity": "low"},
    {"source": "Reddit/r/something", "quote": "specific complaint", "severity": "medium"}
  ],
  "existingSolutions": [
    {"name": "Product Name", "weakness": "gap description", "url": "domain.com"},
    {"name": "Product Name 2", "weakness": "gap description", "url": "domain.com"},
    {"name": "Product Name 3", "weakness": "gap description", "url": "domain.com"}
  ],
  "marketInsights": ["insight 1", "insight 2", "insight 3"],
  "scores": {
    "painSeverity": 7,
    "marketSize": 6,
    "competition": 5,
    "feasibility": 8,
    "monetization": 7
  },
  "overallScore": 66,
  "verdict": "PROMISING",
  "verdictReason": "One or two sentence verdict explanation.",
  "keyOpportunity": "The biggest opportunity in one sentence.",
  "biggestRisk": "The biggest risk in one sentence."
}

Rules:
- verdict must be exactly one of: PROMISING, NICHE, RISKY, AVOID
- overallScore is 0-100
- Output ONLY the JSON object, nothing else`,
          },
        ],
      }),
    });

    if (!synthesisResponse.ok) {
      const errBody = await synthesisResponse.text();
      console.error('Synthesis API error:', synthesisResponse.status, errBody);
      return res.status(502).json({ error: `Synthesis step failed (status ${synthesisResponse.status}).` });
    }

    const synthesisData = await synthesisResponse.json();
    const rawText = (synthesisData.content || [])
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim();

    // Strip any accidental markdown fences
    const jsonStr = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

    parsed = JSON.parse(jsonStr);
  } catch (err) {
    console.error('Synthesis error:', err);
    return res.status(502).json({ error: 'Failed to parse the AI synthesis response. Please try again.' });
  }

  // ── Validate required fields ───────────────────────────────────────────────
  const VALID_VERDICTS = ['PROMISING', 'NICHE', 'RISKY', 'AVOID'];
  if (!parsed.verdict || !VALID_VERDICTS.includes(parsed.verdict)) {
    return res.status(502).json({ error: 'Invalid verdict in AI response. Please try again.' });
  }
  if (typeof parsed.overallScore !== 'number') {
    return res.status(502).json({ error: 'Missing overallScore in AI response. Please try again.' });
  }
  if (!parsed.scores || typeof parsed.scores !== 'object') {
    return res.status(502).json({ error: 'Missing scores in AI response. Please try again.' });
  }

  return res.json(parsed);
});

app.listen(PORT, () => {
  console.log(`FORGE backend running on http://localhost:${PORT}`);
});
