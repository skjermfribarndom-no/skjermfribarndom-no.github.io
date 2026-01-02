import { Email, EmailContent } from "./template/email.js";
import { createEmailTrinnUtenDeling } from "./template/emailTrinnUtenDeling.js";
import { createEmailTrinnMedDeling } from "./template/emailTrinnMedDeling.js";

function createContent(recipient: Email): EmailContent {
  const emailContent = recipient.emailContent;
  if (emailContent.type === "EmailDataTrinnUtenDeling") {
    return createEmailTrinnUtenDeling(recipient, emailContent);
  } else if (emailContent.type === "EmailDataTrinnMedDeling") {
    return createEmailTrinnMedDeling(recipient, emailContent);
  } else {
    throw new Error("Unmapped type " + recipient.emailContent.type);
  }
}

export function createMailFromTemplate(recipient: Email) {
  return {
    recipientEmail: recipient.recipientEmail,
    recipientName: recipient.recipientName,
    ...createContent(recipient),
  };
}
