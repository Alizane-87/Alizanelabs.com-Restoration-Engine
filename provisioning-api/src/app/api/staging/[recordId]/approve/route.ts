import { z } from "zod";

import { getEnv, isSheetsConfigured } from "@/lib/env";
import { logger } from "@/lib/logger";
import { isAuthorizedInternalRequest } from "@/lib/security/auth";
import { findStagingRow, updateStagingStatus } from "@/lib/staging/sheets";
import { STAGING_COLUMNS } from "@/lib/staging/record";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  approvedBy: z.string().min(1),
  /** Must be true to approve a record carrying high-severity flags. */
  acknowledgeFlags: z.boolean().default(false),
});

const HIGH_FLAG_COUNT_INDEX = STAGING_COLUMNS.indexOf("highSeverityFlagCount");
const FACTS_INDEX = STAGING_COLUMNS.indexOf("factsJson");

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

/**
 * Marks a staged interview as approved. This is the only transition out of PENDING_REVIEW, and
 * it is a human decision: nothing here writes to the client's live chatbot. The response hands
 * the verified JSON back so the reviewer can push it live (manually today, via a publish
 * adapter once one exists).
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ recordId: string }> },
): Promise<Response> {
  if (!isAuthorizedInternalRequest(request.headers)) {
    return json({ error: "unauthorized" }, 401);
  }

  const env = getEnv();
  if (!isSheetsConfigured(env)) {
    return json({ error: "sheets_not_configured" }, 501);
  }

  const { recordId } = await context.params;

  let parsedBody;
  try {
    parsedBody = bodySchema.safeParse(await request.json());
  } catch {
    return json({ error: "invalid_json" }, 400);
  }
  if (!parsedBody.success) {
    return json({ error: "invalid_payload" }, 422);
  }

  const row = await findStagingRow(recordId);
  if (!row) return json({ error: "not_found" }, 404);

  if (row.status !== "PENDING_REVIEW") {
    return json({ error: "invalid_status", status: row.status }, 409);
  }

  const highFlagCount = Number(row.values[HIGH_FLAG_COUNT_INDEX] ?? "0");
  if (highFlagCount > 0 && !parsedBody.data.acknowledgeFlags) {
    return json(
      {
        error: "high_severity_flags_present",
        highSeverityFlagCount: highFlagCount,
        hint: "Re-send with acknowledgeFlags: true once the flagged facts have been checked against the recording.",
      },
      409,
    );
  }

  const approvedAt = new Date().toISOString();
  await updateStagingStatus({
    rowNumber: row.rowNumber,
    status: "APPROVED",
    approvedBy: parsedBody.data.approvedBy,
    approvedAt,
  });

  logger.info("Staged record approved", {
    recordId,
    approvedBy: parsedBody.data.approvedBy,
    highSeverityFlagCount: highFlagCount,
  });

  let facts: unknown = null;
  const factsJson = row.values[FACTS_INDEX];
  if (factsJson) {
    try {
      facts = JSON.parse(factsJson);
    } catch {
      facts = null;
    }
  }

  return json(
    {
      status: "APPROVED",
      recordId,
      approvedAt,
      approvedBy: parsedBody.data.approvedBy,
      facts,
      publish: {
        performed: false,
        reason: "Publishing to the live chatbot is a manual step by design; no data was injected.",
      },
    },
    200,
  );
}
