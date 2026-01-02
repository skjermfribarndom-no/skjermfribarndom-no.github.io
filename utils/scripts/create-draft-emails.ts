import { google } from "googleapis";
import { createGmail } from "./email/createGmail.js";
import { createMailFromTemplate } from "./email/email-templates.js";
import { recipients } from "./tmp/recipients.js";

const auth = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
);
auth.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});
const gmail = google.gmail({ auth, version: "v1" });

const reviewLabel = "BULK_REVIEW";

async function findOrCreateLabel(name: string) {
  const res = await gmail.users.labels.list({ userId: "me" });
  const labels = res.data.labels as { id: string; name: string }[];
  const existing = labels.find((l) => l.name === name);
  if (existing) return existing.id;
  const newLabel = await gmail.users.labels.create({
    userId: "me",
    requestBody: {
      name,
      labelListVisibility: "labelShow",
      messageListVisibility: "show",
    },
  });
  return newLabel.data.id;
}

const labelId = await findOrCreateLabel(reviewLabel);

for (const recipient of recipients) {
  const existingMails = await gmail.users.messages.list({
    userId: "me",
    q: `to:${recipient.recipientEmail} label:template/${recipient.emailContent.type}`,
  });
  if (existingMails.data.messages?.length > 0) {
    console.log(
      `${recipient.recipientEmail} has already received ${recipient.emailContent.type}. Skipping!`,
    );
    continue;
  }
  console.log(
    `Creating draft ${recipient.emailContent.type} to ${recipient.recipientEmail}`,
  );

  const email = createMailFromTemplate(recipient);
  const message = createGmail(email);
  const mail = await gmail.users.drafts.create({
    userId: "me",
    requestBody: { message: { raw: message } },
  });
  const templateLabelId = await findOrCreateLabel(
    "template/" + recipient.emailContent.type,
  );
  await gmail.users.messages.modify({
    userId: "me",
    id: mail.data.message.id,
    requestBody: { addLabelIds: [labelId, templateLabelId] },
  });
}
