import OpenAI from "openai";

import { getEnv } from "@/lib/env";
import {
  deriveReviewFlags,
  onboardingFactsJsonSchema,
  onboardingFactsSchema,
  type OnboardingFacts,
  type ReviewFlag,
} from "@/lib/schemas/facts";

const SYSTEM_PROMPT = `You extract business facts from a recorded onboarding interview between an AI agent and a new client of a web/AI agency.

Rules:
- Extract only what the client actually said. Never infer, complete, or normalise a fact that was not stated.
- If a fact was not stated, return null (or an empty array). "Not stated" is a valid and useful answer.
- For every price, and for hours, service area, emergency and booking policies, include a verbatim quote from the transcript in the matching sourceQuote field. Copy the words exactly; do not paraphrase. If you cannot find a quote, the value must be null.
- Prices must be recorded exactly as spoken, including currency and qualifiers ("from AED 500", "$99 per visit").
- List at most three services, choosing the ones the client emphasised.
- Put any interview question the client dodged or left unanswered into unansweredQuestions.
- Note transcription problems, contradictions, or a client who sounded unsure in transcriptQualityNotes.`;

export interface ExtractionResult {
  facts: OnboardingFacts;
  reviewFlags: ReviewFlag[];
  model: string;
  usage: { promptTokens: number | null; completionTokens: number | null };
}

export class ExtractionError extends Error {
  constructor(
    message: string,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = "ExtractionError";
  }
}

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) client = new OpenAI({ apiKey: getEnv().OPENAI_API_KEY });
  return client;
}

/** Test helper: injects a stub client. */
export function setOpenAIClient(stub: OpenAI | null): void {
  client = stub;
}

/**
 * Runs the transcript through the extraction model with a strict JSON schema, then validates
 * the result again locally — a schema-compliant response can still be semantically wrong, so
 * the returned review flags are what the human reviewer actually acts on.
 */
export async function extractOnboardingFacts(options: {
  transcript: string;
  businessName?: string | null;
  tier?: string | null;
  country?: string | null;
}): Promise<ExtractionResult> {
  const { transcript } = options;
  if (!transcript.trim()) throw new ExtractionError("Transcript is empty");

  const env = getEnv();
  const context = [
    options.businessName ? `Known business name (from CRM): ${options.businessName}` : null,
    options.tier ? `Purchased tier: ${options.tier}` : null,
    options.country ? `Client country: ${options.country}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  let response;
  try {
    response = await getClient().chat.completions.create({
      model: env.OPENAI_EXTRACTION_MODEL,
      temperature: 0,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `${context ? `${context}\n\n` : ""}Onboarding call transcript:\n"""\n${transcript}\n"""`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "onboarding_facts",
          strict: true,
          schema: onboardingFactsJsonSchema as unknown as Record<string, unknown>,
        },
      },
    });
  } catch (error) {
    throw new ExtractionError("LLM request failed", error);
  }

  const content = response.choices[0]?.message?.content;
  if (!content) throw new ExtractionError("LLM returned no content");

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(content);
  } catch (error) {
    throw new ExtractionError("LLM returned invalid JSON", error);
  }

  const parsed = onboardingFactsSchema.safeParse(parsedJson);
  if (!parsed.success) {
    throw new ExtractionError(
      `LLM output failed schema validation: ${parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ")}`,
    );
  }

  return {
    facts: parsed.data,
    reviewFlags: deriveReviewFlags(parsed.data),
    model: response.model ?? env.OPENAI_EXTRACTION_MODEL,
    usage: {
      promptTokens: response.usage?.prompt_tokens ?? null,
      completionTokens: response.usage?.completion_tokens ?? null,
    },
  };
}
