import { EmailDataTrinnUtenDeling } from "./emailTrinnUtenDeling.js";
import { EmailDataTrinnMedDeling } from "./emailTrinnMedDeling.js";

export interface Email {
  recipientEmail: string;
  recipientName: string | undefined;
  emailContent: EmailContentData;
}

export type EmailContentData =
  | EmailDataTrinnUtenDeling
  | EmailDataTrinnMedDeling;

export interface EmailContent {
  subject: string;
  plainText: string;
  html: string | undefined;
}
