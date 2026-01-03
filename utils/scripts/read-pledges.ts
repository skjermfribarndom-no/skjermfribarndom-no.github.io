import { KlassetrinnType } from "../../static/pledgeData.js";
import jsonPledges from "../tmp/pledges.json";

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

export interface Signatur {
  foresattNavn: string;
  foresattEmail: string;
  bekreftet: boolean;
  samtykkeDele: boolean;
  klassetrinn: KlassetrinnType;
  skoleOrgnr: string;
}

export function readPledges(): Signatur[] {
  const result: Signatur[] = [];
  for (const {
    "Skole orgnr": skoleOrgnr,
    Klassetrinn,
    Registrert,
    "Navn foresatt": foresattNavn,
    Email: foresattEmail,
    "Samtykke dele": samtykkeDeleString,
    Status,
  } of data) {
    let trinn = parseInt(Klassetrinn);
    const registrert = new Date(Registrert);
    if (registrert.getTime() < new Date(2024, 8, 18).getTime()) {
      if (++trinn > 10) {
        continue;
      }
    }
    const klassetrinn = trinn.toString() as KlassetrinnType;

    result.push({
      skoleOrgnr,
      foresattEmail,
      foresattNavn,
      klassetrinn,
      bekreftet: Status === "Confirmed",
      samtykkeDele: samtykkeDeleString === "on",
    });
  }
  return result;
}
