function base64UrlEncode(message: string) {
  return Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function utf8encode(s: string) {
  if (/^[\x00-\x7F]*$/.test(s)) return s;

  const base64 = Buffer.from(s, "utf8").toString("base64");
  return `=?UTF-8?B?${base64}?=`;
}

interface EmailMessage {
  recipientEmail: string;
  recipientName: string | undefined;
  subject: string;
  plainText: string;
  html: string | undefined;
}

function createRfc2822Email({
  recipientEmail,
  recipientName,
  subject,
  plainText,
  html,
}: EmailMessage) {
  const recipient = recipientName
    ? `To: ${recipientName} <${recipientEmail}>`
    : `To: ${recipientEmail}`;
  if (html) {
    const boundary = "BOUNDARY_" + Math.random().toString(36).slice(2, 12);
    return [
      recipient,
      `Subject: ${utf8encode(subject)}`,
      `MIME-Version: 1.0`,
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      "",
      `--${boundary}`,
      `Content-Type: text/plain; charset="UTF-8"`,
      "",
      plainText,
      `--${boundary}`,
      `Content-Type: text/html; charset="UTF-8"`,
      "",
      html,
    ].join("\r\n");
  } else {
    return [
      recipient,
      `Subject: ${utf8encode(subject)}`,
      'Content-Type: text/plain; charset="UTF-8"',
      "",
      plainText,
    ].join("\r\n");
  }
}

export function createGmail(message: EmailMessage) {
  return base64UrlEncode(createRfc2822Email(message));
}
