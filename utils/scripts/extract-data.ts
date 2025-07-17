import pg, { QueryResult } from "pg";
import { manuelleSkoler } from "./manuelle-skoler";

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
              select fylkesnummer, kommunenummer, skolenavn, organisasjonsnummer, lavestetrinn, hoyestetrinn, eierforhold, besoksadresse_besoksadresse_adressenavn
              from grunnskoler_3697913259634315b061b324a3f2cf59.grunnskole
              where idrift = 'Ja'
              order by skolenavn
    `),
  ) as [string, string, string, string, number, number, string, string][];
  manuelleSkoler.forEach((skole) => skoler.push(skole));
  skoler.sort(
    (a, b) => a[2].localeCompare(b[2], "no") || a[3].localeCompare(b[3]),
  );

  const kommuner = extractResult(
    await client.query(`
              select substring(kommunenummer, 1, 2), kommunenummer, kommunenavn
              from kommuner_95b1247e0400454f971d957671dc3744.kommune
              order by kommunenavn
    `),
  ) as [string, string, string][];
  kommuner.sort(
    (a, b) => a[2].localeCompare(b[2], "no") || a[1].localeCompare(b[1]),
  );

  const fylker = extractResult(
    await client.query(`
              select distinct fylkesnummer, fylkesnavn
              from fylker_1dff46b89a214c618be1c2369235144c.fylke
              order by fylkesnavn
    `),
  ) as [string, string][];
  fylker.sort((a, b) => a[1].localeCompare(b[1], "no"));

  console.log(
    "const fylker = [\n  " +
      fylker.map((f) => JSON.stringify(f)).join(",\n  ") +
      "\n];",
  );
  console.log(
    "const kommuner = [\n  " +
      kommuner.map((f) => JSON.stringify(f)).join(",\n  ") +
      "\n];",
  );
  console.log(
    "const skoler = [\n  " +
      skoler.map((f) => JSON.stringify(f)).join(",\n  ") +
      "\n];",
  );
  await client.end();
}

extractData().then(() => {});
