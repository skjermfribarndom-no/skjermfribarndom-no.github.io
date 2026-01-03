import pg, { QueryResult } from "pg";
import { manuelleSkoler } from "./manuelle-skoler.js";

const { Client } = pg;

function extractResult(res: QueryResult) {
  return res.rows.map((o) => Object.values(o));
}

async function extractData() {
  const client = new Client({
    user: "postgres",
  });
  await client.connect();
  const skoler = extractResult(
    await client.query(`
              select fylkesnummer, kommunenummer, skolenavn, organisasjonsnummer, lavestetrinn, hoyestetrinn, eierforhold, besoksadresse_adressenavn
              from grunnskoler_3a4abd9431b343bf98983af1b042ba7d.grunnskole
              where idrift
              order by skolenavn
    `),
  ) as [
    string,
    string,
    string,
    string,
    number | null,
    number | null,
    string,
    string | null,
  ][];

  for (const [, , manuellOrgnr] of manuelleSkoler) {
    if (skoler.find(([, , , orgnr]) => orgnr === manuellOrgnr)) {
      console.warn("Manuell skole finnes i databasen", manuellOrgnr);
    }
  }

  manuelleSkoler.forEach((skole) => skoler.push(skole));
  skoler.sort(
    (a, b) => a[2].localeCompare(b[2], "no") || a[3].localeCompare(b[3]),
  );

  const kommuner = extractResult(
    await client.query(`
              select substring(kommunenummer, 1, 2), kommunenummer, kommunenavn
              from kommuner_627ee106072240e99d2b21ec4717bf01.kommune
              order by kommunenavn
    `),
  ) as [string, string, string][];
  kommuner.sort(
    (a, b) => a[2].localeCompare(b[2], "no") || a[1].localeCompare(b[1]),
  );

  const fylker = extractResult(
    await client.query(`
              select fylkesnummer, coalesce(a.navn, fylke.fylkesnavn)
              from fylker_a60155918c4a47c2b78f4ab52fc2bfa4.fylke
                left outer join fylker_a60155918c4a47c2b78f4ab52fc2bfa4.administrativenhetnavn a on fylke.lokalid = a.fylke_fk and a.sprak = 'nor'
              order by coalesce(a.navn, fylke.fylkesnavn)
    `),
  ) as [string, string][];
  fylker.sort((a, b) => a[1].localeCompare(b[1], "no"));

  console.log(
    "export const fylker = [\n  " +
      fylker.map((f) => JSON.stringify(f)).join(",\n  ") +
      "\n];",
  );
  console.log(
    "export const kommuner = [\n  " +
      kommuner.map((f) => JSON.stringify(f)).join(",\n  ") +
      "\n];",
  );
  console.log(
    "export const skoler = [\n  " +
      skoler.map((f) => JSON.stringify(f)).join(",\n  ") +
      "\n];",
  );
  await client.end();
}

extractData().then(() => {});
