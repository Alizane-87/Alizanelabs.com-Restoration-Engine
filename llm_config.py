"""Per-agent LLM configuration.

Each agent in the agency is bound to its own LLM so that models can be mixed
and matched (e.g. an advanced reasoning model for the CEO, a cheap and fast
model for the Developer). Defaults live in ``AGENT_LLM_DEFAULTS`` and every
field can be overridden with environment variables, e.g.::

    CEO_MODEL=anthropic/claude-sonnet-4-20250514
    DEVELOPER_MODEL=gpt-4o-mini
    DEVELOPER_TEMPERATURE=0.0
"""

import os
from dataclasses import dataclass, replace

from crewai import LLM


@dataclass(frozen=True)
class LLMSettings:
    """Provider-agnostic settings for a single agent's model."""

    model: str
    temperature: float = 0.5
    max_tokens: int | None = None
    base_url: str | None = None
    api_key_env: str | None = None


# Models are expressed in LiteLLM's "provider/model" notation, which CrewAI
# accepts for every supported provider (openai/, anthropic/, gemini/, groq/,
# ollama/, ...). A bare name such as "gpt-4o" is treated as OpenAI.
AGENT_LLM_DEFAULTS: dict[str, LLMSettings] = {
    # Strategy work: strongest available reasoning model, room to be creative.
    "ceo": LLMSettings(model="gpt-4o", temperature=0.7),
    # Architecture decisions: strong model, but more deterministic.
    "cto": LLMSettings(model="gpt-4o", temperature=0.3),
    # Code generation: fast and cheap, near-deterministic output.
    "developer": LLMSettings(model="gpt-4o-mini", temperature=0.1),
}


def _env(agent_key: str, field: str) -> str | None:
    return os.getenv(f"{agent_key.upper()}_{field}")


def settings_for(agent_key: str) -> LLMSettings:
    """Return the settings for ``agent_key`` with environment overrides applied."""
    try:
        settings = AGENT_LLM_DEFAULTS[agent_key]
    except KeyError:
        raise KeyError(
            f"Unknown agent '{agent_key}'. Known agents: {sorted(AGENT_LLM_DEFAULTS)}"
        ) from None

    model = _env(agent_key, "MODEL")
    temperature = _env(agent_key, "TEMPERATURE")
    max_tokens = _env(agent_key, "MAX_TOKENS")
    base_url = _env(agent_key, "BASE_URL")

    return replace(
        settings,
        model=model or settings.model,
        temperature=float(temperature) if temperature else settings.temperature,
        max_tokens=int(max_tokens) if max_tokens else settings.max_tokens,
        base_url=base_url or settings.base_url,
    )


def build_llm(agent_key: str) -> LLM:
    """Build the :class:`crewai.LLM` instance used by ``agent_key``."""
    settings = settings_for(agent_key)
    api_key = os.getenv(settings.api_key_env) if settings.api_key_env else None

    return LLM(
        model=settings.model,
        temperature=settings.temperature,
        max_tokens=settings.max_tokens,
        base_url=settings.base_url,
        api_key=api_key,
    )
