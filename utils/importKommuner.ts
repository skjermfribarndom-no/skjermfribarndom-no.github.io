import * as fs from "node:fs";
import { parse } from "csv-parse/sync";

if (process.argv.length < 2) {
  console.error("Please specify csv file");
  process.exit(1);
}

const csv = parse(fs.readFileSync(process.argv[2], "latin1"), {
  columns: true,
  delimiter: ";",
  relaxColumnCount: true,
}) as any[];
fs.writeFileSync(
  "kommmuner.js",
  JSON.stringify(
    csv.map(({ code, name }) => [code.substring(0, 2), code, name]),
  ),
);
