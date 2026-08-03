import { z } from "zod";

/**
 * The business facts the onboarding interview is supposed to establish.
 *
 * Two rules shape this schema, and both exist because the output is written by an LLM that
 * will be trusted with a client's public-facing chatbot:
 *   1. Every fact is nullable. "The client did not say" must be representable, otherwise
 *      the model invents plausible business hours.
 *   2. Anything a client could be embarrassed or overcharged by — prices, guarantees,
 *      emergency promises — must carry `sourceQuote`, a verbatim span from the transcript.
 *      A fact with a value and no quote is treated as unverified (see `deriveReviewFlags`).
 */
const quotedString = z.object({
  value: z.string().nullable(),
  sourceQuote: z.string().nullable(),
});

export const businessHoursEntrySchema = z.object({
  day: z.enum([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
    "public_holidays",
  ]),
  opens: z.string().nullable(),
  closes: z.string().nullable(),
  closed: z.boolean(),
});

export const serviceSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  price: z.string().nullable(),
  priceSourceQuote: z.string().nullable(),
});

export const onboardingFactsSchema = z.object({
  businessName: z.string().nullable(),
  businessSummary: z.string().nullable(),
  industry: z.string().nullable(),
  serviceArea: quotedString,
  timezone: z.string().nullable(),
  businessHours: z.object({
    entries: z.array(businessHoursEntrySchema),
    notes: z.string().nullable(),
    sourceQuote: z.string().nullable(),
  }),
  topServices: z.array(serviceSchema).max(3),
  emergencyProtocol: z.object({
    offersEmergencyService: z.boolean().nullable(),
    availability: z.string().nullable(),
    escalationInstructions: z.string().nullable(),
    escalationPhone: z.string().nullable(),
    sourceQuote: z.string().nullable(),
  }),
  bookingPolicy: z.object({
    bookingChannel: z.string().nullable(),
    leadTime: z.string().nullable(),
    depositRequired: z.boolean().nullable(),
    cancellationPolicy: z.string().nullable(),
    sourceQuote: z.string().nullable(),
  }),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })).max(10),
  brandVoice: z.string().nullable(),
  doNotSay: z.array(z.string()),
  unansweredQuestions: z.array(z.string()),
  transcriptQualityNotes: z.string().nullable(),
});

export type OnboardingFacts = z.infer<typeof onboardingFactsSchema>;

/** JSON Schema handed to the model (OpenAI strict mode: every key required, no extras). */
export const onboardingFactsJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "businessName",
    "businessSummary",
    "industry",
    "serviceArea",
    "timezone",
    "businessHours",
    "topServices",
    "emergencyProtocol",
    "bookingPolicy",
    "faqs",
    "brandVoice",
    "doNotSay",
    "unansweredQuestions",
    "transcriptQualityNotes",
  ],
  properties: {
    businessName: { type: ["string", "null"] },
    businessSummary: { type: ["string", "null"], description: "Two sentences, max." },
    industry: { type: ["string", "null"] },
    serviceArea: {
      type: "object",
      additionalProperties: false,
      required: ["value", "sourceQuote"],
      properties: {
        value: { type: ["string", "null"] },
        sourceQuote: { type: ["string", "null"] },
      },
    },
    timezone: { type: ["string", "null"], description: "IANA name if stated or unambiguous." },
    businessHours: {
      type: "object",
      additionalProperties: false,
      required: ["entries", "notes", "sourceQuote"],
      properties: {
        entries: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            required: ["day", "opens", "closes", "closed"],
            properties: {
              day: {
                type: "string",
                enum: [
                  "monday",
                  "tuesday",
                  "wednesday",
                  "thursday",
                  "friday",
                  "saturday",
                  "sunday",
                  "public_holidays",
                ],
              },
              opens: { type: ["string", "null"], description: "24h HH:MM." },
              closes: { type: ["string", "null"], description: "24h HH:MM." },
              closed: { type: "boolean" },
            },
          },
        },
        notes: { type: ["string", "null"] },
        sourceQuote: { type: ["string", "null"] },
      },
    },
    topServices: {
      type: "array",
      description: "At most the three services the client emphasised.",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "description", "price", "priceSourceQuote"],
        properties: {
          name: { type: "string" },
          description: { type: ["string", "null"] },
          price: {
            type: ["string", "null"],
            description: "Exactly as stated, including currency and qualifiers such as 'from'.",
          },
          priceSourceQuote: {
            type: ["string", "null"],
            description: "Verbatim transcript span containing the price. Null if not stated.",
          },
        },
      },
    },
    emergencyProtocol: {
      type: "object",
      additionalProperties: false,
      required: [
        "offersEmergencyService",
        "availability",
        "escalationInstructions",
        "escalationPhone",
        "sourceQuote",
      ],
      properties: {
        offersEmergencyService: { type: ["boolean", "null"] },
        availability: { type: ["string", "null"] },
        escalationInstructions: { type: ["string", "null"] },
        escalationPhone: { type: ["string", "null"] },
        sourceQuote: { type: ["string", "null"] },
      },
    },
    bookingPolicy: {
      type: "object",
      additionalProperties: false,
      required: [
        "bookingChannel",
        "leadTime",
        "depositRequired",
        "cancellationPolicy",
        "sourceQuote",
      ],
      properties: {
        bookingChannel: { type: ["string", "null"] },
        leadTime: { type: ["string", "null"] },
        depositRequired: { type: ["boolean", "null"] },
        cancellationPolicy: { type: ["string", "null"] },
        sourceQuote: { type: ["string", "null"] },
      },
    },
    faqs: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["question", "answer"],
        properties: { question: { type: "string" }, answer: { type: "string" } },
      },
    },
    brandVoice: { type: ["string", "null"] },
    doNotSay: { type: "array", items: { type: "string" } },
    unansweredQuestions: {
      type: "array",
      description: "Interview questions the client did not answer, for follow-up.",
      items: { type: "string" },
    },
    transcriptQualityNotes: { type: ["string", "null"] },
  },
} as const;

