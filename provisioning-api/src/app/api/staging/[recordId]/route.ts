import { getEnv, isSheetsConfigured } from "@/lib/env";
import { isAuthorizedInternalRequest } from "@/lib/security/auth";
import { STAGING_COLUMNS } from "@/lib/staging/record";
import { findStagingRow } from "@/lib/staging/sheets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

/** Reads one staged record back, so a reviewer can inspect it without opening the sheet. */
export async function GET(
  request: Request,
  context: { params: Promise<{ recordId: string }> },
): Promise<Response> {
  if (!isAuthorizedInternalRequest(request.headers)) {
    return json({ error: "unauthorized" }, 401);
  }
  if (!isSheetsConfigured(getEnv())) {
    return json({ error: "sheets_not_configured" }, 501);
  }

  const { recordId } = await context.params;
  const row = await findStagingRow(recordId);
  if (!row) return json({ error: "not_found" }, 404);

  const record = Object.fromEntries(
    STAGING_COLUMNS.map((column, index) => [column, row.values[index] ?? ""]),
  );

  return json({ rowNumber: row.rowNumber, record }, 200);
}
