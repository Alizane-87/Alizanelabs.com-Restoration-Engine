/** Imported first by tests so that lazy env validation sees a complete configuration. */
export const TEST_WEBHOOK_SECRET = "test-webhook-secret-value";
export const TEST_APPROVAL_TOKEN = "test-approval-token-value";

process.env.GHL_WEBHOOK_SECRET = TEST_WEBHOOK_SECRET;
process.env.APPROVAL_API_TOKEN = TEST_APPROVAL_TOKEN;
process.env.OPENAI_API_KEY = "sk-test";
process.env.OPENAI_EXTRACTION_MODEL = "gpt-4o-mini";
process.env.GOOGLE_SHEETS_SPREADSHEET_ID = "sheet-id";
process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = "svc@example.iam.gserviceaccount.com";
process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\\nx\\n-----END PRIVATE KEY-----\\n";
process.env.SLACK_WEBHOOK_URL = "https://hooks.slack.example/T000/B000/xxx";
process.env.APP_BASE_URL = "https://provisioning.test";
