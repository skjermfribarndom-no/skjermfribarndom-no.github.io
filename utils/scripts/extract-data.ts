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
              select fylkesnummer, kommunenummer, skolenavn, organisasjonsnummer, lavestetrinn, hoyestetrinn, eierforhold
              from grunnskoler_f2c098368a42404cb380fef3f8c92545.grunnskole
              where idrift = 'Ja'
              order by skolenavn
    `),
  );
  const kommuner = extractResult(
    await client.query(`
              select substring(kommunenummer, 1, 2), kommunenummer, kommunenavn
              from kommuner_98f359e5da864eedbef9a3f0f8dd438f.kommune
              order by kommunenavn
    `),
  );
  const fylker = extractResult(
    await client.query(`
              select distinct fylkesnummer, fylkesnavn
              from fylker_f5ebc56204d5463496260e99cba427e8.fylke
              order by fylkesnavn
    `),
  );
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
