# Alizane Labs — AI Agency

A [CrewAI](https://docs.crewai.com) multi-agent system of "AI employees":

| Agent | Role | Default model |
| --- | --- | --- |
| CEO | Business strategy, priorities, success metrics | `gpt-4o` (temp 0.7) |
| CTO | Stack, architecture, build-vs-buy, risks | `gpt-4o` (temp 0.3) |
| Developer | Runnable implementation of the first checklist item | `gpt-4o-mini` (temp 0.1) |

The agents run sequentially: the CTO receives the CEO's brief as context, and the
Developer receives the CTO's plan.

## Setup

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # then fill in your provider key(s)
```

## Run

```bash
python agency_crew.py "Launch a paid waitlist for our analytics product"
```

Without an argument the crew uses the default objective in `agency_crew.py`.

## Assigning different LLMs per agent

Model selection lives in `llm_config.py`. Edit `AGENT_LLM_DEFAULTS` for permanent
changes, or override any agent at runtime with environment variables named
`<AGENT>_MODEL`, `<AGENT>_TEMPERATURE`, `<AGENT>_MAX_TOKENS`, `<AGENT>_BASE_URL`:

```bash
CEO_MODEL=anthropic/claude-sonnet-4-20250514 \
DEVELOPER_MODEL=groq/llama-3.3-70b-versatile \
python agency_crew.py "Ship a billing dashboard"
```

Models use LiteLLM's `provider/model` notation, so any provider CrewAI supports
(OpenAI, Anthropic, Gemini, Groq, Ollama, Azure, Bedrock, ...) works — set the
matching API key in `.env`. A bare model name such as `gpt-4o` means OpenAI.
Point `<AGENT>_BASE_URL` at a local server (e.g. Ollama) to run an agent
off-cloud.
