import * as fs from "node:fs";

if (process.argv.length < 2) {
  console.error("Please specify csv file");
  process.exit(1);
}

const lines = fs.readFileSync(process.argv[2], "utf8").split("\n");
console.log(
  lines.map((l) => " " + JSON.stringify(l.split("\t")) + ",").join("\n"),
);
