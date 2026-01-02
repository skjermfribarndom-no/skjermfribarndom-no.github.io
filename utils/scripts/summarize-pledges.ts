import jsonPledges from "../tmp/pledges.json" assert { type: "json" };
import { fylker, kommuner, skoler } from "../../static/data.js";
import {
  KlassetrinnType,
  PledgeMap,
  SchoolPledgeMap,
} from "../../static/pledgeData.js";

const pledgesByFylke = Object.fromEntries(
  fylker.map(([k, v]) => [k, { navn: v, kommuner: {} }]),
) as PledgeMap;
kommuner.forEach(([fylkenr, kommunenummer, navn]) => {
  if (!pledgesByFylke[fylkenr]) throw Error(`Missing fylke ${fylkenr}`);
  pledgesByFylke[fylkenr].kommuner[kommunenummer] = { navn, skoler: {} };
});
const skolerPerOrgnr = new Map(
  skoler.map(([fylkesnummer, kommunenummer, navn, orgnr]) => [
    orgnr,
    { fylkesnummer, kommunenummer, navn, orgnr },
  ]),
);
const data: {
  "Skole orgnr": string;
  Skole: string;
  Klassetrinn: KlassetrinnType;
}[] = jsonPledges as any;

const summary: SchoolPledgeMap = {};

for (const { "Skole orgnr": orgnr, Klassetrinn } of data) {
  if (!summary[orgnr]) summary[orgnr] = { total: 0, perKlassetrinn: {} };
  summary[orgnr].total++;
  summary[orgnr].perKlassetrinn[Klassetrinn] ||= 0;
  summary[orgnr].perKlassetrinn[Klassetrinn]++;
}

const schools = Object.fromEntries(
  Object.entries(summary).filter(([, v]) => v.total >= 5),
) as typeof summary;

Object.entries(schools).forEach(([orgnr, data]) => {
  const skole = skolerPerOrgnr.get(orgnr)!;
  if (!skole) {
    console.error("Can't find skole", orgnr);
  } else {
    pledgesByFylke[skole.fylkesnummer].kommuner[skole.kommunenummer].skoler[
      orgnr
    ] = {
      navn: skole.navn,
      data,
    };
  }
});

console.log(
  "const pledges = " +
    JSON.stringify(
      { date: new Date(), pledgeCount: data.length, schools, pledgesByFylke },
      null,
      2,
    ),
);
