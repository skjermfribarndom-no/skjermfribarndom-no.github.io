import pg, { QueryResult } from "pg";

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
  // Manually added. Information from https://data-nsr.udir.no/swagger/
  skoler.push(
    [
      "55",
      "5501",
      "Ekrehagen skole",
      "973255428",
      1,
      10,
      "Privat",
      "Dramsveien 530",
    ],
    [
      "34",
      "3407",
      "Kopperud",
      "975294935",
      1,
      10,
      "Offentlig",
      "Vestre Totenveg 234 - 236",
    ],
    [
      "55",
      "5501",
      "Gyllenborg skole",
      "974566311",
      1,
      10,
      "Offentlig",
      "Skolegata 34/36",
    ],
    [
      "03",
      "0301",
      "Lyse montessoriskole",
      "979554796",
      1,
      7,
      "Privat",
      "Hoffsjef Løvenskiolds vei 31C",
    ],
  );
  skoler.sort(
    (a, b) => a[2].localeCompare(b[2], "no") || a[3].localeCompare(b[3]),
  );

  const kommuner = extractResult(
    await client.query(`
              select substring(kommunenummer, 1, 2), kommunenummer, kommunenavn
              from kommuner_4d2a1f720b994f11baaeae13ee600c8e.kommune
              order by kommunenavn
    `),
  ) as [string, string, string][];
  kommuner.sort(
    (a, b) => a[2].localeCompare(b[2], "no") || a[1].localeCompare(b[1]),
  );

  const fylker = extractResult(
    await client.query(`
              select distinct fylkesnummer, fylkesnavn
              from fylker_f5ebc56204d5463496260e99cba427e8.fylke
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
