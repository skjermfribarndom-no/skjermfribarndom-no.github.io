import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });

const spreadsheetId = process.env.SPREADSHEET_ID;
const range = "Sheet1";

const res = await sheets.spreadsheets.values.get({
  spreadsheetId,
  range,
});

const values = res.data.values ?? [];
if (values.length === 0) {
  console.log("[]");
  process.exit(0);
}

const [header, ...rows] = values as any[][];

const json = rows.map((row) =>
  Object.fromEntries(header.map((key, i) => [key, row[i] ?? null])),
);

console.log(JSON.stringify(json, null, 2));