export type ReviewFlag = { code: string; message: string; severity: "high" | "medium" | "low" };

/**
 * Turns the extraction into a reviewer's checklist. This is the safety net around the LLM:
 * anything unquoted, missing, or internally inconsistent is surfaced to the CEO instead of
 * being quietly trusted.
 */
export function deriveReviewFlags(facts: OnboardingFacts): ReviewFlag[] {
  const flags: ReviewFlag[] = [];

  for (const service of facts.topServices) {
    if (service.price && !service.priceSourceQuote) {
      flags.push({
        code: "price_without_quote",
        message: `"${service.name}" has price "${service.price}" with no supporting transcript quote — verify before publishing.`,
        severity: "high",
      });
    }
  }

  if (facts.topServices.length === 0) {
    flags.push({
      code: "no_services",
      message: "No services were extracted; the interview may have failed.",
      severity: "high",
    });
  }

  if (facts.businessHours.entries.length === 0) {
    flags.push({
      code: "no_business_hours",
      message: "No business hours captured — the chatbot cannot answer 'are you open?'.",
      severity: "high",
    });
  } else if (!facts.businessHours.sourceQuote) {
    flags.push({
      code: "hours_without_quote",
      message: "Business hours are not backed by a transcript quote.",
      severity: "medium",
    });
  }

  for (const entry of facts.businessHours.entries) {
    if (!entry.closed && (!entry.opens || !entry.closes)) {
      flags.push({
        code: "incomplete_hours_entry",
        message: `${entry.day} is marked open but is missing an opening or closing time.`,
        severity: "medium",
      });
    }
  }

  if (facts.emergencyProtocol.offersEmergencyService === true && !facts.emergencyProtocol.sourceQuote) {
    flags.push({
      code: "emergency_without_quote",
      message: "An emergency service promise was extracted without a transcript quote.",
      severity: "high",
    });
  }

  if (facts.emergencyProtocol.offersEmergencyService === null) {
    flags.push({
      code: "emergency_unknown",
      message: "Emergency protocol was not established during the interview.",
      severity: "medium",
    });
  }

  if (!facts.timezone) {
    flags.push({
      code: "no_timezone",
      message: "No timezone captured; opening-hours answers may be wrong for the client's market.",
      severity: "medium",
    });
  }

  if (facts.unansweredQuestions.length > 0) {
    flags.push({
      code: "unanswered_questions",
      message: `${facts.unansweredQuestions.length} interview question(s) went unanswered.`,
      severity: "low",
    });
  }

  return flags;
}
