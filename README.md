# GramVenture V3

Hyper-local business decision-support prototype for SIH26091.

## Core journeys
- I know what I want to start
- Help me find a business
- District → Taluka → Village
- Personal situation, money source, existing debt, resources, experience and support
- Three realistically startable recommendations
- Hard “not realistic right now” path
- Click-to-expand explanations for why a business was suggested
- Simple financing view with government-scheme and bank/MSME routes
- Absolute-amount scenario testing instead of percentage sliders
- Click-to-expand six-part roadmap and print/save as PDF
- English / Marathi / Hindi interface
- Groq-powered Ask GramVenture assistant via a server-side API
- Lightweight RAG layer over curated official PMFME / PMEGP sources with source attribution

## Run
```powershell
npm.cmd install
npm.cmd run dev
```

## Build
```powershell
npm.cmd run build
```

## Groq + RAG
Set `GROQ_API_KEY` on the server/deployment to enable Ask GramVenture. The API uses Groq's OpenAI-compatible endpoint and `openai/gpt-oss-20b`. A small curated retrieval index in `api/knowledge.ts` retrieves relevant official PMFME / PMEGP guidance before the LLM answers. The API returns the retrieved sources so the UI can show attribution. The core recommendation and financial calculations do not require Groq.

## Important
Prototype location indicators, business costs, sales and expenses are illustrative. Government scheme information, local prices and lender terms must be verified before real-world use.
