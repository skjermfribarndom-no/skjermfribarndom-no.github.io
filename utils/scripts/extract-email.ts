import { KlassetrinnType } from "../../static/pledgeData.js";
import jsonPledges from "../tmp/pledges.json";
import { skoler } from "../../static/data.js";

import { Email } from "./email/template/email.js";

const data: {
  Status: "Email sent" | "Registrert med gammelt skjema" | "Confirmed";
  "Skole orgnr": string;
  Skole: string;
  "Navn foresatt": string;
  Email: string;
  Klassetrinn: KlassetrinnType;
  "Samtykke dele": "on" | "";
  Registrert: string;
}[] = jsonPledges as any;

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
  "Skole orgnr": orgnr,
  Skole,
  Klassetrinn,
  Registrert,
  "Navn foresatt": foresattNavn,
  Email: foresattEmail,
  "Samtykke dele": samtykkeDele,
  Status,
} of data) {
  if (!summary[orgnr]) {
    let skole = skolerPerOrgnr.get(orgnr);
    if (!skole) {
      console.error("Missing skole", Skole, orgnr);
      continue;
    }
    // TODO: Testing
    if (skole.navn !== "Biss Sentrum AS") continue;
    const { navn } = skole;
    summary[orgnr] = { pledgesPerTrinn: {}, navn };
  }

  let trinn = parseInt(Klassetrinn);
  const registrert = new Date(Registrert);
  if (registrert.getTime() < new Date(2024, 8, 18).getTime()) {
    if (++trinn > 10) {
      continue;
    }
  }
  const klassetrinn = trinn.toString() as KlassetrinnType;
  summary[orgnr].pledgesPerTrinn[klassetrinn] ||= [];
  summary[orgnr].pledgesPerTrinn[klassetrinn].push({
    foresattNavn,
    foresattEmail,
    samtykkeDele: samtykkeDele === "on",
    bekreftet: Status === "Confirmed",
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
