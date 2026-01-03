import { KlassetrinnType } from "../../static/pledgeData.js";
import { skoler } from "../../static/data.js";

import { Email } from "./email/template/email.js";
import { readPledges } from "./read-pledges.js";

const summary: Record<
  string,
  {
    navn: string;
    pledgesPerTrinn: Partial<
      Record<
        KlassetrinnType,
        {
          foresattNavn: string;
          foresattEmail: string;
          samtykkeDele: boolean;
          bekreftet: boolean;
        }[]
      >
    >;
  }
> = {};

const skolerPerOrgnr = new Map(
  skoler.map(([fylkesnummer, kommunenummer, navn, orgnr]) => [
    orgnr,
    { fylkesnummer, kommunenummer, navn, orgnr },
  ]),
);

for (const {
  foresattNavn,
  foresattEmail,
  skoleOrgnr,
  klassetrinn,
  samtykkeDele,
  bekreftet,
} of readPledges()) {
  if (!summary[skoleOrgnr]) {
    let skole = skolerPerOrgnr.get(skoleOrgnr);
    if (!skole) {
      console.error("Missing skole", skoleOrgnr);
      continue;
    }
    // TODO: Testing
    if (skole.navn !== "Biss Sentrum AS") continue;
    const { navn } = skole;
    summary[skoleOrgnr] = { pledgesPerTrinn: {}, navn };
  }

  summary[skoleOrgnr].pledgesPerTrinn[klassetrinn] ||= [];
  summary[skoleOrgnr].pledgesPerTrinn[klassetrinn].push({
    foresattNavn,
    foresattEmail,
    samtykkeDele,
    bekreftet,
  });
}

const recipients: Email[] = [];

for (const skole of Object.values(summary)) {
  for (const [trinn, pledges] of Object.entries(skole.pledgesPerTrinn)) {
    if (pledges.length < 5) continue;
    const emailData = {
      skole: skole.navn,
      trinn: trinn as KlassetrinnType,
      foresatteSomDeler: pledges
        .filter((p) => p.bekreftet && p.samtykkeDele)
        .map((p) => ({
          navn: p.foresattNavn,
          email: p.foresattEmail,
        })),
      pledgeCount: pledges.length,
    };
    for (const pledge of pledges) {
      recipients.push({
        recipientEmail: pledge.foresattEmail,
        recipientName: pledge.foresattNavn,
        emailContent: {
          type:
            pledge.samtykkeDele && pledge.bekreftet
              ? "EmailDataTrinnMedDeling"
              : "EmailDataTrinnUtenDeling",
          ...emailData,
        },
      });
    }
  }
}

console.log(
  `import { Email } from "../email/template/email.js";
export const recipients: Email[]  = ${JSON.stringify(recipients, null, 2)};
`,
);

console.error(recipients.length, "email");
