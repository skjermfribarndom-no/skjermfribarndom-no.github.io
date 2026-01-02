import { KlassetrinnType } from "../../../../static/pledgeData.js";

function ordinal(n: number) {
  return (
    [
      undefined,
      "første",
      "andre",
      "tredje",
      "fjerde",
      "femte",
      "sjette",
      "syvende",
      "åttende",
      "niende",
      "tiende",
      "ellevte",
    ][n] || `${n}.`
  );
}

export function trinn(trinn: KlassetrinnType) {
  return ordinal(parseInt(trinn)) + " trinn";
}
