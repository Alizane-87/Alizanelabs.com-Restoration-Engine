# Agency Lead Magnet Site - Strict Isolation Rules

## 1. Scope & Isolation Boundary
- You are operating STRICTLY within `alizanelabs-site`.
- Do NOT read or search files outside this directory (such as `alizane-restoration-engine`).
- Do NOT reference or load global Alizane Labs persona skills (CMO, VP Sales, Chief Data Officer, etc.) unless explicitly requested by the user.

## 2. Memory & State Persistence
- ALWAYS read `memory.json` at the start of any new thread.
- ALWAYS update `memory.json` at the end of a session before completing your response.

## 3. Tech Stack & Execution Rules
- Tech Stack: Next.js + Tailwind CSS + Vercel Deployment + n8n Lead Capture Webhook.
- Primary Objective: $59/mo Free Website Lead Magnet & Agency Client Acquisition.
