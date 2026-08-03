import "./helpers/env";

import type OpenAI from "openai";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ExtractionError, extractOnboardingFacts, setOpenAIClient } from "@/lib/extraction/extract";
import { buildFacts } from "./helpers/facts";

function stubClient(content: unknown, model = "gpt-4o-mini-2024-07-18") {
  const create = vi.fn().mockResolvedValue({
    model,
    choices: [{ message: { content: typeof content === "string" ? content : JSON.stringify(content) } }],
    usage: { prompt_tokens: 900, completion_tokens: 300 },
  });
  setOpenAIClient({ chat: { completions: { create } } } as unknown as OpenAI);
  return create;
}

afterEach(() => {
  setOpenAIClient(null);
  vi.restoreAllMocks();
});

describe("extractOnboardingFacts", () => {
  it("returns validated facts, derived flags and usage", async () => {
    const create = stubClient(buildFacts());
    const result = await extractOnboardingFacts({
      transcript: "agent: what are your hours?\nclient: eight to six",
      businessName: "Al Nahda Plumbing",
      tier: "Offer 2",
      country: "AE",
    });

    expect(result.facts.topServices[0]?.price).toBe("from AED 350");
    expect(result.reviewFlags).toEqual([]);
    expect(result.usage).toEqual({ promptTokens: 900, completionTokens: 300 });

    const request = create.mock.calls[0]![0];
    expect(request.temperature).toBe(0);
    expect(request.response_format.json_schema.strict).toBe(true);
    expect(request.messages[1].content).toContain("Purchased tier: Offer 2");
    expect(request.messages[1].content).toContain("eight to six");
  });

  it("surfaces flags for an unquoted price instead of failing", async () => {
    stubClient(
      buildFacts({
        topServices: [{ name: "Repipe", description: null, price: "AED 12,000", priceSourceQuote: null }],
      }),
    );
    const result = await extractOnboardingFacts({ transcript: "agent: hi\nclient: hi" });
    expect(result.reviewFlags.map((flag) => flag.code)).toEqual(["price_without_quote"]);
  });

  it("rejects an empty transcript without calling the model", async () => {
    const create = stubClient(buildFacts());
    await expect(extractOnboardingFacts({ transcript: "   " })).rejects.toBeInstanceOf(ExtractionError);
    expect(create).not.toHaveBeenCalled();
  });

  it("fails loudly on invalid JSON, a schema violation, and an API error", async () => {
    stubClient("not json at all");
    await expect(extractOnboardingFacts({ transcript: "x" })).rejects.toThrow(/invalid JSON/);

    stubClient({ businessName: "Acme" });
    await expect(extractOnboardingFacts({ transcript: "x" })).rejects.toThrow(/schema validation/);

    const create = vi.fn().mockRejectedValue(new Error("429 rate limit"));
    setOpenAIClient({ chat: { completions: { create } } } as unknown as OpenAI);
    await expect(extractOnboardingFacts({ transcript: "x" })).rejects.toThrow(/LLM request failed/);
  });
});
