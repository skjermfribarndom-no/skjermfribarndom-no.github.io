function base64Encode(message: string) {
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

export function createGmail({
  recipientEmail,
  recipientName,
  subject,
  plainText,
  html,
}: {
  recipientEmail: string;
  recipientName: string | undefined;
  subject: string;
  plainText: string;
  html: string | undefined;
}) {
  const message = [
    recipientName
      ? `To: ${recipientName} <${recipientEmail}>`
      : `To: ${recipientEmail}`,
    `Subject: ${utf8encode(subject)}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "",
    plainText,
  ].join("\r\n");

  return base64Encode(message);
}
