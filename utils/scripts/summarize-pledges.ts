import { fylker, kommuner, skoler } from "../../static/data.js";
import { PledgeMap, SchoolPledgeMap } from "../../static/pledgeData.js";
import { readPledges } from "./read-pledges.js";

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

const summary: SchoolPledgeMap = {};

let pledges = readPledges();
for (const { skoleOrgnr, klassetrinn } of pledges) {
  if (!summary[skoleOrgnr])
    summary[skoleOrgnr] = { total: 0, perKlassetrinn: {} };

  summary[skoleOrgnr].total++;
  summary[skoleOrgnr].perKlassetrinn[klassetrinn] ||= 0;
  summary[skoleOrgnr].perKlassetrinn[klassetrinn]++;
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
      {
        date: new Date(),
        pledgeCount: pledges.length,
        schools,
        pledgesByFylke,
      },
      null,
      2,
    ),
);
