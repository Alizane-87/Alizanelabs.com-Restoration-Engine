import { JWT } from "google-auth-library";

import { getEnv, isSheetsConfigured } from "@/lib/env";
import {
  APPROVED_AT_COLUMN_INDEX,
  APPROVED_BY_COLUMN_INDEX,
  STAGING_COLUMNS,
  STATUS_COLUMN_INDEX,
  recordToRow,
  type StagingRecord,
  type StagingStatus,
} from "@/lib/staging/record";

const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const API_BASE = "https://sheets.googleapis.com/v4/spreadsheets";

function normalizePrivateKey(raw: string): string {
  // Vercel env vars cannot hold real newlines, so accept "\n" escapes or a base64 blob.
  if (raw.includes("BEGIN PRIVATE KEY")) return raw.replace(/\\n/g, "\n");
  return Buffer.from(raw, "base64").toString("utf8");
}

let jwt: JWT | null = null;

function getJwt(): JWT {
  const env = getEnv();
  if (!isSheetsConfigured(env)) throw new Error("Google Sheets is not configured");
  if (!jwt) {
    jwt = new JWT({
      email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: normalizePrivateKey(env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY!),
      scopes: [SHEETS_SCOPE],
    });
  }
  return jwt;
}

async function sheetsRequest(
  path: string,
  init: { method: string; body?: unknown; query?: Record<string, string> },
): Promise<unknown> {
  const env = getEnv();
  const token = await getJwt().getAccessToken();
  const url = new URL(`${API_BASE}/${env.GOOGLE_SHEETS_SPREADSHEET_ID}${path}`);
  for (const [key, value] of Object.entries(init.query ?? {})) url.searchParams.set(key, value);

  const response = await fetch(url, {
    method: init.method,
    headers: {
      authorization: `Bearer ${token.token}`,
      "content-type": "application/json",
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Google Sheets API ${init.method} ${path} failed (${response.status}): ${detail.slice(0, 500)}`);
  }
  return response.json();
}

function quoteTab(tab: string): string {
  return `'${tab.replace(/'/g, "''")}'`;
}

/** Appends a staged record. The sheet is the queue: one row per interview awaiting review. */
export async function appendStagingRow(record: StagingRecord): Promise<void> {
  const env = getEnv();
  await sheetsRequest(`/values/${encodeURIComponent(`${quoteTab(env.GOOGLE_SHEETS_TAB)}!A1`)}:append`, {
    method: "POST",
    query: { valueInputOption: "RAW", insertDataOption: "INSERT_ROWS" },
    body: { values: [recordToRow(record)] },
  });
}

export interface StagedRow {
  /** 1-based sheet row number, so callers can address cells directly. */
  rowNumber: number;
  values: string[];
  status: string;
}

export async function findStagingRow(recordId: string): Promise<StagedRow | null> {
  const env = getEnv();
  const lastColumn = String.fromCharCode("A".charCodeAt(0) + STAGING_COLUMNS.length - 1);
  const range = `${quoteTab(env.GOOGLE_SHEETS_TAB)}!A1:${lastColumn}`;
  const result = (await sheetsRequest(`/values/${encodeURIComponent(range)}`, { method: "GET" })) as {
    values?: string[][];
  };

  const rows = result.values ?? [];
  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    if (row?.[0] === recordId) {
      return {
        rowNumber: index + 1,
        values: row,
        status: row[STATUS_COLUMN_INDEX] ?? "",
      };
    }
  }
  return null;
}

export async function updateStagingStatus(options: {
  rowNumber: number;
  status: StagingStatus;
  approvedBy: string;
  approvedAt: string;
}): Promise<void> {
  const env = getEnv();
  const tab = quoteTab(env.GOOGLE_SHEETS_TAB);
  const statusColumn = String.fromCharCode("A".charCodeAt(0) + STATUS_COLUMN_INDEX);
  const approvedAtColumn = String.fromCharCode("A".charCodeAt(0) + APPROVED_AT_COLUMN_INDEX);
  const approvedByColumn = String.fromCharCode("A".charCodeAt(0) + APPROVED_BY_COLUMN_INDEX);

  await sheetsRequest(`/values:batchUpdate`, {
    method: "POST",
    body: {
      valueInputOption: "RAW",
      data: [
        {
          range: `${tab}!${statusColumn}${options.rowNumber}`,
          values: [[options.status]],
        },
        {
          range: `${tab}!${approvedAtColumn}${options.rowNumber}:${approvedByColumn}${options.rowNumber}`,
          values: [[options.approvedAt, options.approvedBy]],
        },
      ],
    },
  });
}

/** Test helper: drops the cached signer. */
export function resetSheetsClient(): void {
  jwt = null;
}
