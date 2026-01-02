import { KlassetrinnType } from "../../../../static/pledgeData.js";
import { Email, EmailContent } from "./email.js";
import { trinn } from "./util.js";

export interface EmailDataTrinnMedDeling {
  type: "EmailDataTrinnMedDeling";
  skole: string;
  trinn: KlassetrinnType;
  foresatteSomDeler: { navn: string; email: string }[];
  pledgeCount: number;
}

export function createEmailTrinnMedDeling(
  recipient: Email,
  data: EmailDataTrinnMedDeling,
): EmailContent {
  return {
    subject: `Signaturer fra ${trinn(data.trinn)} på ${data.skole}`,
    plainText: `Hei ${recipient.recipientName}

Det er nå ${data.pledgeCount} som har signert løftet på ${data.skole} i ${trinn(data.trinn)}. De som har valgt å sin kontaktinfo er følgende:

${data.foresatteSomDeler.map((p) => `* ${p.navn} <${p.email}>`).join("\n")}

Du har valgt å dele din kontaktinformasjon og de andre foreldrene har derfor mottatt denne.

Hilsen skjermfri barndom  
`,
    html: undefined,
  };
}
