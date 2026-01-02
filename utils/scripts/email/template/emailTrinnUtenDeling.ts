import { KlassetrinnType } from "../../../../static/pledgeData.js";
import { Email, EmailContent } from "./email.js";
import { trinn } from "./util.js";

export interface EmailDataTrinnUtenDeling {
  type: "EmailDataTrinnUtenDeling";
  skole: string;
  trinn: KlassetrinnType;
  foresatteSomDeler: { navn: string; email: string }[];
  pledgeCount: number;
}

export function createEmailTrinnUtenDeling(
  recipient: Email,
  data: EmailDataTrinnUtenDeling,
): EmailContent {
  return {
    subject: `Signaturer fra ${trinn(data.trinn)} på ${data.skole} (uten deling)`,
    plainText: `Hei ${recipient.recipientName}

Det er nå ${data.pledgeCount} som har signert løftet på ${data.skole} i ${trinn(data.trinn)}. De som har valgt å sin kontaktinfo er følgende:

${data.foresatteSomDeler.map((p) => `* ${p.navn} <${p.email}>`).join("\n")}

Du har ikke valgt å dele din kontaktinformasjon og de andre foreldrene har derfor ikke mottatt denne.

Hilsen skjermfri barndom
`,
    html: `<p>Hei ${recipient.recipientName}</p>

<p>Det er nå ${data.pledgeCount} som har signert løftet på ${data.skole} i ${trinn(data.trinn)}. De som har valgt å sin kontaktinfo er følgende:</p>

<ul>
${data.foresatteSomDeler.map((p) => `<li>${p.navn} &lt;${p.email}&gt;</li>`).join("\n")}
</ul>

<p>Du har ikke valgt å dele din kontaktinformasjon og de andre foreldrene har derfor ikke mottatt denne.</p>

<p>Hilsen skjermfri barndom</p>
`,
  };
}
