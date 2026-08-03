import { z } from "zod";

/**
 * GHL webhook payloads vary by workflow action, so this schema pins only the fields the
 * pipeline needs and tolerates everything else. The transcript may arrive as a string or
 * as a turn-by-turn array depending on how the voice action is configured.
 */
const transcriptTurnSchema = z.object({
  role: z.string().optional(),
  speaker: z.string().optional(),
  text: z.string().optional(),
  message: z.string().optional(),
  content: z.string().optional(),
});

export const ghlOnboardingWebhookSchema = z
  .object({
    eventId: z.string().min(1).optional(),
    id: z.string().min(1).optional(),
    callId: z.string().min(1).optional(),
    locationId: z.string().min(1).optional(),
    contactId: z.string().min(1).optional(),
    opportunityId: z.string().min(1).optional(),
    businessName: z.string().optional(),
    companyName: z.string().optional(),
    contactName: z.string().optional(),
    fullName: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    tier: z.string().optional(),
    country: z.string().optional(),
    transcript: z.union([z.string(), z.array(transcriptTurnSchema)]).optional(),
    callTranscript: z.union([z.string(), z.array(transcriptTurnSchema)]).optional(),
    recordingUrl: z.string().optional(),
    callDurationSeconds: z.coerce.number().nonnegative().optional(),
  })
  .passthrough();

export type GhlOnboardingWebhook = z.infer<typeof ghlOnboardingWebhookSchema>;

function turnToLine(turn: z.infer<typeof transcriptTurnSchema>): string {
  const speaker = turn.role ?? turn.speaker ?? "unknown";
  const text = turn.text ?? turn.message ?? turn.content ?? "";
  return text ? `${speaker}: ${text}` : "";
}

export function flattenTranscript(payload: GhlOnboardingWebhook): string {
  const raw = payload.transcript ?? payload.callTranscript;
  if (!raw) return "";
  if (typeof raw === "string") return raw.trim();
  return raw.map(turnToLine).filter(Boolean).join("\n").trim();
}

/**
 * Stable identity for a delivery. GHL does not guarantee an `eventId` on every action, so
 * fall back to the call/contact identifiers before giving up and treating the delivery as
 * unique (which only costs a duplicate staging row, never a lost onboarding).
 */
export function resolveEventId(payload: GhlOnboardingWebhook): string | null {
  return payload.eventId ?? payload.id ?? payload.callId ?? null;
}

export function resolveClient(payload: GhlOnboardingWebhook): {
  businessName: string | null;
  contactName: string | null;
  email: string | null;
  phone: string | null;
} {
  return {
    businessName: payload.businessName ?? payload.companyName ?? null,
    contactName: payload.contactName ?? payload.fullName ?? null,
    email: payload.email ?? null,
    phone: payload.phone ?? null,
  };
}
