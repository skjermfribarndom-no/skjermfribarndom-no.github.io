import { google } from "googleapis";
import readline from "node:readline/promises";

const oauth2 = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "http://localhost",
);

const SCOPES = ["https://www.googleapis.com/auth/gmail.modify"];

// 1. Get consent URL
const url = oauth2.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
  prompt: "consent", // IMPORTANT
});

console.log("Open this URL in your browser:\n", url);

// 2. Read code from stdin
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const code = await rl.question("\nPaste the code here: ");
rl.close();

// 3. Exchange code for tokens
const { tokens } = await oauth2.getToken(code);

// 👉 SAVE THIS SOMEWHERE SAFE
console.log("REFRESH TOKEN:\n", tokens.refresh_token);
